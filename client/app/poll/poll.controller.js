'use strict';

angular.module('bavaApp')
  .controller('PollCtrl', function ($scope, $http) {

    $scope.showForm = false;
    $scope.showList = true;

    $scope.show = function(el) {
        if (el === 'form') {
          $scope.showList = false;
          $scope.showForm = true; }
        else {
          $scope.showList = true;
          $scope.showForm = false;
        }
    };

    $http.get('/api/polls').success(function(polls) {
      $scope.polls = polls;
    });

    $scope.addPoll = function() {
      if(!$scope.newPoll) {
        return;
      }
      $http.post('/api/polls', { name: $scope.newPoll });
      $scope.newPoll = {};
    };

    $scope.deletePoll = function(poll) {
      $http.delete('/api/polls/' + poll._id);
    };
  });
