function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


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

var Word = function(name, meaning) {
    this.name = name;
    this.meaning = meaning
};

Word.prototype.toItem = function() {
    return {
        user: {
            S: WordStore.userId
        },
        word: {
            S: this.name
        },
        meaning: {
            S: this.meaning
        }
    }
};

var WordStore = {
    words: [],
    dynamodb: null,
    userId: null,

    init: function(fbCredential, callback) {
        this.userId = fbCredential.userID;
        StsRoleAssumer.assume(fbCredential, $.proxy(function(credentialData) {
            this.prepareDyanmoDB(credentialData);
            callback();
        }, this));
    },

    prepareDyanmoDB: function(credentialData) {
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
                TableName: 'Word',
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
                that.words = shuffle(data.Items.map(function(obj) {
                    return new Word(obj['word']['S'], obj['meaning']['S']);
                }));
                callback();
            }
        );
    },

    uploadWord: function(word) {
        this.dynamodb.putItem(
            {
                TableName: 'Word',
                Item: word.toItem()
            },
            function(err, data) {
                if(err) {
                    $('#status').html('Error on saving new word');
                }
            }
        )
    },

    at: function(index) {
        return this.words[index];
    },

    count: function() {
        return this.words.length;
    }
};

var ViewManager = {
    init: function() {
        $('#test-menu').click(function(e) {
            e.preventDefault();
            $('.menu-section').hide();
            $('#test-section').show();
        });
        $('#upload-menu').click(function(e) {
            e.preventDefault();
            $('.menu-section').hide();
            $('#upload-section').show();
        });

        TestView.init();
        UploadView.init();
    },

    start: function() {
        $('#wrap > header').show();
        TestView.startShowingWords();
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
        $('#test-section').show();
        $('#status').hide();
        $('#number-of-words').html(WordStore.count());
        this.showNextWord();
    },

    showNextWord: function() {
        $('#word').html(WordStore.at(++this.wordIndex).name);
        $('#show-meaning').show();
        $('#meaning').hide();
        $('.check-button').hide();
        $('#current-index').html(this.wordIndex + 1);
    },

    checkAnswer: function() {
        $('#meaning').html(WordStore.at(this.wordIndex).meaning).show();
        $('#show-meaning').hide();
        $('.check-button').show();
    }
};

var UploadView = {
    init: function() {
        $('#upload-form').submit($.proxy(this.uploadNewWord, this));
    },

    uploadNewWord: function(e) {
        e.preventDefault();
        var word = new Word($('#new-word').val(), $('#new-word-meaning').val());
        WordStore.uploadWord(word);

        $('#new-word-meaning').val('');
        $('#new-word').val('').focus();
    }
};