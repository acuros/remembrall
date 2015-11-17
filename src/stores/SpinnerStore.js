var Reflux = require('reflux');

var SpinnerActions = require('actions/SpinnerActions');


var options = {
    isVisible: false,
    message: ""
};

module.exports = Reflux.createStore({
    listenables: [SpinnerActions],
    getInitialState: function() {
        return options;
    },

    onShow: function(message) {
        options = {
            isVisible: true,
            message: message
        };
        this.trigger(options);
    },
    onHide: function() {
        options.isVisible = false;
        this.trigger(options);
    }
});