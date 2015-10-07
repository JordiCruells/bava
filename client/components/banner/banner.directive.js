'use strict';

/**
 * Removes server error when user updates input
 */
angular.module('bavaApp')
  .directive('banner', function () {
    return {
      restrict: 'E',
      templateUrl: 'components/banner/banner.html',
      replace: true,
      transclude: true
    };
  });
