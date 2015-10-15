'use strict';

/**
 * Removes server error when user updates input
 */
angular.module('bavaApp')
  .directive('popularPolls', function () {
    return {
      restrict: 'E',
      templateUrl: 'components/popularPolls/popularPolls.html',
      replace: true,
      require:['carousel','slide']
    };
  });
