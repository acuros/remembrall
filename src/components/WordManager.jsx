var React = require('react');


var WordManager = React.createClass({
    render: function() {
        return (
            <section id="manage-section">
                <form onSubmit={this.saveWord}>
                    <fieldset>
                        <legend>Add a new word</legend>
                        <dl>
                            <dt><label for="new-word">Word</label></dt>
                            <dd><input type="text" id="new-word" ref="name" /></dd>
                            <dt><label for="new-word-meaning">Meaning</label></dt>
                            <dd><input type="text" id="new-word-meaning" ref="meaning" /></dd>
                        </dl>
                        <input type="submit" value="Save" />
                    </fieldset>
                </form>
            </section>
        );
    },

    saveWord: function() {
    }
});


module.exports = WordManager;