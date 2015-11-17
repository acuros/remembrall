var React = require('react');
var Reflux = require('reflux');

var FacebookActions = require('actions/FacebookActions');
var SpinnerActions = require('actions/SpinnerActions');

var FacebookStore = require('stores/FacebookStore');
var SpinnerStore = require('stores/SpinnerStore');

var Spinner = require('components/Spinner');
require('styles/common');
require('styles/index');

var App = React.createClass({
    mixins: [
        Reflux.connect(FacebookStore, 'facebook'),
        Reflux.connect(SpinnerStore, 'spinner')
    ],

    componentDidMount: function() {
        SpinnerActions.show("Loading ...");
        this.loadFacebookSDK(function() {
            FacebookActions.checkLoginStatus.triggerAsync().then(function() {
                SpinnerActions.hide();
            });
        });
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
            </div>
        );
    },
    loginWithFacebook: function() {
        SpinnerActions.show("Loading ...");
        FacebookActions.login.triggerAsync().then(function() {
            SpinnerActions.hide();
        });
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
