var Reflux = require('reflux');


var fbData = {
    isAuthenticated: false,
    userId: null
};

var FacebookStore = Reflux.createStore({
    listenables: [require('actions/FacebookActions')],
    getInitialState: function() {
        return fbData;
    }
});


module.exports = FacebookStore;