(function () {
  'use strict';

  angular.module('appGmail', [])

  .constant('FBURL', 'https://amber-fire-8058.firebaseio.com/')

  .controller('MainCtrl', function($scope) {
    var vm = this;

    vm.doSomething = doSomething;

    vm.total = [
      {name: 'zzf'},
      {name: 'zzf'},
      {name: 'zzf'},
      {name: 'zzf'}
    ];

    function doSomething() {

    }
  });

})();
