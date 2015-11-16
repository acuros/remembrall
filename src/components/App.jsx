var React = require('react');
var Reflux = require('reflux');

var FacebookActions = require('actions/FacebookActions');
var FacebookStore = require('stores/FacebookStore');

require('styles/common');
require('styles/index');

var App = React.createClass({
    mixins: [Reflux.connect(FacebookStore, 'facebook')],

    componentDidMount: function() {
        this.loadFacebookSDK(function() {
            FacebookActions.checkLoginStatus.triggerAsync();
        });
    },
    componentWillUnmount: function() {
    },
    render: function() {
        return (
            <div id="wrap">
                <header>
                    {
                        this.state.facebook.isAuthenticated === false &&
                        <button id="facebook-login" onClick={this.loginWithFacebook}>Log In with Facebook</button>
                    }
                </header>
            </div>
        );
    },
    loginWithFacebook: function() {
        FacebookActions.login.triggerAsync().then(function() {
            alert('Success');
        })
    },
    loadFacebookSDK: function(onFbAsyncInit) {
        window.fbAsyncInit = onFbAsyncInit();
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
