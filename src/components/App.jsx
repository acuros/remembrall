var React = require('react');
var Reflux = require('reflux');
var Q = require('q');
var Link = require('react-router').Link;

var WordActions = require('actions/WordActions');
var FacebookActions = require('actions/FacebookActions');
var SpinnerActions = require('actions/SpinnerActions');

var FacebookStore = require('stores/FacebookStore');
var SpinnerStore = require('stores/SpinnerStore');

var AwsHelper = require('utils/AwsHelper');

var Spinner = require('components/Spinner');
var WordTester = require('components/WordTester');
var WordStore = require('stores/WordStore');
require('styles/style');

var App = React.createClass({
    mixins: [
        Reflux.connect(WordStore, 'words'),
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
					<h1>Remembrall - vocabulary studying helper</h1>
                    {
                        this.state.facebook.isAuthenticated === false &&
                        <button id="facebook-login" onClick={this.loginWithFacebook}>Log In with Facebook</button>
                    }
                    {
                        this.state.facebook.isAuthenticated === true &&
                        <nav>
                            <Link to="/">Test</Link> / <Link to="/manage">Manage</Link>
                        </nav>
                    }
                </header>
                {
                    this.state.facebook.isAuthenticated === true &&
                    (
                        this.props.children &&
                        <div id="children-wrap">{this.props.children}</div> ||
                        <WordTester words={this.state.words} />
                    )
                }
                {
                    this.state.spinner.isVisible &&
                    <Spinner message={this.state.spinner.message} />
                }
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
            js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5&appId=" + FB_APP_ID;
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
});


module.exports = App;
