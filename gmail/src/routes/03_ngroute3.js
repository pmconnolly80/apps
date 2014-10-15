(function () {
  'use strict';

  angular.module('gmailApp', ['ngRoute', 'GmailMock'])

    .config(function($routeProvider) {
      $routeProvider
        .when('/inbox', {
          templateUrl: 'partials/two-cols.tpl.html',
          subnavUrl: 'partials/messages-nav.tpl.html',
          contentUrl: 'partials/messages-list.tpl.html',
          controller: 'MessageListCtrl',
          resolve: {
            messages: function(GmailMessages) {
              return GmailMessages.listInbox();
            }
          }
        })
        .when('/inbox/:msgId', {
          templateUrl: 'partials/two-cols.tpl.html',
          subnavUrl: 'partials/messages-nav.tpl.html',
          contentUrl: 'partials/messages-details.tpl.html'
        })
        .when('/sent', {
          templateUrl: 'partials/two-cols.tpl.html',
          subnavUrl: 'partials/messages-nav.tpl.html',
          contentUrl: 'partials/messages-list.tpl.html',
          controller: 'MessageListCtrl',
          resolve: {
            messages: function(GmailMessages) {
              return GmailMessages.listSent();
            }
          }
        })
        .when('/drafts', {
          templateUrl: 'partials/two-cols.tpl.html',
          subnavUrl: 'partials/messages-nav.tpl.html',
          contentUrl: 'partials/messages-list.tpl.html',
          controller: 'MessageListCtrl',
          resolve: {
            messages: function(GmailMessages) {
              return GmailMessages.listDrafts();
            }
          }
        })
        .when('/label/:labelId', {
          templateUrl: 'partials/two-cols.tpl.html',
          subnavUrl: 'partials/messages-nav.tpl.html',
          contentUrl: 'partials/messages-list.tpl.html',
          controller: 'MessageListCtrl',
          resolve: {
            messages: function(GmailMessages, $route) {
              return GmailMessages.listForLabel($route.current.params.labelId);
            }
          }
        })
        .when('/contacts', {
          templateUrl: 'partials/two-cols.tpl.html',
          subnavUrl: 'partials/contacts-nav.tpl.html',
          contentUrl: 'partials/contacts-all.tpl.html',
          resolve: {
            // Cause a 1-second delay.
            delay: function($q, $timeout) {
              var delay = $q.defer();
              $timeout(delay.resolve, 1000);
              return delay.promise;
            }
          }
        })
        .when('/contacts/:contactId', {
          templateUrl: 'partials/two-cols.tpl.html',
          subnavUrl: 'partials/contacts-nav.tpl.html',
          contentUrl: 'partials/contacts-details.tpl.html'
        })
        .when('/contacts/group/:groupId', {
          templateUrl: 'partials/two-cols.tpl.html',
          subnavUrl: 'partials/contacts-nav.tpl.html',
          contentUrl: 'partials/contacts-group.tpl.html'
        })
        // Redirect any unmatched path to /inbox
        .otherwise({redirectTo: '/inbox'});
    })

    .controller('TwoColsCtrl', function($scope, $route) {
      // Problem of this technique: when the path contains a named group,
      // we're unable to find the route definition. I.e. "/label/work" doesn't match "/label/:label".
      // var path = $location.path();  // Current path
      // $scope.subnavUrl = $route.routes[path].subnavUrl;
      // $scope.contentUrl = $route.routes[path].contentUrl;
      // console.log(GmailMessages.list());

      // Indicate that we're using ngRoute.
      $scope.whichRouter = 'ngRoute';

      // Problem of this technique: are we allowed to access $route.current.$$route?
      $scope.subnavUrl = $route.current.$$route.subnavUrl;
      $scope.contentUrl = $route.current.$$route.contentUrl;

      // Pass the current route params to the view.
      $scope.params = $route.current.params;
    })

    .controller('MessageListCtrl', function($scope, messages) {
      // Expose the loaded message on the scope.
      $scope.messages = messages;
    });

})();
