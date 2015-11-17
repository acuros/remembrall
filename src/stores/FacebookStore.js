var Reflux = require('reflux');
var _ = require('underscore');

var FacebookActions = require('actions/FacebookActions');


var data = {
    isAuthenticated: undefined,
    status: '',
    userId: null,
    accessToken: null
};

function updateFromResponse(response) {
    data.status = response.status;
    data.isAuthenticated = data.status == 'connected';
    if(data.isAuthenticated) {
        data.userId = response.authResponse.userID;
        data.accessToken = response.authResponse.accessToken;
    }
    FacebookStore.trigger(data);
}

var FacebookStore = Reflux.createStore({
    listenables: [FacebookActions],
    getInitialState: function() {
        return _.clone(data);
    },
    getState: function() {
        return _.clone(data);
    },

    onCheckLoginStatus: function() {
        FB.getLoginStatus(function(response) {
            updateFromResponse(response);
            FacebookActions.checkLoginStatus.completed(data);
        }.bind(this));
    },
    onLogin: function() {
        FB.login(function(response) {
            updateFromResponse(response);
            FacebookActions.login.completed(data);
        }.bind(this));
    }
});


module.exports = FacebookStore;