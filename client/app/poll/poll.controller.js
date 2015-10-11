'use strict';

angular.module('bavaApp')
  .controller('PollCtrl', function ($scope, $http) {

    var _emptyPoll = {title:'',options: [{text:''},{text:''} ]};
    var _getPolls = function() {
      $http.get('/api/polls').success(function(polls) {
        $scope.polls = polls;
        alert(JSON.stringify(polls));
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
      $scope.newPoll.options.push({text:''});
    };

    $scope.addPoll = function() {
      if(!$scope.newPoll) {
        return;
      }
      $http.post('/api/polls', $scope.newPoll );
      $scope.show('list');
    };

    $scope.deletePoll = function(poll) {
      $http.delete('/api/polls/' + poll._id)
        .success(_getPolls); //Refresh list after deletion
    };
  });
