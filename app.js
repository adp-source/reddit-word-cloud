'use strict';
const express = require('express');
const snoowrap = require('snoowrap');
const Promise = require('bluebird');
const parse = require('url-parse')
const path = require('path');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

const app = express();
const handlebars = require('express-handlebars').create({defaultLayout:'main'});
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(path.resolve(__dirname, 'public')));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

const r = new snoowrap({
  userAgent: 'Reddit Node App by /u/vnlegend',
  clientId: 'PZGXhWudIpw4dg',
  clientSecret: 'pr_bxj6oZJrpRUBDkd2mdXb_5F4',
  username: 'vnlegend',
  password: 'iartwind'
});

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
  context.title = "Home";
  context.home = true;
  res.render('home', context);
});

app.post('/',function(req,res){
  let destUrl = parse(req.body.reddit).pathname.split('/');
  let apiUrl;
  let isComment;
  if(destUrl.includes('comments')){
    apiUrl = destUrl[4];    // get permalink url for submission
    isComment = true;
  }
  else {
    apiUrl = destUrl[2];    // get subreddit url
    isComment = false;
  }
  let context = {};
  context.title = "Home";
  context.home = true;
  if(isComment){
    r.getSubmission(apiUrl).fetch().then(function(result){
      context.text = sanitize(result.comments);
      res.render('home-post', context);
    }, function(err){
      console.log(err)
    });
  }
  else {
    r.getSubreddit(apiUrl).getTop({ time: 'week'}).then(function(result) {
      context.text = sanitize(result);
      res.render('home-post', context);
    }, function(err) {
      console.log(err);
    });
  }
});

app.get('/info',function(req,res){
  let context = {};
  context.title = "Info";
  context.info = true;
  res.render('info', context);
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
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
