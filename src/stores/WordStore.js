var Reflux = require('reflux');

var Word = require('stores/Word');
var FacebookStore = require('stores/FacebookStore');
var WordActions = require('actions/WordActions');
var AwsHelper = require('utils/AwsHelper');


var words = {};

var WordStore = Reflux.createStore({
  listenables: [WordActions],
  getInitialState: function () {
    return words
  },

  onFetchWords: function (wordLists) {
    wordLists = wordLists.filter(function(wordList) {
      return !(wordList in words)
    });
    if(wordLists.length == 0) {
      WordActions.fetchWords.completed(words);
      WordStore.trigger(words);
    }
    else {
      var wordList = wordLists[0];
      AwsHelper.fetchWords(wordList, function (err, data) {
        if (err) {
          WordActions.fetchWords.failed('Dynamodb', err);
          return;
        }
        words[wordList] = data.Items.map(function (item) {
          return Word.fromItem(item)
        });
        WordStore.onFetchWords(wordLists.slice(1));
      });
    }
  },
  onUploadWord: function (wordList, word) {
    AwsHelper.putWord(wordList, word, function (err, data) {
      if (err) {
        WordActions.uploadWord.failed('Dynamodb', err);
        return;
      }
      WordActions.uploadWord.completed();
      if(words.hasOwnProperty(wordList)) {
        words[wordList].push(word);
      }
      else {
        words[wordList] = [word];
      }
      WordStore.trigger(words);
    });
  }
});

module.exports = WordStore;