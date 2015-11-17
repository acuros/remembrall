var Word = function(name, meaning) {
    this.name = name;
    this.meaning = meaning;
};

Word.fromItem = function(item) {
    return new Word(item['word']['S'], item['meaning']['S']);
};


module.exports = Word;
