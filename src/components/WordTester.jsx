var React = require('react');
var Reflux = require('reflux');

var WordStore = require('stores/WordStore');
var WordCard = require('components/WordCard');

var WordTester = React.createClass({
    getInitialState: function() {
        return {
            words: WordStore.getList(),
            wordIndex: 0,
            corrects: 0
        }
    },
    mixins: [Reflux.listenTo(WordStore, "onWordListChange")],

    render: function() {
        return (
            <section id="test-section">
                <header>
                    {this.state.wordIndex } / {this.state.words.length}
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
            <span className="score">Your score is {this.state.corrects} / {this.state.words.length}</span>
        );
    },
    markCurrentWord: function(isCorrect) {
        this.setState({
            wordIndex: this.state.wordIndex + 1,
            corrects: this.state.corrects + (isCorrect ? 1 : 0)
        });
    },
    onWordListChange: function(words) {
        this.setState({
            words: words,
            wordIndex: 0,
            corrects: 0
        });
    }
});

module.exports = WordTester;