'use strict';

var should = require('should');
var app = require('../../app');
var Poll = require('./poll.model');
var User = require('../user/user.model');
var request = require('supertest');
var _ = require('lodash');
var auth = require('../../auth/auth.service');

var user = new User({
  provider: 'local',
  name: 'Fake User',
  email: 'test@test.com',
  password: 'password'
});

var PollBuilder = function() {
  var _poll = {
    title: 'poll',
    totalVotes: 0,
    userId: 'user',
    options: [],
    date: new Date(2015,10,5)
  };
  var _builder =  {
    build: function () {
      return new Poll({
        title: _poll.title,
        totalVotes: _poll.totalVotes,
        userId: _poll.userId,
        options: _poll.options,
        date: _poll.date
      });
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

//Pre-populated polls
var poll_0 = PollBuilder()
           .setTitle('poll 0')
           .setTotalVotes(5)
           .setDate(new Date(2015,10,5).toISOString())
           .addOption({text:'option 1', votes:3})
           .addOption({text:'option 2', votes:2})
           .build();
var poll_1 = PollBuilder()
            .setTitle('poll 1')
            .setDate(new Date(2015,10,8).toISOString())
            .build();
var poll_2 = PollBuilder()
            .setTitle('poll 2')
            .setDate(new Date(2015,10,6).toISOString())
            .build();
var poll_3 = PollBuilder()
            .setTitle('poll 3')
            .setDate(new Date(2015,10,1).toISOString())
            .build();

var polls = [poll_0, poll_1, poll_2, poll_3];

// Memoized values
var poll_0_id; // Memorize poll_0 id in db
var userId;    // Memorize user id in db
var token;     // Memorize token when user logged in

// New poll
var newPoll = PollBuilder()
  .setTitle('new poll')
  .addOption({text:'option A'})
  .addOption({text:'option B'})
  .build();

// Register a token to to smiulate logged in user
function getTokenFor(userId) {
  if (!userId) throw new Error('Required user id to login');
  if (!token) token = auth.signToken(userId, 'user');
  return token;
};


describe('Poll API test', function() {

    // Remove all data and insert polls and a sinle user
    before(function(done) {
      // Clear polls and create polls before testing
      Poll.remove({}, function (err, number) {
        User.remove({}, function (err, number) {
          user.save(function (err, user) {
            // Save user id an assign it to the poll 0
            userId = user._id;
            poll_0.userId = user._id;
            done();
          });
        });
      });
    });

    beforeEach(function(done) {
        // Clear polls and create polls before testing
        Poll.create(polls, function(err) {
          // Obtain the id for first poll
          Poll.findOne({title:polls[0].title}, function (err, poll) {
            poll_0_id = poll._id;
            done();
          });
        });
    });

    afterEach(function(done) {
      Poll.remove({}).exec().then(
        function() {
          done();
        });
    });

    it('GET /api/polls/all should return all the polls', function(done) {
      request(app)
        .get('/api/polls/all')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          if (res.body.length != polls.length) return '/api/polls/all should return all the polls';
        })
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
    });

    it('GET /api/polls/last/:limit/:page should list the last saved polls with limit and pagination', function(done) {
      request(app)
        .get('/api/polls/last/2/1')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          var data = res.body;
          if (data.length != 2) return '/api/polls/last/2/1 should return 2 polls';
          if (!(_.isEqual(data.map(function (e) { return e.title; }), ['poll 0', 'poll 3']))) return "/api/polls/last/2/1 should return ['poll 0', 'poll 3']";
        })
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Array);
          done();
        });
    });

    it('GET /api/polls/all/last/:limit/:page should exclude polls passed in the request', function(done) {
      request(app)
        .get('/api/polls/last/2/1?exclude=' + poll_0_id)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(function(res) {
          var data = res.body;
          if (data.length != 1) return '//api/polls/last/2/1?exclude=' + poll_0_id + ' should return 1 poll';
          if (!(_.isEqual(data.map(function (e) { return e.title; }), ['poll 3']))) return "/api/polls/last/2/1?exclude=" + poll_0_id + " shoul return ['poll 3']";
        })
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Array);
          done();
        });
    });

    it('GET /api/polls/:id should return a poll by id', function(done) {
      request(app)
        .get('/api/polls/' + poll_0_id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Object);
          var data = res.body;
          if (data.title !== polls[0].title) return "/api/polls/" + poll_0_id + " shoul return 'poll 1'";
          done();
        });
    });

    it('GET /api/polls should return 401 to a non authenticated user', function (done) {
        request(app)
          .get('/api/polls')
          .expect(401)
          .end(function(err, res) {
            done();
          });
    });

    it('GET /api/polls should return the list of polls of an authenticated user', function (done) {
        request.agent(app)
          .get('/api/polls')
          .set('Authorization', 'Bearer ' + getTokenFor(userId))  //logged in user
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            should.not.exist(err);
            res.should.have.status(200);
            res.body.should.be.instanceof(Array);
            res.body.length.should.equal(1);
            res.body[0].title.should.equal('poll 0');
            res.body[0].userId.should.equal(userId.toString());
            done();
          });
    });

    it('GET /api/polls/:id should return a poll with the mathing id', function (done) {

      request.agent(app)
        .get('/api/polls/' + poll_0_id)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          res.body.title.should.be.equal(poll_0.title);
          res.body.totalVotes.should.be.equal(poll_0.totalVotes);
          res.body._id.should.be.equal(poll_0._id.toString());
          res.body.userId.should.be.equal(poll_0.userId.toString());
          res.body.options[0].text.should.be.equal(poll_0.options[0].text);
          res.body.options[0].votes.should.be.equal(poll_0.options[0].votes);
          res.body.options[1].text.should.be.equal(poll_0.options[1].text);
          res.body.options[1].votes.should.be.equal(poll_0.options[1].votes);
          res.body.date.should.be.equal('2015-11-04T23:00:00.000Z');
          done();
        });
    });

    it('POST /api/polls/: adding a new poll should be unauthorized for a non authenticated user', function (done) {

      request.agent(app)
        .post('/api/polls/')
        .expect(401, done);

    });

  it('POST /api/polls/: adding a new poll by an authenticated user', function (done) {

    request.agent(app)
      .post('/api/polls/')
      .set('Authorization', 'Bearer ' + getTokenFor(userId))  //logged in user
      .send(newPoll)
      .expect(201) //201 === created
      .end(function (err,res) {
        should.not.exist(err);
        // Check if the poll has been saved
        Poll.findOne({title: newPoll.title}, function (err, poll) {
          if (err) return done(err);
          if (poll) done();
        });
      });

  });

  it('PUT /api/polls : update a poll should be unauthorized by a non authenticated user');

  it('PUT /api/polls : update a poll should be forbidden if the user is not the owner');

  it('PUT /api/polls : update a poll when the user is authenticated and is the owner');

  it('DELETE /api/polls/:id : delete a poll should be unauthorized by a non authenticated user');

  it('DELETE /api/polls/:id : delete a poll should be forbidden if the user is not the owner');

  it('DELETE /api/polls/:id : delete a poll when the user is authenticated and is the owner');

  it('PUT /api/polls/:id/vote : vote a poll is allowed for a non authenticated user');


});


