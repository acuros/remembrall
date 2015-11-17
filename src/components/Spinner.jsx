var React = require('react');
var Spinkit = require('react-spinkit');

require('styles/spinner');
var Spinner = React.createClass({
    propTypes:  {
        message: React.PropTypes.string
    },
    render: function() {
        return (
            <div id="spinner-wrap">
                <Spinkit spinnerName="three-bounce" />
                {
                    this.props.message &&
                    <span id="spinner-message">{ this.props.message }</span>
                }
            </div>
        );
    }
});


module.exports = Spinner;