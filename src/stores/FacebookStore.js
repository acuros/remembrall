var Reflux = require('reflux');

var FacebookActions = require('actions/FacebookActions');
var AWS = require('utils/aws');


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
        AWS.prepareDynamodb(data.userId, data.accessToken).then(function() {
            console.log(AWS, AWS.dynamodb);
        }, function(err) {
            console.log(err);
        });
    }
}

var FacebookStore = Reflux.createStore({
    listenables: [FacebookActions],
    getInitialState: function() {
        return data;
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


module.exports = FacebookStore;