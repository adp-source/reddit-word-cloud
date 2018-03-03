// Wordcount from https://github.com/feifang/d3-wordcloud/tree/master/js

const nlpWords = ["a", "about", "above", "across", "after", "again", "against", "ain", "all", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "an", "and", "another", "any", "anybody", "anyone", "anything", "anywhere", "are", "area", "areas", "aren", "around", "as", "ask", "asked", "asking", "asks", "at", "away", "b", "back", "backed", "backing", "backs", "be", "became", "because", "become", "becomes", "been", "before", "began", "behind", "being", "beings", "below", "best", "better", "between", "big", "both", "but", "by", "c", "came", "can", "cannot", "case", "cases", "certain", "certainly", "clear", "clearly", "come", "could", "couldn", "d", "did", "didn", "differ", "different", "differently", "do", "does", "doesn", "doing", "don", "done", "down", "downed", "downing", "downs", "during", "e", "each", "early", "either", "end", "ended", "ending", "ends", "enough", "even", "evenly", "ever", "every", "everybody", "everyone", "everything", "everywhere", "f", "face", "faces", "fact", "facts", "far", "felt", "few", "find", "finds", "first", "for", "four", "from", "full", "fully", "further", "furthered", "furthering", "furthers", "g", "gave", "general", "generally", "get", "gets", "give", "given", "gives", "go", "going", "good", "goods", "got", "great", "greater", "greatest", "group", "grouped", "grouping", "groups", "h", "had", "hadn", "has", "hasn", "have", "haven", "having", "he", "her", "here", "hers", "herself", "high", "higher", "highest", "him", "himself", "his", "how", "however", "i", "if", "important", "in", "interest", "interested", "interesting", "interests", "into", "is", "isn", "it", "its", "itself", "j", "just", "k", "keep", "keeps", "kind", "knew", "know", "known", "knows", "l", "large", "largely", "last", "later", "latest", "least", "less", "let", "lets", "like", "likely", "ll", "long", "longer", "longest", "m", "ma", "made", "make", "making", "man", "many", "may", "me", "member", "members", "men", "might", "mightn", "more", "most", "mostly", "mr", "mrs", "much", "must", "mustn", "my", "myself", "n", "necessary", "need", "needed", "needing", "needn", "needs", "never", "new", "newer", "newest", "next", "no", "nobody", "non", "noone", "nor", "not", "nothing", "now", "nowhere", "number", "numbers", "o", "of", "off", "often", "old", "older", "oldest", "on", "once", "one", "only", "open", "opened", "opening", "opens", "or", "order", "ordered", "ordering", "orders", "other", "others", "our", "ours", "ourselves", "out", "over", "own", "p", "part", "parted", "parting", "parts", "per", "perhaps", "place", "places", "point", "pointed", "pointing", "points", "possible", "present", "presented", "presenting", "presents", "problem", "problems", "put", "puts", "q", "quite", "r", "rather", "re", "really", "right", "room", "rooms", "s", "said", "same", "saw", "say", "says", "second", "seconds", "see", "seem", "seemed", "seeming", "seems", "sees", "several", "shall", "shan", "she", "should", "shouldn", "show", "showed", "showing", "shows", "side", "sides", "since", "small", "smaller", "smallest", "so", "some", "somebody", "someone", "something", "somewhere", "state", "states", "still", "such", "sure", "t", "take", "taken", "than", "that", "the", "their", "theirs", "them", "themselves", "then", "there", "therefore", "these", "they", "thing", "things", "think", "thinks", "this", "those", "though", "thought", "thoughts", "three", "through", "thus", "to", "today", "together", "too", "took", "toward", "turn", "turned", "turning", "turns", "two", "u", "under", "until", "up", "upon", "us", "use", "used", "uses", "v", "ve", "very", "w", "want", "wanted", "wanting", "wants", "was", "wasn", "way", "ways", "we", "well", "wells", "went", "were", "weren", "what", "when", "where", "whether", "which", "while", "who", "whole", "whom", "whose", "why", "will", "with", "within", "without", "won", "work", "worked", "working", "works", "would", "wouldn", "x", "y", "year", "years", "yet", "you", "ya", "young", "younger", "youngest", "your", "yours", "yourself", "yourselves", "z"];
const symbolWords = ["@", ",", "#", "&", "&amp", "amp", "w/"];

const stopwords = nlpWords.concat(symbolWords);

const count = function (content) {
    let result = [],
        hash = {};

    // tokenization
    let words = content.split(" ");
    words.forEach(function (word) {
      // filter stopwords
      lower = word.toLowerCase();
      if (word !== "" && stopwords.indexOf(lower) < 0) {
        if (!hash[word]) {
          hash[word] = { text: word, size: 0 };
          result.push(hash[word]);
        }
        hash[word].size++;
      }
    });
    return result.sort(function (a, b) { return b.size - a.size;});  // in desc order
};
