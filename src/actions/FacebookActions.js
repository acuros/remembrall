var Reflux = require('reflux');


var FacebookActions = Reflux.createActions({
    "login": {asyncResult: true}
});


module.exports = FacebookActions;