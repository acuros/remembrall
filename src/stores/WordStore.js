var Reflux = require('reflux');

var FacebookStore = require('stores/FacebookStore');
var WordActions = require('actions/WordActions');
var AwsHelper = require('utils/AwsHelper');


var TABLE_NAME = 'Word';
var words = [];


var Word = function(name, meaning) {
    this.name = name;
    this.meaning = meaning;
};

Word.fromItem = function(item) {
    return new Word(item['word']['S'], item['meaning']['S']);
};

var WordStore = Reflux.createStore({
    listenables: [WordActions],
    getInitialState: function() {
        return []
    },
    getList: function() {
        return words.slice();
    },

    onFetchWords: function() {
        AwsHelper.dynamodb.query({
            TableName: TABLE_NAME,
            KeyConditions: {
                user: {
                    ComparisonOperator: 'EQ',
                    AttributeValueList: [{S: FacebookStore.getState().userId}]
                }
            }
        }, function(err, data) {
            if(err) {
                WordActions.fetchWords.failed('Dynamodb', err);
                return;
            }
            WordActions.fetchWords.completed();
            words = data.Items.map(function(item) {return Word.fromItem(item)});
            WordStore.trigger(words);
        });
    }
});

module.exports = WordStore;