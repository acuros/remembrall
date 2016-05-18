var React = require('react');


var Word = require('stores/Word');
var WordActions = require('actions/WordActions');

var WordListDetail = React.createClass({
    propTypes: {
        wordList: React.PropTypes.string.isRequired
    },
    render: function() {
        return (
            <div id="word-list-detail-wrap">
                <h2>{this.props.wordList}</h2>
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
    }
});


module.exports = WordListDetail;