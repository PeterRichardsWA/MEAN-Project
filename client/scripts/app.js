// 
//
// SPORTS MODULE FOR UNREGISTERED OR NON-LOGGED IN USERS
//
var myApp = angular.module('SportsApp', ['ngRoute','ngResource'])
    .config( function($routeProvider, $locationProvider, $httpProvider) { // checks to see if user still connected for security
        var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
            // Initialize a new promise
            var deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            $http.get('/loggedin')
                .success( function(user) { // url to provider that returns our user data.
                    // Authenticated? yes!
                    if (user !== '0') {
                        /*$timeout(deferred.resolve, 0);*/
                        deferred.resolve();

                    } else { // Not Authenticated
                        $rootScope.message = 'You need to log in.';
                        //$timeout(function(){deferred.reject();}, 0);
                        deferred.reject();
                        $location.url('/login');
                    
                    }
                });
            return deferred.promise;
        };
    });
    
    // **************************
    // REMEMBER - ALL CONSOLE.LOGS show on the client only in this app.js file
    //***************************

    //  use the config method to set up routing:
    // will routes fire on reload? we still have to reload user data if refresh hit
    // because it will be lost.  session only stores a unique id that is in the database for that user with a time
    // stamp that will keep them from handing out user id. time out the unique id.


myApp.config(function ($routeProvider) {
    $routeProvider
    
    .when('/',{
        templateUrl: '/partials/login.html',
    })

    .when('/login',{
        templateUrl: '/partials/login.html',
    })

    .otherwise({
        templateUrl: '/partials/login.html'
    });
});
//

// **** $digest to update $scope

//
// Catch AJAX errors
// $httpProvider.interceptors.push(function($q, $location) {
//   return {
//     response: function(response) {
//       // do something on success
//       return response;
//     },
//     responseError: function(response) {
//       if (response.status === 401)
//         $location.url('/login');
//       return $q.reject(response);
//     }
//   };
// });

//
// CONTROLLERS
// **********************************************************************
//
// CONT - login
//
myApp.controller('loginController', function($scope, $rootScope, $http, $location) {

	$scope.user = {}; // make sure customers blank

	$scope.loginUser = function() { // add new customer to list
        
        $http.post('/login', {
            email: $scope.login.email,
            password: $scope.login.password,
            confirm: $scope.login.confirm,
            firstname: $scope.login.firstname,
            lastname: $scope.login.lastname,
            usertype: $scope.login.usertype
        })
        .success(function(user) {
            $rootScope.message = 'Auth successful';
            this.parent.get('/sports'); // we need get so the server will put in correct view.
            // $location.url('/users');   // this does angular redirect.
        })
        .error(function() {
            $location.url('/'); //back to login page.
        });
	}
});
