(function () {
  'use strict';

  angular.module('gmailApp', ['ui.router'])

    .config(function($stateProvider, $urlRouterProvider) {

      // Redirect any unmatched path to /inbox
      $urlRouterProvider.otherwise("/inbox");

      $stateProvider
        .state('messages', {
          abstract: true,
          templateUrl: 'partials/messages.tpl.html'
        })
        .state('messages.details', {
          url: '/inbox/:msgId',
          templateUrl: 'partials/messages-details.tpl.html',
          controller: function ($scope, $stateParams) {
            $scope.params = $stateParams;
          }
        })
        .state('messages.inbox', {
          url: '/inbox',
          templateUrl: 'partials/messages-inbox.tpl.html'
        })
        .state('messages.sent', {
          url: '/sent',
          templateUrl: 'partials/messages-sent.tpl.html'
        })
        .state('messages.drafts', {
          url: '/drafts',
          templateUrl: 'partials/messages-drafts.tpl.html'
        })
        .state('messages.label', {
          url: '/label/:labelId',
          templateUrl: 'partials/messages-label.tpl.html',
          controller: function ($scope, $stateParams) {
            $scope.params = $stateParams;
          }
        })
        .state('contacts', {
          abstract: true,
          url: '/contacts',
          templateUrl: 'partials/contacts.tpl.html'
        })
        .state('contacts.details', {
          url: '/:contactId',
          templateUrl: 'partials/contacts-details.tpl.html',
          controller: function ($scope, $stateParams) {
            $scope.params = $stateParams;
          }
        })
        .state('contacts.all', {
          // url: '/contacts',
          url: '',
          templateUrl: 'partials/contacts-all.tpl.html'
        })
        .state('contacts.group', {
          url: '/group/:groupId',
          templateUrl: 'partials/contacts-group.tpl.html',
          controller: function ($scope, $stateParams) {
            $scope.params = $stateParams;
          }
        });
    })

    // The sole purpose of this controller is to declare the "whichRouter" variable.
    // Without the need for this variable, this controller could be omitted.
    .controller('MainCtrl', function ($scope) {
      // Indicate that we're using ui-router.
      $scope.whichRouter = 'ui-router';
    });

})();
