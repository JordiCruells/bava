'use strict';

describe('Directive: popularPolls', function () {

  var element, scope, popularPollsCtrl;

  var polls = [];
  // Create 3 polls ('poll 1', 'poll 2', ....)
  for (var i=0; i<3; i++) {
    polls.push(PollBuilder().setTitle('poll ' + i).setId('id_' + i).build());
  };

  // load the controller's module
  beforeEach(module('bavaApp'));

  beforeEach(module('components/popularPolls/popularPolls.html'));

  // Init scope and compile directive
  beforeEach(inject(function ($rootScope, $controller, $compile, _$httpBackend_, $templateCache) {

    var httpBackend = _$httpBackend_;
    var template = $templateCache.get('app/components/popularPolls/popularPolls.html');

    scope = $rootScope.$new();

    element = angular.element(template);
    $compile(element)(scope);
    scope.$digest();

    httpBackend.expectGET('/api/polls/top').respond(polls);

    popularPollsCtrl = $controller('popularPollsCtrl', {
      $scope: scope
    });

    httpBackend.flush(); //Start loading all polls for each test

  }));

  it('should load the top polls to the scope', function () {
    expect(scope.polls.length).toBe(3);
    for (var i=0; i<3; i++) {
      expect(scope.polls[i].title).toBe('poll '+ i);
    }
  });


});
