'use strict';

angular.module('bavaApp')
  .controller('MyPollsCtrl', function ($scope, $http) {

    var _emptyPoll = {title:'',options: [{text:'', votes:0},{text:'', votes:0} ], totalVotes:0};
    var _getPolls = function() {
      $http.get('/api/polls').success(function(polls) {
        $scope.polls = polls.map(function(e) {return angular.extend(e, {showOptionForm: false, optionText: ''})});
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

    var _addOptionToOldPoll = function (poll) {
      poll.showOptionForm = !poll.showOptionForm;
    };

    var _saveOptionToOldPoll = function(poll) {

      var updatedPoll = angular.merge({}, poll);
      updatedPoll.options.push({text: poll.optionText, votes: 0 });

      $http.put('/api/polls/' + poll._id, updatedPoll).success(function(p) {
        poll = angular.merge(poll, p, {showOptionForm: false, optionText:''});
      });

    };

    var _checkOptionNotDuplicated = function() {
      var i, field, invalid;
      var options = angular.copy($scope.newPoll.options)
        .map(function (e,index) {
          return angular.merge(e, {index: index});
        })
        .sort(function (a,b) {
          if (a.text > b.text) {return 1;}
          else if (a.text < b.text) { return -1;}
          else return 0;
        });

      for (i=0; i<options.length;i++) {
        field = $scope.newPollForm['options[' + options[i].index + ']'];
        invalid = ((options[i-1] && options[i-1].text === options[i].text) || (options[i+1] && options[i+1].text === options[i].text));
        field.$setValidity('isDuplicated',!invalid);
      }
    };

    var _isDuplicated = function(index) {
      return $scope.newPollForm['options[' + index + ']'].$error.isDuplicated;
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


    $scope.addOptionToOldPoll = _addOptionToOldPoll;
    $scope.saveOptionToOldPoll = _saveOptionToOldPoll;
    $scope.checkOptionNotDuplicated = _checkOptionNotDuplicated;
    $scope.isDuplicated = _isDuplicated;

  });
