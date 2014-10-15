/**
 * @file
 * Lightweight session service based on https://github.com/auth0/angular-storage
 */
(function () {
  'use strict';

  angular.module('auth')

    .service('Session', function (store) {
      var sessionKey = 'currentAuth';
      this.create = function (authResult) {
        store.set(sessionKey, {
          access_token: authResult.access_token,
          client_id: authResult.client_id,
          expires_at: authResult.expires_at,
          expires_in: authResult.expires_in,
          scopes: authResult.scope.split(' ')
        });
      };
      this.get = function() {
        return store.get(sessionKey);
      };
      this.getScopes = function() {
        var auth = this.get();
        return auth && auth.scopes ? auth.scopes : [];
      };
      this.destroy = function() {
        store.remove(sessionKey);
      };
      this.exists = function() {
        var auth = this.get();
        return (auth && auth.access_token);
      };
      return this;
    });

})();
