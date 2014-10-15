/**
 * @file
 * App entry point - Defines the routes and the app controller.
 */
(function () {
  'use strict';

  angular.module('gmailApp', ['ui.router', 'angular-storage', 'auth', 'alert'])

    // Google OAuth Client ID ("ng-workshop" project)
    .constant('GAPI_CLIENT_ID', '178943113374-d5f5mska0vvb956jb1e8sstf8dgqbqrh.apps.googleusercontent.com')

    /**
     * Configure the application states.
     *
     * For the purposes of this tutorial, I have defined three routes
     * with a different access level for each:
     *
     *   - /login (login form)                -- Publicly accessible
     *   - /messages (list of Gmail messages) -- Requires the user to be authenticated
     *                                           with the Gmail "read-only" scope.
     *   - /compose (compose a new message)   -- Requires the user to be authenticated
     *                                           with the Gmail "compose" scope.
     *
     * Each state declares the scopes it requires under the `data` key.
     *
     * I've kept the concept of "scope" since this is what Google APIs use to control permissions.
     * In a different project, I might have used a more generic term like "role" or "permission".
     */
    .config(function($stateProvider, $urlRouterProvider, USER_SCOPES) {

      // Redirect any unmatched path to /login
      $urlRouterProvider.otherwise('/login');

      $stateProvider
        .state('login', {
          url: '/login',
          templateUrl: 'partials/login-form.tpl.html'
        })
        .state('logged-out', {
          url: '/logged-out',
          templateUrl: 'partials/logged-out.tpl.html'
        })
        .state('messages', {
          url: '/messages',
          templateUrl: 'partials/message-list.tpl.html',
          data: {
            authorizedScopes: [USER_SCOPES.gmail_read]
          }
        })
        .state('compose', {
          url: '/compose',
          templateUrl: 'partials/compose-form.tpl.html',
          data: {
            authorizedScopes: [USER_SCOPES.gmail_compose]
          }
        })
        ;
    })

    .run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {

      var frozenRoute, unregisterRouteFreeze;

      // Freeze routing until AuthService is ready.
      freezeRouting();
      AuthService.isReady().then(function() {
        setupRoutingAccess();
        unfreezeRouting();
      });

      // Prevent all route changes and store the frozen route.
      function freezeRouting() {
        unregisterRouteFreeze = $rootScope.$on('$stateChangeStart', function (event, next) {
          event.preventDefault();
          frozenRoute = next;
        });
      }

      // Set up access control on routes.
      function setupRoutingAccess() {
        // When a new state is selected, verify that the current user may access it
        // before actually activating the state.
        $rootScope.$on('$stateChangeStart', function (event, next) {
          if (next.data && next.data.authorizedScopes) {
            var authorizedScopes = next.data.authorizedScopes;
            if (!AuthService.isAuthorized(authorizedScopes)) {
              event.preventDefault();  // Prevent state change
              if (AuthService.isAuthenticated()) {
                // User is authenticated but not authorized.
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized, 'You are not authorized to view this page. You need at least one of the following auth scope(s) to view this page: ' + authorizedScopes.join(', '));
              } else {
                // User is not authenticated.
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, 'You must be authenticated to view this page. Go to the <a href="" ui-sref="login">Login screen</a>.');
              }
            }
          }
        });
        // When the user logs out successfully, redirect him to a confirmation screen.
        $rootScope.$on(AUTH_EVENTS.logoutSuccess, function() {
          $state.go('logged-out');
        });
      }

      // Reactivate route changes.
      function unfreezeRouting() {
        // Detach the event listener that was preventing route changes.
        unregisterRouteFreeze();
        // Now that everything is set up, re-activate the frozen route.
        $state.go(frozenRoute.name);
      }

    })

    .controller('AppCtrl', function ($scope, $state, AuthService, USER_SCOPES) {
      // Hide the UI until AuthService is ready.
      $scope.isLoading = true;
      AuthService.isReady().then(function() {
        $scope.isLoading = false;
      });

      // Publish some auth params on the scope so they can be used in the views.
      $scope.USER_SCOPES = USER_SCOPES;
      $scope.currentUser = AuthService.getCurrentUser();
      $scope.isAuthorized = AuthService.isAuthorized;

      $scope.setCurrentUser = function (user) {
        $scope.currentUser = user;
      };

      $scope.compose = function() {
        $state.go('compose');
      };

      $scope.cancelCompose = function() {
        $state.go('messages');
      };

      $scope.logout = function() {
        AuthService.logout();
        var user = AuthService.getCurrentUser();
        $scope.setCurrentUser(user);
      };
    });

})();
