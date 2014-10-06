(function () {
  'use strict';

  angular.module('appAuth', [])

  .controller('MainCtrl', function(AuthService) {
    var vm = this;
    console.log(AuthService);
    vm.doSomething = doSomething;

    function doSomething() {

    }
  });

})();
