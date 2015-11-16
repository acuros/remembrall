var React = require('react');
var Reflux = require('reflux');

var FacebookActions = require('actions/FacebookActions');
var FacebookStore = require('stores/FacebookStore');

require('styles/common');
require('styles/index');

var App = React.createClass({
    mixins: [Reflux.connect(FacebookStore, 'facebook')],

    componentDidMount: function() {
        this.loadFacebookSDK();
    },
    componentWillUnmount: function() {
    },
    render: function() {
        return (
            <div id="wrap">
                <header>
                    {
                        !this.state.facebook.isAuthenticated &&
                        <button id="facebook-login" onClick={FacebookActions.login}>Log In with Facebook</button>
                    }
                </header>
            </div>
        );
    },
    loadFacebookSDK: function() {
        window.fbAsyncInit = function() {
        }.bind(this);
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
