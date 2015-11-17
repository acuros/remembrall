var Reflux = require('reflux');

var WordActions = Reflux.createActions({
    fetchWords: {asyncResult: true},
    uploadWord: {asyncResult: true}
});


module.exports = WordActions;