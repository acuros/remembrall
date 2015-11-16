var Reflux = require('reflux');

var FBAction = Reflux.createActions(
    {
        "checkLoginStatus": {
            asyncResult: true
        }
    }
);

module.exports = {FBAction: FBAction};