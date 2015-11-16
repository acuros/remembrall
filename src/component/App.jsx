var React = require('react');
var ClassNames = require('classnames');

require('style/common');
require('style/index');
var FacebookLogin = require('component/FacebookLogin');

var App = React.createClass({
    fbStatus: null,
    loginOption: {scope: 'public_profile, email'},
    componentDidMount: function() {
        this.loadFacebookSDK();
    },
    componentWillUnmount: function() {
    },
    render: function() {
        var fbLoginClassName = ClassNames({
            'hidden': !this.fbStatus || this.fbStatus == 'connected'
        });
        return (
            <section id="index-section">
                <div id="facebook-login-wrap" className={fbLoginClassName}>
                    <FacebookLogin onStatusChange={this.onFBStatusChange}/>
                </div>
            </section>
        );
    },
    onFBStatusChange: function(response) {
        if (response.status === 'connected') {
            /*WordStore.init(response.authResponse, function() {
                WordStore.fetchWords($.proxy(ViewManager.start, ViewManager));
            });*/
        } else if (response.status === 'not_authorized') {
        } else {
        }
    },
    loadFacebookSDK: function() {
    }
});


module.exports = App;
