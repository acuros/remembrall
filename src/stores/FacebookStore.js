var Reflux = require('reflux');

var FacebookActions = require('actions/FacebookActions');


var fbData = {
    isAuthenticated: undefined,
    status: '',
    userId: null
};

var FacebookStore = Reflux.createStore({
    listenables: [FacebookActions],
    getInitialState: function() {
        return fbData;
    },
    updateFromResponse: function(response) {
        fbData.status = response.status;
        fbData.userId = response.authResponse.userID;
        fbData.isAuthenticated = fbData.status == 'connected';
        this.trigger(fbData);
    },

    onCheckLoginStatus: function() {
        FB.getLoginStatus(function(response) {
            FacebookActions.checkLoginStatus.completed();
            this.updateFromResponse(response);
        }.bind(this));
    },
    onLogin: function() {
        FB.login(function(response) {
            FacebookActions.login.completed();
            this.updateFromResponse(response);
        }.bind(this));
    }
});


module.exports = FacebookStore;