var Reflux = require('reflux');

var WordListActions = require('actions/WordListActions');
var AwsHelper = require('utils/AwsHelper');


var TABLE_NAME = 'WordList';
var wordLists = ['Default'];


var WordList = Reflux.createStore({
  listenables: [WordListActions],
  getInitialState: function() {
    return []
  },
  getList: function() {
    return wordList.slice();
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

      WordListActions.fetchWordLists.completed();
      wordLists = data.Items.map(function(item) {
        return item['name']['S'];
      })
    });
  }
});


module.exports = WordList;
