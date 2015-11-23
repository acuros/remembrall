var React = require('react');
var Reflux = require('reflux');

var WordCard = require('components/WordCard');
var WordListStore = require('stores/WordListStore');


var WordTester = React.createClass({
  mixins: [Reflux.connect(WordListStore, 'wordLists')],

  nextCycleWords: [],

  getInitialState: function () {
    return {
      words: [],
      wordIndex: 0,
      corrects: 0
    }
  },

  render: function () {
    return this.createWordList();
  },

  createWordList: function () {
    var lis = this.state.wordLists.map(function (wordList, index) {
      var liKey = "wordlist-" + index + "-li";
      var checkboxId = "wordlist-" + index + "-checkbox";
      return (
        <li key={liKey}>
          <input type="checkbox" name="wordlist" id={checkboxId}/>
          <label htmlFor={checkboxId}>{wordList}</label>
        </li>
      );
    });
    return (
      <form method="get">
        <ul>{lis}</ul>
        <button>Start test</button>
      </form>
    );
  },
  createTestBoard: function () {
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
  createScoreBoard: function () {
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
  markCurrentWord: function (isCorrect) {
    if (!isCorrect) {
      this.nextCycleWords.push(this.state.words[this.state.wordIndex]);
    }
    this.setState({
      wordIndex: this.state.wordIndex + 1,
      corrects: this.state.corrects + (isCorrect ? 1 : 0)
    });
  },
  startNewCycle: function (words) {
    this.nextCycleWords = [];
    this.setState({
      words: shuffle(words),
      wordIndex: 0,
      corrects: 0
    });
  },
  restart: function () {
    this.startNewCycle(this.props.words);
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