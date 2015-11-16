var React = require('react');
var ReactDOM = require('react-dom');

var Q = require('q');
Reflux.use(RefulxPromise(Q.Promise));


var Index =  require('component/index');

ReactDOM.render(<Index />, document.getElementById('wrap'));
