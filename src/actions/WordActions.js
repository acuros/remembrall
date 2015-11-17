var Reflux = require('reflux');

var RemembrallActions = Reflux.createActions({
    fetchWords: {asyncResult: true}
});


module.exports = RemembrallActions;