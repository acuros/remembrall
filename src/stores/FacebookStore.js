var Reflux = require('reflux');

var FacebookActions = require('actions/FacebookActions');


var fbData = {
    isAuthenticated: false,
    status: '',
    userId: null
};

var FacebookStore = Reflux.createStore({
    listenables: [FacebookActions],
    getInitialState: function() {
        return fbData;
    },

    onLogin: function() {
        FB.login(function(response) {
            fbData.status = response.status;
            fbData.userId = response.authResponse.userID;
            fbData.isAuthenticated = fbData.status == 'connected';
            FacebookActions.login.completed();
            this.trigger(fbData);
        }.bind(this));
    }
});


module.exports = FacebookStore;