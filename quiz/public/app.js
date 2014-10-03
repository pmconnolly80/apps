/* global Firebase */
(function () {
  'use strict';

  angular.module('appQuiz', ['firebase'])

  .constant('FBURL', 'https://amber-fire-8058.firebaseio.com/')

  .controller('MainCtrl', function($scope, FBURL, $firebase, $firebaseSimpleLogin) {
    var ref = new Firebase(FBURL + '/messages');
    var authClient = $firebaseSimpleLogin(ref);

    var sync = $firebase(ref);

    $scope.messages = sync.$asArray();
    $scope.addMessage = function(text) {
      $scope.messages.$add({text: text});
    };

    $scope.loginWithGoogle = function() {
        authClient.$login('google').then(function(user) {
        console.log("Logged in as: " + user.uid);
      }, function(error) {
        console.error("Login failed: " + error);
      });
    };

    // Monitor User Authentication State
    ref.onAuth(function(authData) {
      if (authData) {
        // user authenticated with Firebase
        console.log("User ID: " + authData.uid + ", Provider: " + authData.provider);
      } else {
        // user is logged out
        console.log('user logged out');
      }
    });

    // var syncObject = sync.$asObject();
    // syncObject.$bindTo($scope, 'data');

    // ref.set({
    //   title: 'Hello World!',
    //   author: 'Firebase',
    //   location: {
    //     city: 'San Francisco',
    //     state: 'California',
    //     zip: 94103
    //   }
    // });

    // ref.child('location/city').on('value', function(snapshot) {
    //   alert(snapshot.val());  // Alerts 'San Francisco'
    // });
  });

})();
