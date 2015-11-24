var React = require('react');
var Reflux = require('reflux');
var _ = require('underscore');
var Q = require('q');
var Link = require('react-router').Link;

var WordListActions = require('actions/WordListActions');
var FacebookActions = require('actions/FacebookActions');
var SpinnerActions = require('actions/SpinnerActions');

var FacebookStore = require('stores/FacebookStore');
var WordStore = require('stores/WordStore');
var SpinnerStore = require('stores/SpinnerStore');

var AwsHelper = require('utils/AwsHelper');

var Spinner = require('components/Spinner');
var WordTester = require('components/WordTester');
require('styles/style');

var App = React.createClass({
  mixins: [
    Reflux.connect(FacebookStore, 'facebook'),
    Reflux.connect(SpinnerStore, 'spinner')
  ],

  componentDidMount: function () {
    SpinnerActions.show("Checking login status ...");
    this.loadFacebookSDK(function () {
      this.initWordsAfter(FacebookActions.checkLoginStatus);
    }.bind(this));
  },
  render: function () {
    return (
      <div id="wrap" ref="wrap">
        <header>
          <h1>Remembrall - Memorize and manage words conveniently</h1>
          {
            this.state.facebook.isAuthenticated === false &&
            <button id="facebook-login" onClick={this.loginWithFacebook}>Log In with Facebook</button>
          }
          {
            this.state.facebook.isAuthenticated === true &&
            <nav>
              <Link to="/test/start/">Test</Link> / <Link to="/manage/">Manage</Link>
            </nav>
          }
        </header>
        {
          this.state.facebook.isAuthenticated === true &&
          this.state.isDbPrepared === true &&
          this.props.children &&
          <div id="children-wrap">{this.props.children}</div>
        }
        {
          this.state.spinner.isVisible &&
          <Spinner message={this.state.spinner.message}/>
        }
      </div>
    );
  },
  loginWithFacebook: function () {
    SpinnerActions.show("Logging in...");
    this.initWordsAfter(FacebookActions.login);
  },
  initWordsAfter: function (action) {
    var that = this;
    action.triggerAsync()
      .then(function (facebook) {
        return Q.Promise(
          function (resolve, reject) {
            if (facebook.isAuthenticated)
              resolve(facebook);
            else
              reject('Facebook', 'Not authenticated');
      })})
      .then(function (facebook) {
        SpinnerActions.show("Acquiring permission ...");
        return AwsHelper.prepareDynamodb(facebook.userId, facebook.accessToken)
      })
      .then(function() {
        that.setState({isDbPrepared: true});
      })
      .then(function() {
        SpinnerActions.show("Getting word lists ...");
        return WordListActions.fetchWordLists.triggerAsync();
      })
      .catch(function (errType, msg) {
        console.log(errType, msg);
      })
      .done(function () {
        SpinnerActions.hide();
        var path = that.props.location.pathname;
        if(path != '/')
          return;

        var storedWords = WordStore.getInitialState();
        var wordsNum = _.reduce(storedWords, function(sum, words) { return sum + words.length }, 0);
        if(wordsNum == 0) {
          that.props.history.replaceState(null, '/manage/');
        }
        else {
          that.props.history.replaceState(null, '/test/start/');
        }
      })
  },
  loadFacebookSDK: function (onFbAsyncInit) {
    window.fbAsyncInit = function () {
      onFbAsyncInit();
    };
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5&appId=" + FB_APP_ID;
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }
});


module.exports = App;
