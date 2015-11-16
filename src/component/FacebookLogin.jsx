var React = require('react');

var FacebookLogin = React.createClass({
    propTypes: {
        onStatusChange: React.PropTypes.func.isRequired
    },

    componentDidMount: function() {
        window.fbAsyncInit = function() {
            this.checkLoginStatus();
        }.bind(this);
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5&appId=1647663812151516";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    },
    render: function() {
        return (
            <div className="fb-login-button" data-max-rows="1" data-size="large" data-show-faces="false"
                 data-auto-logout-link="false" data-onlogin={this.checkLoginStatus}></div>
        )
    },
    checkLoginStatus: function() {
        FB.getLoginStatus(this.props.onStatusChange);
    }
});


module.exports = FacebookLogin;
