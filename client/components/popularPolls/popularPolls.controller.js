'use strict';

//var _ = require('lodash');

angular.module('bavaApp').controller('popularPollsCtrl', function($scope, $http, $rootScope) {
//TODO: create a façade to access the server API instead of using raw $http service cause we are accessing to polls API in different controllers

  var _getPolls = function() {
    $http.get('/api/polls/top').success(function(polls) {
      $scope.polls = polls;
      // In order to communicate to the last polls controller which polls have been loaded
      // and not repeating them in the last polls widget
      $rootScope.$broadcast('popularPollsLoaded', polls);
    });
  };

  var _vote = function(poll, option) {
    $http.put('/api/polls/' + poll._id + '/vote', {text: option.text}).success(function(votedPoll) {
      var sortOpts = angular.copy(poll.options).sort(function(a,b) {return a-b;});
      var data = sortOpts.map(function (e) { return e.votes; });
      var labels =  sortOpts.map(function (e) { return e.text; });
      angular.extend(poll, votedPoll, {voted:true, data:data, labels: labels});
    });
  };

  _getPolls();

  $scope.vote = _vote;
  $scope.chartOpts = {};

});
