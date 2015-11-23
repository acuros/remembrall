var React = require('react');

var Word = require('stores/Word');
var WordActions = require('actions/WordActions');


var WordManager = React.createClass({
  render: function () {
    return (
      <section id="word-adding-section">
        <form onSubmit={this.saveWord}>
          <fieldset>
            <legend>Add a new word</legend>
            <dl>
              <dt><label htmlFor="new-word">Word</label></dt>
              <dd><input type="text" id="new-word" ref="name"/></dd>
              <dt><label htmlFor="new-word-meaning">Meaning</label></dt>
              <dd><input type="text" id="new-word-meaning" ref="meaning"/></dd>
            </dl>
            <input type="submit" value="Save"/>
          </fieldset>
        </form>
      </section>
    );
  },

  saveWord: function (e) {
    e.preventDefault();
    var nameField = this.refs.name;
    var meaningField = this.refs.meaning;
    var word = new Word(nameField.value, meaningField.value);

    WordActions.uploadWord(word)
      .then(function () {
        nameField.value = '';
        meaningField.value = '';
        nameField.focus();
      }, function (errType, msg) {
        console.log(errType, msg);
        alert('Sorry. Error on saving');
      }).done();
  }
});


module.exports = WordManager;