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
    wordList = wordList == 'Default' ? '' : wordList;

    var keyCondition = makeUserKeyCondition();
    keyCondition['wordList'] = {
      ComparisonOperator: 'Eq',
      AttributeValueList: [{S: wordList}]
    };
    dynamodb.query({
      TableName: WORD_TABLE_NAME,
      KeyConditions: makeUserKeyCondition()
    }, callback);
  },
  putWord: function(word, callback) {
    callback = callback || function(){};
    dynamodb.putItem({
      TableName: WORD_TABLE_NAME,
      Item: word.toItemOfUser(FacebookStore.getState().userId)
    }, callback);
  },

  fetchWordLists: function(callback) {
    callback = callback || function(){};
    dynamodb.query({
      TableName: WORD_LIST_TABLE_NAME,
      KeyConditions: makeUserKeyCondition()
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