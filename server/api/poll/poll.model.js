'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PollSchema = new Schema({
  userId: String,
  title: String,
  options: [{text:String, votes:Number}],
  totalVotes: Number
});

PollSchema.methods.vote = function vote (text, cb) {
  // In the request body comes the option voted, search for it and increment its number of votes
  var opts = this.options;
  for (var i=0; i < opts.length; i++) if (opts[i].text === text) {
    opts[i].votes ++;
    this.totalVotes ++;
    return this.save(cb);
  }
};

module.exports = mongoose.model('Poll', PollSchema);
