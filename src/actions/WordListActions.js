var Reflux = require('reflux');

var WordListActions = Reflux.createActions({
  fetchWordLists: {asyncResult: true},
  addWordList: {asyncResult: true}
});


module.exports = WordListActions;
