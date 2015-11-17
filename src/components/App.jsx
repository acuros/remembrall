var React = require('react');
var Reflux = require('reflux');
var Q = require('q');

var WordActions = require('actions/WordActions');
var FacebookActions = require('actions/FacebookActions');
var SpinnerActions = require('actions/SpinnerActions');

var FacebookStore = require('stores/FacebookStore');
var SpinnerStore = require('stores/SpinnerStore');

var AwsHelper = require('utils/AwsHelper');

var Spinner = require('components/Spinner');
require('styles/style');

var App = React.createClass({
    mixins: [
        Reflux.connect(FacebookStore, 'facebook'),
        Reflux.connect(SpinnerStore, 'spinner')
    ],

    componentDidMount: function() {
        SpinnerActions.show("Checking login status ...");
        this.loadFacebookSDK(function() {
            this.initWordsAfter(FacebookActions.checkLoginStatus);
        }.bind(this));
    },
    render: function() {
        return (
            <div id="wrap" ref="wrap">
                <header>
                    {
                        this.state.facebook.isAuthenticated === false &&
                        <button id="facebook-login" onClick={this.loginWithFacebook}>Log In with Facebook</button>
                    }
                </header>
                {
                    this.state.spinner.isVisible &&
                    <Spinner message={this.state.spinner.message} />
                }
                {this.props.children}
            </div>
        );
    },
    loginWithFacebook: function() {
        SpinnerActions.show("Logging in...");
        this.initWordsAfter(FacebookActions.login);
    },
    initWordsAfter: function(action) {
        action.triggerAsync()
            .then(function(facebook) {
                return Q.Promise(function(resolve, reject) {
                    if(facebook.isAuthenticated)
                        resolve();
                    else
                        reject('Facebook', 'Not authenticated');
            })
            .then(function() {
                SpinnerActions.show("Acquiring permission ...");
                return AwsHelper.prepareDynamodb(facebook.userId, facebook.accessToken)
            })
            .then(function() {
                SpinnerActions.show("Getting words ...");
                return WordActions.fetchWords.triggerAsync()
            })
            .then(function() {
                window.location.hash = "/test";
            })
            .catch(function(errType, msg) {
                console.log(errType, msg);
            })
            .done(function() {
                SpinnerActions.hide();
            })
        })
    },
    loadFacebookSDK: function(onFbAsyncInit) {
        window.fbAsyncInit = function() {
            onFbAsyncInit();
        };
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5&appId=1647663812151516";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
});


module.exports = App;
