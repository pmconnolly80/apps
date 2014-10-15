/**
 * @file
 * Directive to display alerts to the user.
 */
(function () {

  angular.module('alert', ['ngSanitize'])

    .directive('alertMessage', function($timeout, AUTH_EVENTS) {
      return {
        restrict: 'E',
        template: '<div ng-class="class" ng-show="visible"><button type="button" class="close" data-dismiss="alert" ng-click="hideAlert()"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><span ng-bind-html="message"></span></div>',
        link: function (scope) {
          // Init
          hideAlert();

          scope.hideAlert = hideAlert;

          // Watch events
          scope.$on(AUTH_EVENTS.loginSuccess, showSuccess);
          scope.$on(AUTH_EVENTS.loginFailed, showError);
          scope.$on(AUTH_EVENTS.notAuthenticated, showError);
          scope.$on(AUTH_EVENTS.notAuthorized, showError);
          scope.$on(AUTH_EVENTS.sessionTimeout, showError);

          function showSuccess(event, message) {
            message = message || event.name;
            showAlert(message, 'alert-success');
          }
          function showError(event, message) {
            message = message || event.name;
            showAlert(message, 'alert-danger');
          }
          function showAlert(message, cssClass) {
            $timeout(function() {
              scope.message = message;
              scope.class   = 'alert ' + cssClass;
              scope.visible = true;
            });
          }
          function hideAlert() {
            $timeout(function() {
              scope.message = '';
              scope.class   = 'alert ';
              scope.visible = false;
            });
          }
        }
      };
    });

})();
