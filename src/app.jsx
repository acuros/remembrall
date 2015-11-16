var React = require('react');
var ReactDOM = require('react-dom');

var Reflux = require('reflux');
var RefluxPromise = require('reflux-promise');
var Q = require('q');
Reflux.use(RefluxPromise(Q.Promise));


var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Router;


var App =  require('component/App');

ReactDOM.render((
    <Router>
        <Route path="/" component={App}>
        </Route>
    </Router>
), document.getElementById('wrap'));
