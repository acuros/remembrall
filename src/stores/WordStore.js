var Reflux = require('reflux');

var Word = require('stores/Word');
var FacebookStore = require('stores/FacebookStore');
var WordActions = require('actions/WordActions');
var AwsHelper = require('utils/AwsHelper');


var TABLE_NAME = 'Word';
var words = [];


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
    },
    onUploadWord: function(word) {
        AwsHelper.dynamodb.putItem({
            TableName: TABLE_NAME,
            Item: word.toItemOfUser(FacebookStore.getState().userId)
        },
        function(err, data) {
            if(err) {
                WordActions.uploadWord.failed('Dynamodb', err);
                return;
            }
            WordActions.uploadWord.completed();
            words.push(word);
            WordStore.trigger(words);
        });
    }
});

module.exports = WordStore;