'use strict';

angular.module('bavaApp').controller('lastPollsCtrl', function($scope, $http, cookieManager) {
//TODO: create a façade to access the server API instead of using raw $http service cause we are accessing to polls API in different controllers

  var _getPolls = function(first) {
    $http.get('/api/polls/last/' + $scope.limit + '/' + $scope.page + $scope.excludePolls).success(function(polls) {
      if (!first || polls.length === 0) {

        var votedPolls = cookieManager.getVotedPolls();
        // Set the voted flag to true to those polls aready voted for this user
        polls = polls.map(function (p) {
          if (votedPolls.indexOf(p._id) >= 0) {
            _setVoted(p);
          }
          return p;
        });


        $scope.polls = polls; // Prevent first load to update the model if it has been already loaded (popularPollsLoaded event)
      }
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
      angular.extend(poll, votedPoll, {voted:true});
      cookieManager.storeVotedPoll(poll._id);
    });
  };
  var _loadNext = function() {
    $scope.page += ($scope.polls.length === $scope.limit) ? 1 : 0;
  };
  var _loadPrevious = function() {
    if($scope.page > 0) { $scope.page -=1 };
  };

  $scope.page = 0;
  $scope.limit = 5;
  $scope.vote = _vote;
  $scope.loadNext = _loadNext;
  $scope.loadPrevious = _loadPrevious;
  $scope.excludePolls = '';

  $scope.$watchGroup(['page','excludePolls', 'limit'], function() {_getPolls(false);});

  // We don't want to repeat the same polls in the popular polls widget
  $scope.$on('popularPollsLoaded', function(event, polls) {
    $scope.excludePolls = '?exclude=' + polls.map(function (e) { return e._id; }).join(',');
  });

  _getPolls('init'); // Initial load

});
