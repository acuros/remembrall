var Reflux = require('reflux');
var _ = require('underscore');

var FacebookActions = require('actions/FacebookActions');
var WordActions = require('actions/WordActions');
var AwsHelper = require('utils/AwsHelper');


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

function handleLogin(response) {
    updateFromResponse(response);
    if(data.isAuthenticated) {
        AwsHelper.prepareDynamodb(data.userId, data.accessToken).then(function() {
            WordActions.fetchWords();
        }, function(err) {
            alert("Sorry ...\nFailed to connect to server.");
            console.error(err);
        });
    }
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
            FacebookActions.checkLoginStatus.completed();
            handleLogin(response);
        }.bind(this));
    },
    onLogin: function() {
        FB.login(function(response) {
            FacebookActions.login.completed();
            handleLogin(response);
        }.bind(this));
    }
});

console.log(FacebookStore);


module.exports = FacebookStore;