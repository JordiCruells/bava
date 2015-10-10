'use strict';

angular.module('bavaApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('poll', {
        url: '/poll',
        templateUrl: 'app/poll/poll.html',
        controller: 'PollCtrl'
      });
  });
