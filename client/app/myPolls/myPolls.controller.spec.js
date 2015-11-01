'use strict';

describe('Controller: MyPollsCtrl', function () {

  // load the controller's module
  beforeEach(module('bavaApp'));

  // load the templates
  beforeEach(module('app/myPolls/myPolls.html', 'components/banner/banner.html', 'components/navbar/navbar.html'));

  var MyPollsCtrl,
    scope,
    $httpBackend;

  var newPollForm, tpl;

  var polls = [];
  // Create 5 polls ('poll 1', 'poll 2', ....)
  for (var i=0; i<5; i++) {
    polls.push(PollBuilder().setTitle('poll ' + i).setId('id_' + i).build());
  };

  var newPoll =  PollBuilder()
                .setTitle('new poll')
                .addOption({text:'option 1', votes:0})
                .addOption({text:'option 2', votes:0})
                .build();
  var newPollWithBlanks = PollBuilder()
                          .setTitle('new poll')
                          .addOption({text:'option 1', votes:0})
                          .addOption({text:'', votes:0})
                          .addOption({text:'option 2', votes:0})
                          .build();
  var newPollWithDuplicateds = PollBuilder()
    .setTitle('new poll')
    .addOption({text:'option 1', votes:0})
    .addOption({text:'option 1', votes:0})
    .addOption({text:'option 2', votes:0})
    .build();

  var emptyPoll = PollBuilder()
                  .setTitle('')
                  .addOption({text:'', votes:0})
                  .addOption({text:'', votes:0})
                  .build();

  var fakeRespondFB = [{
    "url": '',
    "normalized_url": '',
    "share_count":0,
    "like_count":0,
    "comment_count":0,
    "total_count":0,
    "click_count":0,
    "comments_fbid":null,
    "commentsbox_count":0
  }];

  var linkToPoll = function(id) {
    return 'http://bava.herokuapp.com/poll/' + id;
  }


  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/polls').respond(polls);
    scope = $rootScope.$new();
    MyPollsCtrl = $controller('MyPollsCtrl', {
      $scope: scope
    });
    $httpBackend.flush(); //Start loading all polls for each test
  }));

  describe('Given that I have loaded MyPollsCtrl', function () {
    it('should be attached a list of user polls to the scope', function () {

      expect(scope.polls.length).toBe(5);
      for (var i=0; i<5; i++) {
        expect(scope.polls[i].title).toBe('poll '+ i);
        expect(scope.polls[i].showOptionForm).toBe(false);
        expect(scope.polls[i].optionText).toBe('');
      }
    });
  });

  describe('Given I add a new poll', function () {
    it('should call the server to save the new poll and add the poll to the polls scope', function () {
      scope.newPoll = newPoll;
      scope.addPoll();
      $httpBackend.expectPOST('/api/polls', newPoll).respond(201);
      var respondWith = angular.copy(polls);
      respondWith.push(scope.newPoll);
      $httpBackend.expectGET('/api/polls').respond(respondWith);
      $httpBackend.flush();
      expect(scope.polls.length).toBe(6);
    });
  });

  describe('Given I add a new poll with an empty option', function () {
    it('should remove the empty option of the new poll scope', function () {
      scope.newPoll = newPollWithBlanks;
      scope.addPoll();
      expect(scope.newPoll.options.length).toBe(2); // 3rd option removed from newPollWithBlanks
      expect(scope.newPoll.options[1].text).toBe('option 2');
    });
  });

  describe('Given I delete a poll', function () {
    it('should call the server to the delete the poll and remove the poll from polls scope', function () {
      var respondWith = angular.copy(polls);
      respondWith.shift();
      scope.deletePoll(polls[0]);
      $httpBackend.expectDELETE('/api/polls/' + polls[0]._id).respond(204);
      $httpBackend.expectGET('/api/polls').respond(respondWith);
      $httpBackend.flush();
      expect(scope.polls.length).toBe(4);
    });
  });

  describe('Given I introduce a new poll with duplicated options', function () {

    beforeEach(inject(function ($templateCache, $compile) {
      // "Option 1" is repeated twice
      //scope.newPoll = {title:'Duplicated poll', options: [{text:'option 1', votes:0}, {text:'option 1', votes:0}, {text:'option 2', votes:0} ], totalVotes:0 };
      scope.newPoll = newPollWithDuplicateds;
      scope.page = 'form';

      // We need to load the template to get a reference to the new poll form which is required in the controller
      var template = $templateCache.get('app/myPolls/myPolls.html');
      var tpl = angular.element(template);
      $compile(tpl)(scope);
      // For each poll ther is a call to FB API to load its share FB button
      for (var i = 0; i < polls.length; i++) {
        var link = linkToPoll(polls[i]._id);
        $httpBackend.expectGET('https://api.facebook.com/method/links.getStats?urls=' + link + '&format=json').respond(angular.merge(fakeRespondFB, {
          "url": link,
          "normalized_url": link
        }));
      }
      $httpBackend.flush();
      scope.$digest();
      scope.checkOptionNotDuplicated();
    }));

    it('should find the duplicated options', function () {
      expect(scope.isDuplicated(0)).toBeTruthy();
      expect(scope.isDuplicated(1)).toBeTruthy();
      expect(scope.isDuplicated(2)).toBeFalsy();
      expect(scope.newPollForm.$valid).toBeFalsy();
    });
  });

  describe('Given I add a new option to a poll', function () {

    beforeEach(function () {
      scope.newPoll = newPoll;
      scope.page = 'form';
      scope.addOption();
    });

    it('should add a new option to the scope', function () {
      expect(scope.newPoll.options.length).toBe(3);
      expect(scope.newPoll.options[2].text).toBe('');
      expect(scope.newPoll.options[2].votes).toBe(0);
    });
  });

  describe('Given I call show("form")', function () {

    beforeEach(function () {
      scope.show('form');
    });

    it('should initialize a new poll within the scope and show a form', function () {
      expect(scope.page).toEqual('form');
      expect(scope.newPoll.title).toEqual(emptyPoll.title);
      expect(scope.newPoll.options).toEqual(emptyPoll.options);
      expect(scope.newPoll.totalVotes).toEqual(emptyPoll.totalVotes);
    });
  });

  describe('Given I call show("list")', function () {

    beforeEach(function () {
      scope.show('list');
    });

    it('should load user polls calling to server API and show the list', function () {
      expect(scope.page).toEqual('list');
      $httpBackend.expectGET('/api/polls').respond(polls);
      $httpBackend.flush(); //Start loading all polls for each test
      expect(scope.polls.length).toBe(5);
    });
  });

  describe('Given I call addOptionToOldPoll for a poll', function () {
    var poll;
    beforeEach(function () {
      poll = angular.merge(scope.polls[0], {showOptionForm: false });
      scope.addOptionToOldPoll(poll);
    });

    it('should update the showOptionForm property of the poll to true', function () {
      expect(poll.showOptionForm).toEqual(true);
    });
  });

  describe('Given I addOptionToOldPoll for a poll that is being edited', function () {
    var poll;
    beforeEach(function () {
      poll = angular.merge(scope.polls[0], {showOptionForm: true });
      scope.addOptionToOldPoll(poll);
    });

    it('should update the showOptionForm property of the poll to false', function () {
      expect(poll.showOptionForm).toEqual(false);
    });
  });

  describe('Given I save a new option for a poll', function () {
    var poll;
    var newOptionText = 'new option to append';
    beforeEach(function () {

      poll = scope.polls[0];
      poll.optionText = newOptionText;
      scope.saveOptionToOldPoll(poll);
    });

    it('should call the backend to update the poll', function () {
      var options;
      var sendPoll = poll;
      sendPoll.options.push({text: newOptionText, votes: 0 });
      $httpBackend.expectPUT('/api/polls/' + poll._id, sendPoll).respond(sendPoll);
      $httpBackend.flush();
      options = scope.polls[0].options;
      expect(options[options.length - 1]).toEqual({text: newOptionText, votes: 0 });
    });
  });


});
