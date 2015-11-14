var StsRoleAssumer = {
    assume: function(fbCredential, callback) {
        new AWS.STS().assumeRoleWithWebIdentity(
            StsRoleAssumer.params(fbCredential),
            function (err, data) {
                if (err) {
                    $('#status').html('Error on assume role from STS');
                    return;
                }
                callback(data.Credentials);
            }
        );
    },
    params:  function(fbCredential) {
        return {
            RoleArn: 'arn:aws:iam::617665285615:role/WebFedrationTest',
            RoleSessionName: fbCredential.userID,
            WebIdentityToken: fbCredential.accessToken,
            ProviderId: 'graph.facebook.com'
        }
    }
};

var Word = function(wordItem) {
    this.name = wordItem['word']['S'];
    this.meaning = wordItem['meaning']['S'];
};

var WordStore = {
    words: [],
    dynamodb: null,
    userId: null,

    init: function(fbCredential, callback) {
        this.userId = fbCredential.userID;
        StsRoleAssumer.assume(fbCredential, $.proxy(function(credentialData) {
            this.onRoleAssumed(credentialData);
            callback();
        }, this));
    },

    onRoleAssumed: function(credentialData) {
        var awsCredential = new AWS.Credentials(
            credentialData.AccessKeyId,
            credentialData.SecretAccessKey,
            credentialData.SessionToken
        );
        this.dynamodb = new AWS.DynamoDB({
            credentials: awsCredential,
            region: 'ap-northeast-1'
        });
    },

    fetchWords: function(callback) {
        var that = this;
        this.dynamodb.query(
            {
                TableName: "Word",
                KeyConditions: {
                    user: {
                        ComparisonOperator: 'EQ',
                        AttributeValueList: [{S: this.userId}]
                    }
                }
            },
            function(err, data) {
                if(err) {
                    $('#status').html('Error on fetching words from Dynamodb');
                    return;
                }
                that.words = data.Items.map(function(obj) {return new Word(obj);});
                callback();
            }
        );
    },

    at: function(index) {
        return this.words[index];
    },

    count: function() {
        return this.words.length;
    }
};

var TestView = {
    wordIndex: -1,

    init: function() {
        $('#show-meaning').click($.proxy(function() {
            this.checkAnswer();
        }, this));
        $('.check-button').click($.proxy(function() {
            this.showNextWord();
        }, this));
    },

    startShowingWords: function() {
        if(WordStore.count() == 0) {
            $('#status').html('You have no words');
            return;
        }
        $('#word-wrap').show();
        $('#status').hide();
        this.showNextWord();
    },

    showNextWord: function() {
        $('#word').html(WordStore.at(++this.wordIndex).name);
        $('#show-meaning').show();
        $('.check-button').hide();
    },

    checkAnswer: function() {
        $('#meaning').html(WordStore.at(this.wordIndex).meaning);
        $('#show-meaning').hide();
        $('.check-button').show();
    }
};
