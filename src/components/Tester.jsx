var React = require('react');
var Reflux = require('reflux');

var WordStore = require('stores/WordStore');
var WordCard = require('components/WordCard');

var Tester = React.createClass({
    getInitialState: function() {
        return {
            words: [],
            wordIndex: 0
        }
    },
    mixins: [Reflux.listenTo(WordStore, "onWordListChange")],

    render: function() {
        return (
            <section id="test-section">
                {
                    this.state.words.length > 0 &&
                    <WordCard word={this.state.words[this.state.wordIndex]} onFinish={this.showNextWord}/>
                }
            </section>
        )
    },

    showNextWord: function() {
        this.setState({
            wordIndex: this.state.wordIndex + 1
        });
    },

    onWordListChange: function(words) {
        this.setState({
            words: words
        });
    }
});

module.exports = Tester;