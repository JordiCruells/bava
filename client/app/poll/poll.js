'use strict';

angular.module('bavaApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('poll', {
        url: '/polls',
        templateUrl: 'app/poll/poll.html',
        controller: 'PollCtrl'
      });
  });
