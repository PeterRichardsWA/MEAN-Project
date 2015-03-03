// build module. myApp should be same for all references.
var myApp = angular.module('SportsApp', ['ngRoute', 'myApp.controllers']);
        
 //  use the config method to set up routing:
 // will routes fire on reload? we still have to reload user data if refresh hit
 // because it will be lost.  session only stores a unique id that is in the database for that user with a time
 // stamp that will keep them from handing out user id. time out the unique id.

myApp.config(function ($routeProvider, $locationProvider) {
  $routeProvider

    .when('/',{
        redirectTo: '/'
    })

    .when('/loginuser',{
        templateUrl: '/partials/login.ejs',
        controller: 'loginController'
    })

    .when('/registeruser',{
        templateUrl: '/partials/register.ejs',
        controller: 'registerController'
    })

    .otherwise({
        redirectTo: '/'
    });

    locationProvider.html5Mode(true);
});
//

// a factory is nothing more than a function that returns an object literal
myApp.factory('loginFactory', ['$http', function ($http) {

    // do we need a factory for login?? maybe for registration for checking live dupes
    var factory = {};

    factory.saveLogin = function($params) {
        return $http({
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            url: '/login', // this may or may not cause issue depending on who's handling routes.
            method: 'POST',
            data: $params
        })
        .success(function(data) {
            // all good.
        })
        .failure(function(err) {
            redirectTo('/errors/1'); // pass code for error
        })
    }

    factory.loginUser = function(loginData) {
        $params = $.param({
            'email': login.email,
            'password': login.password });
        loginFactory.saveLogin($params);
    }
	// most important step: return the object so it can be used by the rest of our angular code
	//console.log(factory);
	return factory;
}]);

// **********************************************************************

//  Controller for chat
myApp.controller('loginController', ['$scope', 'loginFactory', function($scope, loginFactory) {

	$scope.user = []; // make sure customers blank

	$scope.loginUser = function() { // add new customer to list
        $scope.login.email;
		$scope.login.password;
        loginFactory.loginUser($scope);
	}

}]);

