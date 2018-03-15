'use strict';
const express = require('express');
const snoowrap = require('snoowrap');
const Promise = require('bluebird');
const parse = require('url-parse')
const path = require('path');
const credentials = require('./credentials');

const app = express();
const handlebars = require('express-handlebars').create({defaultLayout:'main'});
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', PORT);

const r = new snoowrap(credentials.reddit);

// return result is an object, not JSON, can't use JSON.parse

function sanitize(input){
  let line;
  let output = [];
  for(let i=0; i<input.length; i++) {
    if(input[i].title){
      line = input[i].title;
    }
    else if(input[i].body){
      line = input[i].body;
    }
    line = line.replace(/[\n\r]/g, "");
    line = line.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "");   // url
    line = line.replace(/[#.:|&;$%@"<>()+,\-\u2026]/g, "");   // symbols using Character Classes
    output.push(line);
  }
  return output;
}

app.get('/',function(req,res){
  let context = {};
  context.title = "Reddit Word Cloud Generator";
  context.home = true;
  res.render('home', context);
});

app.post('/',function(req,res){
  let context = {};
  context.title = "Reddit Word Cloud Generator";
  context.error = "";
  context.home = true;

  let validUrl = true;
  let inputUrl = parse(req.body.reddit);
  let host = inputUrl.hostname.toLowerCase().split('.');
  let destUrl = inputUrl.pathname.toLowerCase().split('/');

  if(!host.includes('reddit')){
    validUrl = false;
  }
  else if(!destUrl.includes('r')){
    validUrl = false;
  }
  else if(destUrl.length < 3){
    validUrl = false;
  }

  if(!validUrl){
    context.error = "Invalid URL Entered.";
    res.render('home-error', context);
    return;
  }

  let apiUrl, isComment;
  if(destUrl.includes('comments') && destUrl.length >= 5){
    apiUrl = destUrl[4];    // get permalink url for submission
    isComment = true;
  }
  else {
    apiUrl = destUrl[2];    // get subreddit url
    isComment = false;
  }
  if(isComment && validUrl){
    r.getSubmission(apiUrl).fetch().then(function(result){
      context.text = sanitize(result.comments);
      res.render('home-post', context);
    }, function(err){
      context.error = "Reddit API query failed. URL may be invalid.";
      res.render('home-error', context);
    });
  }
  else if(validUrl) {
    r.getSubreddit(apiUrl).fetch().then(function(result) {
      r.getSubreddit(apiUrl).getTop({ time: 'week'}).then(function(result){
        context.text = sanitize(result);
        res.render('home-post', context);        
      }, function(err){
        context.error = "Reddit API query failed. URL may be invalid.";
        res.render('home-error', context);
      });
    }, function(err) {
      context.error = "Reddit API query failed. URL may be invalid.";
      res.render('home-error', context);
    });
  }
});

app.get('/resources',function(req,res){
  let context = {};
  context.title = "Resources";
  context.info = true;
  res.render('resources', context);
});

app.get('/about',function(req,res){
  let context = {};
  context.title = "About";
  context.about = true;
  res.render('about', context);
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on port ' + app.get('port') + '; press Ctrl-C to terminate.');
});
