var React = require('react');
var Reflux = require('reflux');

var WordCard = require('components/WordCard');

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

var WordTester = React.createClass({
    nextCycleWords: [],

    propTypes: {words: React.PropTypes.array.isRequired},

    getInitialState: function() {
        return {
            words: this.props.words,
            wordIndex: 0,
            corrects: 0
        }
    },
    componentWillReceiveProps: function(nextProps) {
        this.startNewCycle(nextProps.words);
    },

    render: function() {
        return (
            <section id="test-section">
                <header>
                    {Math.min(this.state.wordIndex + 1, this.state.words.length)} / {this.state.words.length}
                </header>
                {
                    this.state.words.length > 0 &&
                    (
                        this.state.wordIndex < this.state.words.length &&
                        <WordCard word={this.state.words[this.state.wordIndex]} onMark={this.markCurrentWord}/> ||
                        this.createScoreBoard()
                    )
                }
            </section>
        )
    },

    createScoreBoard: function() {
        return (
            <div id="score-board">
                <span className="score">Your score is {this.state.corrects} / {this.state.words.length}</span>
                <div id="actions">
                    <button className="finish-action" onClick={this.continueWithTheWrongs}>Continue</button>
                    <button className="finish-action" onClick={this.restart}>Restart</button>
                </div>
            </div>
        );
    },
    markCurrentWord: function(isCorrect) {
        if(!isCorrect) {
            this.nextCycleWords.push(this.state.words[this.state.wordIndex]);
        }
        this.setState({
            wordIndex: this.state.wordIndex + 1,
            corrects: this.state.corrects + (isCorrect ? 1 : 0)
        });
    },
    startNewCycle: function(words) {
        this.nextCycleWords = [];
        this.setState({
            words: shuffle(words),
            wordIndex: 0,
            corrects: 0
        });
    },
    restart: function() {
        this.startNewCycle(this.props.words);
    },
    continueWithTheWrongs: function() {
        this.startNewCycle(this.nextCycleWords);
    }
});

module.exports = WordTester;