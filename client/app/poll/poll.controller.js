'use strict';

angular.module('bavaApp')
  .controller('PollCtrl', function ($scope, $http, $stateParams, cookieManager) {

    console.log('in poll ctrl');

    var _getPoll = function(id) {
      $http.get('/api/polls/' + id).success(function(poll) {

        var votedPolls = cookieManager.getVotedPolls();
        if (votedPolls.indexOf(poll._id) >= 0) {
            _setVoted(poll);
        }

        $scope.poll = poll;
      });
    };

    var _setVoted = function (poll, votedPoll) {
      var sortOpts = angular.copy(poll.options).sort(function(a,b) {return a-b;});
      var data = sortOpts.map(function (e) { return e.votes; });
      var labels =  sortOpts.map(function (e) { return e.text; });
      angular.extend(poll, {voted:true, data:data, labels: labels});
      if (votedPoll) {
        angular.extend(poll,votedPoll);
      }
    };

    var _vote = function(poll, option) {
      $http.put('/api/polls/' + poll._id + '/vote', {text: option.text}).success(function(votedPoll) {
        _setVoted(poll, votedPoll);
        cookieManager.storeVotedPoll(poll._id);
      });
    };
    console.log('param:' + $stateParams.id);

    _getPoll($stateParams.id);

    $scope.vote = _vote;

  });
