'use strict';

angular.module('bavaApp')
  .controller('PollCtrl', function ($scope, $http, $stateParams) {

    console.log('in poll ctrl');

    var _getPoll = function(id) {
      $http.get('/api/polls/' + id).success(function(poll) {
        $scope.poll = poll;
      });
    };
    var _vote = function(poll, option) {
      $http.put('/api/polls/' + poll._id + '/vote', {text: option.text}).success(function(votedPoll) {
        var sortOpts = angular.copy(votedPoll.options).sort(function(a,b) {return a-b;});
        var data = sortOpts.map(function (e) { return e.votes; });
        var labels =  sortOpts.map(function (e) { return e.text; });
        angular.extend(poll, votedPoll, {voted:true, data:data, labels: labels});
      });
    };
    console.log('param:' + $stateParams.id);

    _getPoll($stateParams.id);

    $scope.vote = _vote;

  });
