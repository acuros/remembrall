var React = require('react');
var Reflux = require('reflux');

var WordStore = require('stores/WordStore');

var Tester = React.createClass({
    mixins: [
        Reflux.connect(WordStore, 'words')
    ],

    render: function() {
        {
            return (
                <div>
                    {this.state.words.map(function(word) {
                        return word.name + " "
                    })}
                </div>
            )
        }
    }
});

module.exports = Tester;