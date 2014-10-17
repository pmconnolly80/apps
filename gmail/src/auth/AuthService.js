/*global _*/
/**
 * @file
 * Service to handle authentication tasks (login, logout...).
 *
 * Based on https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec
 */
(function () {
  'use strict';

  angular.module('auth', [])

    .constant('AUTH_EVENTS', {
      loginSuccess: 'auth-login-success',
      loginFailed: 'auth-login-failed',
      logoutSuccess: 'auth-logout-success',
      sessionTimeout: 'auth-session-timeout',
      notAuthenticated: 'auth-not-authenticated',
      notAuthorized: 'auth-not-authorized'
    })

    // Gmail Auth Scopes
    // @see https://developers.google.com/gmail/api/auth/scopes
    .constant('USER_SCOPES', {
      gmail_read: 'https://www.googleapis.com/auth/gmail.readonly',
      gmail_compose: 'https://www.googleapis.com/auth/gmail.compose',
    })

    .factory('AuthService', function ($http, $window, $document, $q, $rootScope,
                              Session, AUTH_EVENTS, USER_SCOPES, GAPI_CLIENT_ID) {
      var gapi,
          AuthServiceReady = $q.defer();  // Promise that will be resolved when AuthService is ready to be used

      init();

      return {
        isReady: isReady,
        login: login,
        logout: logout,
        isAuthenticated: isAuthenticated,
        isAuthorized: isAuthorized,
        getCurrentUser: getCurrentUser
      };

      /**
       * Load Google SDK, assign `gapi`, check user auth status,
       * and resolve the promise indicating that AuthService is ready.
       */
      function init() {
        // Global function that will be called once the Google JS library is loaded.
        var clientLoadCallback = 'handleClientLoad';
        $window[clientLoadCallback] = function() {
          gapi = $window.gapi;
          // Get the user auth status from Google using "immediate mode" (no UI is shown).
          var authParams = {client_id: GAPI_CLIENT_ID, scope: USER_SCOPES.gmail_read, immediate: true};
          gapi.auth.authorize(authParams, function(authResult) {
            // If the user is still authenticated with Google...
            if (!authResult.error && authResult.access_token) {
              // If the user is also still authenticated with our app, refresh his session.
              if (Session.exists()) {
                Session.create(authResult);
              }
            }
            else {  // Otherwise, reset the session
              Session.destroy();
            }
            // Inform the rest of the app that AuthService is ready.
            AuthServiceReady.resolve('Google JS client library loaded AND User auth status retrieved');
          });
          delete $window.handleClientLoad;
        };
        // Load the Google JavaScript client library.
        addScript('google-jssdk', 'https://apis.google.com/js/client.js?onload=' + clientLoadCallback);
      }

      /**
       * Return a promise that will be resolved when AuthService is ready,
       * i.e. the Google SDK has been loaded and the user auth status has been checked.
       */
      function isReady() {
        return AuthServiceReady.promise;
      }

      /**
       * Authenticate the user while requesting a specific Google authorization scope.
       *
       * Initiate the OAuth 2.0 authorization process without using "immediate mode".
       * The browser will display a popup window prompting the user authenticate and authorize.
       * After the user authorizes, the popup closes and the callback function fires.
       *
       * This method broadcasts events in case of login success and failure.
       *
       * @see https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauthauthorize
       */
      function login(authScope) {
        var isLoggedIn = gapi.auth.authorize({client_id: GAPI_CLIENT_ID, scope: authScope, immediate: false});
        isLoggedIn.then(function(authResult) {
          Session.create(authResult);
          var message = 'User logged in successfully and has granted the following scope(s): ' + authResult.scope;
          $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, message);
        }, function(error) {
          console.log('error', error);
          Session.destroy();
          $rootScope.$broadcast(AUTH_EVENTS.loginFailed, 'Login failed.');
        });
        return isLoggedIn;
      }

      /**
       * Log out the user.
       *
       * NB. We can't log out the user from Google, so we just log him out of our app
       * by resetting his session and broadcasting the logout event.
       */
      function logout() {
        Session.destroy();
        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);

        // The method below could be used if the user was logged in with gapi.auth.signIn().
        // @see https://developers.google.com/+/web/signin/sign-out
        // gapi.auth.signOut();
      }

      function isAuthenticated() {
        return Session.exists();
      }

      /**
       * Return TRUE if the current user possesses any of the given scopes.
       */
      function isAuthorized(authScopes) {
        if (!angular.isArray(authScopes)) {
          authScopes = [authScopes];
        }
        var userScopes = Session.getScopes(),
            intersect = _.intersection(userScopes, authScopes),
            authorized = !!intersect.length;
        return (isAuthenticated() && authorized);
      }

      function getCurrentUser() {
        return Session.get();
      }

      // Get basic user profile using the Google+ API (user must be signed-in).
      function getUserProfile_DEPREC() {
        var deferred = $q.defer();
        gapi.client.load('plus', 'v1').then(function() {
          gapi.client.plus.people.get({'userId': 'me'}).then(function(resp) {
            var profile = resp.result;
            deferred.resolve(profile);
          }, function() {
            deferred.reject('Could not get user profile.');
          });
        });
        return deferred.promise;
      }

      // Add a <script> tag to the current page if it doesn't already exist.
      function addScript(id, src) {
        var d = $document[0], s = 'script',
            js, fjs = d.getElementsByTagName(s)[0];
        if (!d.getElementById(id)) {
          js = d.createElement(s); js.id = id;
          js.src = src;
          fjs.parentNode.insertBefore(js, fjs);
        }
      }

    })

    /**
     * Lightweight session service based on https://github.com/auth0/angular-storage
     */
    .service('Session', function (store) {
      var storeKey = 'currentAuth';
      this.create = function (authResult) {
        store.set(storeKey, {
          access_token: authResult.access_token,
          client_id: authResult.client_id,
          expires_at: authResult.expires_at,
          expires_in: authResult.expires_in,
          scopes: authResult.scope.split(' ')
        });
      };
      this.get = function() {
        return store.get(storeKey);
      };
      this.getScopes = function() {
        var auth = this.get();
        return auth && auth.scopes ? auth.scopes : [];
      };
      this.destroy = function() {
        store.remove(storeKey);
      };
      this.exists = function() {
        var auth = this.get();
        return (auth && auth.access_token);
      };
      return this;
    });

})();

