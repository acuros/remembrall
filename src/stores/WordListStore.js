var Reflux = require('reflux');
var _ = require('underscore');

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
      WordListStore.trigger(wordList);
    });
  },

  onFetchWordLists: function() {
    AwsHelper.fetchWordLists(function(err, data) {
      if (err) {
        WordListActions.fetchWordLists.failed({
          type: 'Dynamodb',
          msg: err
        });
        return;
      }

      _.extend(wordLists, data.Items.map(function(item) {
        return item['name']['S'];
      }));
      wordLists.push('Default');
      WordListActions.fetchWordLists.completed();
      WordListStore.trigger(wordLists);
    });
  }
});


module.exports = WordListStore;
