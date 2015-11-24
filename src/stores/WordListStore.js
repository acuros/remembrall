var Reflux = require('reflux');
var _ = require('underscore');
var Q = require('q');

var WordListActions = require('actions/WordListActions');
var AwsHelper = require('utils/AwsHelper');


var TABLE_NAME = 'WordList';
var wordLists = [];


var WordListStore = Reflux.createStore({
  listenables: [WordListActions],
  getInitialState: function() {
    return wordLists
  },

  onAddWordList: function(wordList) {
    AwsHelper.putWordList(wordList, function(err, data) {
      if(err) {
        WordListActions.addWordList.failed({
          type: 'Dynamodb',
          msg: err
        });
        return;
      }

      wordLists.push(wordList);
      WordListActions.addWordList.completed();
      WordListStore.trigger(wordLists);
    });
  },

  onFetchWordLists: function() {
    AwsHelper.fetchWordLists(function(err, wordLists_) {
      if (err) {
        WordListActions.fetchWordLists.failed({
          type: 'Dynamodb',
          msg: err
        });
        return;
      }

      wordLists = _.union(wordLists, wordLists_);

      Q.promise(function(resolve) {
          if(!_.contains(wordLists, "Default")) {
            WordListActions.addWordList.triggerAsync("Default").then(function() {
              resolve();
            })
          }
          else
            resolve();
        })
        .then(function() {
          WordListActions.fetchWordLists.completed();
          WordListStore.trigger(wordLists);
        });
    });
  }
});


module.exports = WordListStore;
