var Reflux = require('reflux');


var FacebookActions = Reflux.createActions({
    "login": {asyncResult: true},
    "checkLoginStatus": {asyncResult: true}
});


module.exports = FacebookActions;