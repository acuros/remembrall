var React = require('React');


var WordCard = React.createClass({
    propTypes: {
        word: React.PropTypes.object.isRequired,
        onMark: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            isMeaningVisible: false
        }
    },
    componentWillReceiveProps: function() {
        this.setState({isMeaningVisible: false});
    },

    render: function() {
        return (<div className="word-card">
            <span className="name">{this.props.word.name}</span>
            {
                this.state.isMeaningVisible &&
                this.createGradingBlock() ||
                <button className="show-meaning" onClick={this.showMeaning}>Show Meaning</button>
            }
        </div>);
    },
    createGradingBlock: function() {
        return (
            <div className="grading-block">
                <span className="meaning">{this.props.word.meaning}</span>
                <button className="mark correct" onClick={function(){this.props.onMark(true)}.bind(this)}>O</button>
                <button className="mark wrong" onClick={function(){this.props.onMark(false)}.bind(this)}>X</button>
            </div>
        );
    },
    showMeaning: function() {
        this.setState({isMeaningVisible: true});
    }
});

module.exports = WordCard;