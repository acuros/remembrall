var Q = require('q');

var FacebookStore = require('stores/FacebookStore');


var dynamodb = null;
var WORD_TABLE_NAME = 'Word';
var WORD_LIST_TABLE_NAME = 'WordList';


var AwsHelper = {
  prepareDynamodb: function (userId, accessToken) {
    return Q.Promise(function (resolve, reject) {
      new AWS.STS().assumeRoleWithWebIdentity(
        {
          RoleArn: ROLE_ARN,
          RoleSessionName: userId,
          WebIdentityToken: accessToken,
          ProviderId: 'graph.facebook.com'
        },
        function (err, data) {
          if (err) {
            reject('STS', err);
          }
          else {
            var credential = makeAwsCredential(data.Credentials);
            dynamodb = new AWS.DynamoDB({
              credentials: credential,
              region: 'ap-northeast-1'
            });
            resolve();
          }
        }
      );
    });
  },

  fetchWords: function(wordList, callback) {
    callback = callback || function(){};
    wordList = FacebookStore.getState().userId + wordList;

    var keyCondition = {
      wordList: {
        ComparisonOperator: 'EQ',
          AttributeValueList: [{S: wordList}]
      }
    };
    dynamodb.query({
      TableName: WORD_TABLE_NAME,
      KeyConditions: keyCondition,
      IndexName: 'wordList-index'
    }, callback);
  },
  putWord: function(wordList, word, callback) {
    callback = callback || function(){};
    wordList = FacebookStore.getState().userId + wordList;

    dynamodb.putItem({
      TableName: WORD_TABLE_NAME,
      Item: word.toItemInWordListOfUser(wordList, FacebookStore.getState().userId)
    }, callback);
  },

  fetchWordLists: function(callback) {
    callback = callback || function(){};
    dynamodb.query({
      TableName: WORD_LIST_TABLE_NAME,
      KeyConditions: makeUserKeyCondition()
    }, function(err, data) {
      var wordLists = data.Items.map(function(item) {
        return item['name']['S']
      });
      callback(err, wordLists);
    });
  },
  putWordList: function(wordList, callback) {
    callback = callback || function(){};

    dynamodb.putItem({
      TableName: WORD_LIST_TABLE_NAME,
      Item: {user: {S: FacebookStore.getState().userId}, name: {S: wordList}}
    }, callback);
  }
};

function makeAwsCredential(credentialData) {
  return new AWS.Credentials(
    credentialData.AccessKeyId,
    credentialData.SecretAccessKey,
    credentialData.SessionToken
  );
}

function makeUserKeyCondition()  {
  return {
    user: {
      ComparisonOperator: 'EQ',
      AttributeValueList: [{S: FacebookStore.getState().userId}]
    }
  };
}

module.exports = AwsHelper;