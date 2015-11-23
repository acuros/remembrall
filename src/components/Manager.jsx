var React = require('react');


var Manager = React.createClass({
  render: function() {
    return (
      <div>
        <WordListManager />
        <WordManager />
      </div>
    );
  }
});
