var React = require('React');


var WordCard = React.createClass({
    propTypes: {
        word: React.PropTypes.object.isRequired,
        onFinish: React.PropTypes.func.isRequired
    },

    render: function() {
        return (<div className="word-card">
            <span className="name">{this.props.word.name}</span>
            <span className="meaning">{this.props.word.meaning}</span>
            <button onClick={this.props.onFinish}>Next</button>
        </div>);
    }
});

module.exports = WordCard;