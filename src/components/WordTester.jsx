var React = require('react');
var Reflux = require('reflux');
var _ = require('underscore');

var SpinnerActions = require('actions/SpinnerActions');
var WordActions = require('actions/WordActions');

var WordStore = require('stores/WordStore');
var WordCard = require('components/WordCard');


var WordTester = React.createClass({
  mixins: [Reflux.connect(WordStore, 'words')],
  thisCycleWords: [],
  nextCycleWords: [],

  getInitialState: function () {
    return {
      wordIndex: 0,
      corrects: 0
    }
  },

  componentDidMount: function() {
    var that = this;
    var wordLists = this.props.location.query.wordLists.split(',');
    SpinnerActions.show('Preparing test ...');

    WordActions.fetchWords.triggerAsync(wordLists).then(function(words) {
      SpinnerActions.hide();
      var newCycleWords = [];
      for(var key in words) {
        if(!_.contains(wordLists, key)) continue;
        _.extend(newCycleWords, words[key]);
      }
      that.startNewCycle(newCycleWords);
    });
  },
  render: function () {
    if(this.thisCycleWords.length == 0) {
      return <div></div>
    }
    return (
      <section id="test-section">
        <header>
          {Math.min(this.state.wordIndex + 1, this.thisCycleWords.length)} / {this.thisCycleWords.length}
        </header>
        {
          this.thisCycleWords.length > 0 &&
          (
            this.state.wordIndex < this.thisCycleWords.length &&
            <WordCard word={this.thisCycleWords[this.state.wordIndex]} onMark={this.markCurrentWord}/> ||
            this.createScoreBoard()
          )
        }
      </section>
    )
  },
  createScoreBoard: function () {
    return (
      <div id="score-board">
        <span className="score">Your score is {this.state.corrects} / {this.thisCycleWords.length}</span>

        <div id="actions">
          <button className="finish-action" onClick={this.continueWithTheWrongs}>Continue</button>
          <button className="finish-action" onClick={this.restart}>Restart</button>
        </div>
      </div>
    );
  },
  markCurrentWord: function (isCorrect) {
    if (!isCorrect) {
      this.nextCycleWords.push(this.thisCycleWords[this.state.wordIndex]);
    }
    this.setState({
      wordIndex: this.state.wordIndex + 1,
      corrects: this.state.corrects + (isCorrect ? 1 : 0)
    });
  },
  startNewCycle: function (words) {
    this.nextCycleWords = [];
    this.thisCycleWords = shuffle(words);
    this.setState({
      wordIndex: 0,
      corrects: 0
    });
  },
  restart: function () {
    this.startNewCycle(this.state.words);
  },
  continueWithTheWrongs: function () {
    this.startNewCycle(this.nextCycleWords);
  }
});

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

module.exports = WordTester;