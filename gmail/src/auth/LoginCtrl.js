/**
 * @file
 * Login Controller
 *
 * Handle actions on the login screen.
 */
(function () {
  'use strict';

  angular.module('gmailApp')

    .controller('LoginCtrl', function ($scope, $state, AuthService) {

      // Perform login.
      $scope.login = function (authScope) {
        AuthService.login(authScope).then(function() {
          var user = AuthService.getCurrentUser();
          $scope.setCurrentUser(user);
          // Redirect the user to the message list.
          $state.go('messages');
        });
      };
    });

})();
