'use strict';

angular.module('bavaApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('poll', {
        url: '/poll/:id',
        templateUrl: 'app/poll/poll.html',
        controller: 'PollCtrl'
      });
  });
