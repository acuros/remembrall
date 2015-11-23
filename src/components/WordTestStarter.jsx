var React = require('react');
var Reflux = require('reflux');
var $ = require('jquery');

var WordListActions = require('actions/WordListActions');
var SpinnerActions = require('actions/SpinnerActions');

var WordListStore = require('stores/WordListStore');


var WordTestStarter = React.createClass({
  mixins: [Reflux.connect(WordListStore, 'wordLists')],
  componentDidMount: function() {
    SpinnerActions.show("Getting word lists ...");
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
          <input type="checkbox" name="wordlist" id={checkboxId} value={wordList}/>
          <label htmlFor={checkboxId}>{wordList}</label>
        </li>
      );
    });
    return (
      <form method="get" onSubmit={this.startTest}>
        <ul>{lis}</ul>
        <button>Start test</button>
      </form>
    );
  },

  startTest: function(e) {
    e.preventDefault();
    var $form = $(e.currentTarget);
    var wordLists = $form.find('input[type="checkbox"]:checked').map(function(idx, obj){
      return $(obj).val();
    }).get();
    this.props.history.replaceState(null, '/test/?wordLists='+wordLists.join(','));
  }
});


module.exports = WordTestStarter;