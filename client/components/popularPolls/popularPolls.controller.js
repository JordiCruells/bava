'use strict';

//var _ = require('lodash');

angular.module('bavaApp').controller('popularPollsCtrl', function($scope, $http) {
//TODO: create a façade to access the server API instead of using raw $http service cause we are accessing to polls API in different controllers

  var _getPolls = function() {
    $http.get('/api/polls/top').success(function(polls) {
      $scope.polls = polls;
    });
  };

  var _vote = function(poll, option) {
    $http.put('/api/polls/' + poll._id + '/vote', {text: option.text}).success(function(votedPoll) {
      angular.extend(poll, votedPoll, {voted:true});
    });
  };

  _getPolls();

  $scope.vote = _vote;

});
