'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PollSchema = new Schema({
  userId: String,
  title: String,
  options: Array
});

module.exports = mongoose.model('Poll', PollSchema);
