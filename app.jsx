var React = require('react');
var ReactDOM = require('react-dom');

var FBLogin = require('./fblogin');

var Index = React.createClass({
    render: function() {
        return (
            <FBLogin
                appId="1647663812151516"
                loginHandler={this.loginHandler}/>
        );
    },
    loginHandler: function(response) {
        console.log(response)
    }
});

ReactDOM.render(<Index />, document.getElementById('wrap'));
