'use strict';

angular.module('bavaApp')
  .controller('MyPollsCtrl', function ($scope, $http) {

    var _emptyPoll = {title:'',options: [{text:'', votes:0},{text:'', votes:0} ], totalVotes:0};
    var _getPolls = function() {
      $http.get('/api/polls').success(function(polls) {
        $scope.polls = polls;
      });
    };

    var _show = function(page) {
      $scope.page = page;
      if (page === 'form') {
        // Reset new poll
        $scope.newPoll = _.clone(_emptyPoll,true);
      }
      if (page === 'list') {
        // Refresh list of polls (it may have changed since the last view)
        _getPolls();
      }
    };

    // By default load list of polls
    _show('list');

    $scope.show = _show;

    $scope.addOption = function() {
      $scope.newPoll.options.push({text:'', votes:0});
    };

    $scope.addPoll = function() {
      if(!$scope.newPoll) {
        return;
      }
      //filter no blank options
      $scope.newPoll.options =  $scope.newPoll.options.filter( function(e) {return e.text.length > 0 && !(e.text.match(/^\s+$/));});

      $http.post('/api/polls', $scope.newPoll).success(function() {
        $scope.show('list');
      });

    };

    $scope.deletePoll = function(poll) {
      $http.delete('/api/polls/' + poll._id)
        .success(_getPolls); //Refresh list after deletion
    };
  });
