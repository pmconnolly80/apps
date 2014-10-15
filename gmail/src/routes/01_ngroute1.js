(function () {
  'use strict';

  angular.module('gmailApp', ['ngRoute'])
    .config(function($routeProvider) {
      $routeProvider
        .when('/inbox', {template: '<p>Inbox (list of messages)</p><p><a href="#/inbox/45">View message details</a></p>'})
        .when('/inbox/:msgid', {template: 'Details of message {{params.msgid}}'})
        .when('/sent', {template: 'Sent messages'})
        .when('/drafts', {template: 'Draft messages'})
        .when('/label/:label', {template: 'Messages with label "{{params.label}}"'})
        .when('/contacts', {template: '<p>Contacts (list of contacts)</p><p><a href="#/contacts/32">View contact details</a></p>'})
        .when('/contacts/:contactid', {template: 'Details of contact {{params.contactid}}'})
        // Redirect any unmatched path to /inbox
        .otherwise({redirectTo: '/inbox'});
    })
    .controller('MainCtrl', function($scope, $routeParams) {
      // Publish $routeParams on the scope to show how matched named groups
      // such as :msgid or :label can be passed to the view.
      $scope.params = $routeParams;
    });

})();
