var Reflux = require('reflux');

var FacebookStore = require('stores/FacebookStore');
var WordActions = require('actions/WordActions');
var AwsHelper = require('utils/AwsHelper');


var TABLE_NAME = 'Word';

var WordStore = Reflux.createStore({
    listenables: [WordActions],

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
            }
            else {
                WordActions.fetchWords.completed(data);
            }
        });
    }
});

module.exports = WordStore;