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

Word.fromItem = function(item) {
    return new Word(item['word']['S'], item['meaning']['S']);
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

    all: function() {
        return this.words.slice()
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
                that.words = data.Items.map(function(item) {return Word.fromItem(item)});
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
    }
};

var ViewManager = {
    init: function() {
        $('#test-menu').click(function(e) {
            e.preventDefault();
            $('.menu-section').hide();
            $('#test-section').show();
            TestView.nextCycleWords = WordStore.all();
            TestView.startNextCycle();
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
        $('#status').hide();
        TestView.nextCycleWords = WordStore.all();
        TestView.startNextCycle();
    }
};

var TestView = {
    wordIndex: -1,
    words: [],
    nextCycleWords: [],

    init: function() {
        $('#show-meaning').click($.proxy(this.checkAnswer, this));
        $('#correct').click($.proxy(this.goToNext, this));
        $('#wrong').click($.proxy(function() {
            this.nextCycleWords.push(this.words[this.wordIndex]);
            this.goToNext();
        }, this));
        $('#start-next-cycle').click($.proxy(this.startNextCycle, this));
    },

    startNextCycle: function() {
        this.words = shuffle(this.nextCycleWords);
        this.nextCycleWords = [];
        this.wordIndex = -1;
        if(this.words.length == 0) {
            $('#status').html('There is no words to test');
            return;
        }
        $('#score-section').hide();
        $('#test-section').show();
        $('#number-of-words').html(this.words.length);
        this.goToNext();
    },

    goToNext: function() {
        if(this.wordIndex + 1 < this.words.length) {
            this.showNextWord();
        }
        else {
            this.showScore();
        }
    },

    showNextWord: function() {
        $('#word').html(this.words[++this.wordIndex].name);
        $('#show-meaning').show();
        $('#meaning').hide();
        $('.check-button').hide();
        $('#current-index').html(this.wordIndex + 1);
    },

    checkAnswer: function() {
        $('#meaning').html(this.words[this.wordIndex].meaning).show();
        $('#show-meaning').hide();
        $('.check-button').show();
    },

    showScore: function() {
        var correctCount = this.words.length - this.nextCycleWords.length;
        $('#score').html(correctCount + '/' + this.words.length);
        $('#score-section').show();
        $('#test-section').hide();
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