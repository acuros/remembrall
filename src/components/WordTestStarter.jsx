var React = require('react');
var Reflux = require('reflux');

var WordListStore = require('stores/WordListStore');
var WordListActions = require('actions/WordListActions');
var SpinnerActions = require('actions/SpinnerActions');


var WordTestStarter = React.createClass({
  mixins: [Reflux.connect(WordListStore, 'wordLists')],
  componentDidMount: function() {
    SpinnerActions.show("Getting word lists");
    WordListActions.fetchWordLists.triggerAsync().then(function() {
      SpinnerActions.hide();
    });
  },

  render: function() {
    if(this.state.wordLists.length == 0) {
      return <div></div>
    }

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
  }
});


module.exports = WordTestStarter;