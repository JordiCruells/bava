'use strict';

angular.module('bavaApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('myPolls', {
        url: '/my-polls',
        templateUrl: 'app/myPolls/myPolls.html',
        controller: 'MyPollsCtrl'
      });
  });
