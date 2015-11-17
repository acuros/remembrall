var Q = require('q');

function makeAwsCredential(credentialData) {
    return new AWS.Credentials(
        credentialData.AccessKeyId,
        credentialData.SecretAccessKey,
        credentialData.SessionToken
    );
}


var AwsWrap = {
    dynamodb: null,
    prepareDynamodb: function(userId, accessToken) {
        return Q.Promise(function(resolve, reject) {
            new AWS.STS().assumeRoleWithWebIdentity(
                {
                    RoleArn: 'arn:aws:iam::617665285615:role/WebFedrationTest',
                    RoleSessionName: userId,
                    WebIdentityToken: accessToken,
                    ProviderId: 'graph.facebook.com'
                },
                function(err, data) {
                    if(err) {
                        reject(err);
                    }
                    else {
                        var credential = makeAwsCredential(data.Credentials);
                        AwsWrap.dynamodb = new AWS.DynamoDB({
                            credentials: credential,
                            region: 'ap-northeast-1'
                        });
                        resolve();
                    }
                }
            );
        });
    }
};

module.exports = AwsWrap;