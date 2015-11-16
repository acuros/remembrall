var React = require('react');
var ReactDOM = require('react-dom');

var Reflux = require('reflux');
var RefluxPromise = require('reflux-promise');
var Q = require('q');
Reflux.use(RefluxPromise(Q.Promise));


var Index =  require('component/Index');

ReactDOM.render(<Index />, document.getElementById('wrap'));
