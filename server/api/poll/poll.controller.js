/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var mongoose = require('mongoose');
var _ = require('lodash');
var Poll = require('./poll.model.js');

// Get list of all polls
exports.index = function(req, res) {
  Poll.find(function (err, polls) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(polls);
  });
};

// Get list of all polls
exports.indexTop = function(req, res) {
  var limit =  req.params.limit || 5;
  Poll.find({}).sort({totalVotes: -1}).limit(limit).exec(function (err, polls) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(polls);
  });
};

// Get last introduced polls
exports.indexLast = function(req, res) {
  var limit =  req.params.limit || 5;
  var page =  req.params.page || 0;
  var skip = page * limit;
  var exclude = req.query.exclude ? req.query.exclude.split(',').map(function(e) {return mongoose.Types.ObjectId(e); }) : [];

  Poll.find({_id: {$nin: exclude}}).sort({date: -1}).limit(limit).skip(skip).exec(function (err, polls) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(polls);
  });
};


// Get list of polls from a user
exports.indexUser = function(req, res) {
  Poll.find({userId: req.user.id}, function (err, polls) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(polls);
  });
};

// Get a single poll by id
exports.show = function(req, res) {
  console.log('show ' + req.params.id);
  Poll.findById(req.params.id, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }

    console.log(JSON.stringify(poll));
    return res.json(poll);
  });
};

// Creates a new poll in the DB.
exports.create = function(req, res) {
  Poll.create(_.merge(req.body,{userId: req.user.id}), function(err, poll) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(poll);
  });
};

// Updates an existing poll in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Poll.findById(req.params.id, function (err, poll) {
    if (err) { console.log('err select ' + err); return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }

    var updated = _.merge(poll, req.body);
    //Don't merge options array, just update it with the list of options that comes in the request body
    updated.options = req.body.options;

    updated.save(function (err, updatedPoll) {
      if (err) { console.log('err update ' + err); return handleError(res, err); }
      return res.status(200).json(updatedPoll); //Return updated poll to avoid problems with the version
    });
  });
};

// Let a user vote an option of the poll
exports.vote = function(req, res) {

  Poll.findById(req.params.id, function (err, poll) {
    if (err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }

    poll.vote(req.body.text, function (err, poll) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(poll);
    });

  });

};

// Deletes a poll from the DB.
exports.destroy = function(req, res) {
  Poll.findById(req.params.id, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }

    //Check the poll belongs to the current user or the user has the 'admin' role
    if (req.user.role !== 'admin' && !req.user._id.equals(poll.userId)) return res.status(403).send('Unauthorized');

    poll.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
