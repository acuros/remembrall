var React = require('react');
var Reflux = require('reflux');
var _ = require('underscore');

var Word = require('stores/Word');
var WordListStore = require('stores/WordListStore');
var WordActions = require('actions/WordActions');
var WordListActions = require('actions/WordListActions');


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
        <div id="word-add-wrap">
          {this.createWordAdder(this.state.wordList)}
        </div>
      </section>
    );
  },

  createWordAdder: function(wordList) {
    if(wordList == null) {
      return <div></div>;
    }
    return (
      <div>
        <h2>{wordList}</h2>
        <form onSubmit={this.saveWord}>
          <fieldset>
            <dl>
              <dt><label htmlFor="new-word">Word</label></dt>
              <dd><input type="text" id="new-word" ref="name"/></dd>
              <dt><label htmlFor="new-word-meaning">Meaning</label></dt>
              <dd><input type="text" id="new-word-meaning" ref="meaning"/></dd>
            </dl>
            <input id="submit-button" type="submit" value="Save"/>
          </fieldset>
        </form>
      </div>
    );
  },

  saveWord: function (e) {
    e.preventDefault();
    var nameField = this.refs.name;
    var meaningField = this.refs.meaning;
    var word = new Word(nameField.value, meaningField.value);

    WordActions.uploadWord.triggerAsync(this.state.wordList, word)
      .then(function () {
        nameField.value = '';
        meaningField.value = '';
        nameField.focus();
      }, function (errType, msg) {
        console.log(errType, msg);
        alert('Sorry. Error on saving');
      }).done();
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