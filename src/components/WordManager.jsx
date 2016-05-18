var React = require('react');
var Reflux = require('reflux');
var _ = require('underscore');

var Word = require('stores/Word');
var WordListStore = require('stores/WordListStore');
var WordListActions = require('actions/WordListActions');

var WordListDetail = require('components/WordListDetail');


var WordManager = React.createClass({
  mixins: [Reflux.listenTo(WordListStore, 'useFirstWordListByDefault')],
  getInitialState: function() {
    return {
      wordLists: [],
      wordList: null
    };
  },

  componentWillMount: function() {
    this.useFirstWordListByDefault(WordListStore.getInitialState());
  },

  render: function () {
    var lis = this.state.wordLists.map(function(wordList) {
      return (
        <li key={wordList}>
          <a onClick={this.chooseWordList} href="">{wordList}</a>
        </li>
      );
    }.bind(this));
    return (
      <section id="manage-section">
        <ul id="word-list-list">
          {lis}
          <li>
            <form onSubmit={this.addNewWordList}>
              <input type="text" id="new-word-list" /> <input type="submit" value="Add" />
            </form>
          </li>
        </ul>
        {
          this.state.wordList &&
          <WordListDetail wordList={this.state.wordList} />
        }
      </section>
    );
  },

  addNewWordList: function(e) {
    e.preventDefault();
    var wordList = document.getElementById('new-word-list').value;
    if(_.contains(this.state.wordLists, wordList)) {
      alert("Already exist word list");
      return;
    }
    WordListActions.addWordList.triggerAsync(wordList).then(function() {
      e.currentTarget.value = '';
    });
  },

  chooseWordList: function(e) {
    e.preventDefault();
    this.setState({
      wordList: e.currentTarget.innerHTML
    });
  },

  useFirstWordListByDefault: function (wordLists) {
    var wordList = this.state.wordList || wordLists[0];
    this.setState({
      wordLists: wordLists,
      wordList: wordList
    });
  }
});


module.exports = WordManager;