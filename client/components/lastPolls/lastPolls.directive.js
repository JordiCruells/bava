'use strict';

/**
 * Removes server error when user updates input
 */
angular.module('bavaApp')
  .directive('lastPolls', function () {
    return {
      restrict: 'E',
      scope: true, //Otherwise scope of lastPolls and topPolls is conflicting
      templateUrl: 'components/lastPolls/lastPolls.html',
      replace: true
    };
  });
