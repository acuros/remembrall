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

  onFetchWordLists: function() {
    AwsHelper.fetchWordLists(function(err, data) {
      if (err) {
        WordListActions.fetchWordLists.failed({
          type: 'Dynbamodb',
          msg: err
        });
        return;
      }

      _.extend(wordLists, data.Items.map(function(item) {
        return item['name']['S'];
      }));
      if(wordLists.length == 0) {
        wordLists.push('Default');
      }
      WordListActions.fetchWordLists.completed();
      WordListStore.trigger(wordLists);
    });
  }
});


module.exports = WordListStore;
