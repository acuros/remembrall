var React = require('react');
var Loading = require('react-loading');

require('styles/spinner');
var Spinner = React.createClass({
    propTypes:  {
        message: React.PropTypes.string
    },
    render: function() {
        return (
            <div id="spinner-wrap">
                <Loading type="spokes" color="#a0a0a0" width="80" height="80"/>
                {
                    this.props.message &&
                    <span id="spinner-message">{ this.props.message }</span>
                }
            </div>
        );
    }
});


module.exports = Spinner;