var Reflux = require('reflux');

var WordListActions = Reflux.createActions({
  fetchWordLists: {asyncResult: true}
});


module.exports = WordListActions;
