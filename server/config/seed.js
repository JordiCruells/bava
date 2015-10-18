/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Poll = require('../api/poll/poll.model');

Thing.find({}).remove(function() {
  Thing.create(
    {
      icon : "bolt",
      name : "Live Results",
      info : "Live graphs show your poll results immediately in an easy to understand format. One graph will not provide the whole picture, that's why we provide multiple graph types to better describe your results.",
      active: true

    },
    {
      icon : "globe",
      name : "Works Everywhere",
      info : "Traditional desktop computers now represent only 30% of Internet traffic. Your poll must work on the tablets, smart phones, netbooks and notebooks that your visitors are using. Our responsive designs do just that.",
      active: true
    },
    {
      icon : "facebook",
      name : "Social Integration",
      info : "Free integrated facebook or traditional comments allow your poll voters to provide immediate feedback and discuss results. Social share buttons encourage your poll voters to help spread the word.",
      active: true
    }


  );
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');

      // Create some polls for the test user
      Poll.find({}).remove(function() {
        User.findOne({email: 'test@test.com'}, function (err, user) {
          Poll.create(
            {
              title: 'What is your favourite drink in the morning ?',
              userId: user._id,
              options: [{text:'cofee', votes:4}, {text:'milk&cofee', votes:5}, {text:'tea', votes:3}, {text:'fruits juice', votes:1}],
              totalVotes: 13,
              date: new Date('2015-10-05')
            },
            {
              title: 'What is your favourite colour for a car ?',
              userId: user._id,
              options: [{text:'white', votes:7}, {text:'red', votes:2}, {text:'black', votes:11}, {text:'orange', votes:1}],
              totalVotes: 21,
              date: new Date('2015-10-08')
            },
            {
              title: 'What team wil be winning the Europe\'s Champions League this year ?',
              userId: user._id,
              options: [{text:'F.C.Barcelona', votes:8}, {text:'R.Madrid', votes:2}, {text:'Bayern Munich', votes:5}, {text:'Manchester United', votes:2}],
              totalVotes: 17,
              date: new Date('2015-10-06')
            },
            {
              title: 'What is you favourite JS Framework ?',
              userId: user._id,
              options: [{text:'Angular JS', votes:7}, {text:'Backbone', votes:2}, {text:'React JS', votes:5}],
              totalVotes: 14,
              date: new Date('2015-10-05')
            },
            {
              title: 'What is your favourite fruit ?',
              userId: user._id,
              options: [{text:'Bananas', votes:3}, {text:'strawberries', votes:2}, {text:'oranges', votes:5}, {text:'apples', votes:2}],
              totalVotes: 12,
              date: new Date('2015-10-11')
            },
            {
              title: 'Just a silly poll 1',
              userId: user._id,
              options: [{text:'I don\'t care', votes:0}, {text:'I don\'t mind', votes:1}],
              totalVotes: 1,
              date: new Date('2015-10-12')
            },
            {
              title: 'Just a silly poll 2',
              userId: user._id,
              options: [{text:'I don\'t care', votes:0}, {text:'I don\'t mind', votes:1}],
              totalVotes: 1,
              date: new Date('2015-10-13')
            },{
              title: 'Just a silly poll 3',
              userId: user._id,
              options: [{text:'I don\'t care', votes:0}, {text:'I don\'t mind', votes:1}],
              totalVotes: 1,
              date: new Date('2015-10-14')
            },{
              title: 'Just a silly poll 4',
              userId: user._id,
              options: [{text:'I don\'t care', votes:0}, {text:'I don\'t mind', votes:1}],
              totalVotes: 1,
              date: new Date('2015-10-15')
            },{
              title: 'Just a silly poll 5',
              userId: user._id,
              options: [{text:'I don\'t care', votes:0}, {text:'I don\'t mind', votes:1}],
              totalVotes: 1,
              date: new Date('2015-10-16')
            },{
              title: 'Just a silly poll 6',
              userId: user._id,
              options: [{text:'I don\'t care', votes:0}, {text:'I don\'t mind', votes:1}],
              totalVotes: 1,
              date: new Date('2015-10-17')
            },{
              title: 'Just a silly poll 7',
              userId: user._id,
              options: [{text:'I don\'t care', votes:0}, {text:'I don\'t mind', votes:1}],
              totalVotes: 1,
              date: new Date('2015-10-18')
            },{
              title: 'Just a silly poll 8',
              userId: user._id,
              options: [{text:'I don\'t care', votes:0}, {text:'I don\'t mind', votes:1}],
              totalVotes: 1,
              date: new Date('2015-10-19')
            },
            function() {
              console.log('finished populating polls for the test user');
            }
          );
        });
      });

    }
  );
});





