document.addEventListener('DOMContentLoaded', bindButtons);
document.getElementById('textarea').value = wordsData;

function bindButtons(){
   document.getElementById('saveBtn').addEventListener('click', function(event){
      event.preventDefault();
      let text = document.getElementById('textarea').value;
      let blob = new Blob([text], {type: "text/plain;charset=utf-8"});
      saveAs(blob, "words.txt");
   });
}

d3.wordcloud()
  .selector("#wordcloud")
  .size([970, 500])
  .scale("sqrt") //default: sqrt
  .font("Impact")
  .fill(d3.scale.category20())
  .words(count(wordsData))
  .spiral("archimedean")
  .onwordclick(function(d, i) {window.open("https://www.google.com/search?q=" + d.text);})
  .start();