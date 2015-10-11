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
              options: [{text:'cofee', votes:4}, {text:'milk&cofee', votes:5}, {text:'tea', votes:3}, {text:'fruits juice', votes:1}]
            },
            {
              title: 'What is your favourite colour for a car ?',
              userId: user._id,
              options: [{text:'white', votes:7}, {text:'red', votes:2}, {text:'black', votes:11}, {text:'orange', votes:1}]
            },
            {
              title: 'What team wil be winning the Champions League this year ?',
              userId: user._id,
              options: [{text:'F.C.Barcelona', votes:8}, {text:'R.Madrid', votes:2}, {text:'Bayern Munich', votes:5}, {text:'Manchester United', votes:2}]
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





