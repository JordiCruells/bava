'use strict';

//var _ = require('lodash');

angular.module('bavaApp').controller('popularPollsCtrl', function($scope, $http, $rootScope, cookieManager) {
//TODO: create a façade to access the server API instead of using raw $http service cause we are accessing to polls API in different controllers

  var _getPolls = function() {
    $http.get('/api/polls/top').success(function(polls) {

      // Set the voted flag to true to those polls aready voted for this user
      var votedPolls = cookieManager.getVotedPolls();
      polls = polls.map(function (p) {
        if (votedPolls.indexOf(p._id) >= 0) {
          _setVoted(p);
        }
        return p;
      });

      $scope.polls = polls;

      // In order to communicate to the last polls controller which polls have been loaded
      // and not repeating them in the last polls widget
      $rootScope.$broadcast('popularPollsLoaded', polls);
    });
  };

  var _setVoted = function (poll, votedPoll) {
    var sortOpts = angular.copy(poll.options).sort(function(a,b) {return a-b;});
    var data = sortOpts.map(function (e) { return e.votes; });
    var labels =  sortOpts.map(function (e) { return e.text; });
    angular.extend(poll, {voted:true, data:data, labels: labels});
    if (votedPoll) {
      angular.extend(poll,votedPoll);
    }
  };

  var _vote = function(poll, option) {
    $http.put('/api/polls/' + poll._id + '/vote', {text: option.text}).success(function(votedPoll) {
      _setVoted(poll, votedPoll);
      cookieManager.storeVotedPoll(poll._id);
    });
  };

  _getPolls();

  $scope.vote = _vote;
  $scope.chartOpts = {};

});
