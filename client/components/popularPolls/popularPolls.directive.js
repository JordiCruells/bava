'use strict';

/**
 * Removes server error when user updates input
 */
angular.module('bavaApp')
  .directive('popularPolls', function () {
    return {
      restrict: 'E',
      scope: true, //Otherwise scope of lastPolls and topPolls is conflicting
      templateUrl: 'components/popularPolls/popularPolls.html',
      replace: true,
      require:['carousel','slide']
    };
  });