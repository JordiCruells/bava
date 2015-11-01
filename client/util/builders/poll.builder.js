var PollBuilder = function() {
  var _poll = {
    _id: 'id',
    title: 'poll',
    totalVotes: 0,
    userId: 'user',
    options: [],
    date: new Date(2015,10,5)
  };
  var _builder =  {
    build: function () {
      return {
        _id: _poll._id,
        title: _poll.title,
        totalVotes: _poll.totalVotes,
        userId: _poll.userId,
        options: _poll.options,
        date: _poll.date
      };
    },
    setId: function (id) {
      _poll._id= id;
      return _builder;
    },
    setTitle: function (title) {
      _poll.title = title;
      return _builder;
    },
    setTotalVotes: function (totalVotes) {
      _poll.totalVotes = totalVotes;
      return _builder;
    },
    setUserId: function (userId) {
      _poll.userId = userId;
      return _builder;
    },
    setDate: function (date) {
      _poll.date = date;
      return _builder;
    },
    addOption: function(option) {
      _poll.options.push(option);
      return _builder;
    }
  };
  return _builder;
};
