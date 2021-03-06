// 
//
// SPORTS MODULE FOR LOGGED IN USERS
//
var myApp = angular.module('SportsApp', ['ngRoute']);

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
         templateUrl: '/partials/view_data.html',
    })

    .when('/enter',{
         templateUrl: '/partials/enter_data.html',
    })

    .when('/manage',{
         templateUrl: '/partials/manage_data.html',
    })

    .when('/profile',{
         templateUrl: '/partials/profile.html.html',
    })

    .otherwise({
        templateUrl: '/partials/view_data.html'
        //redirectTo: '/'
    });
});
//

// **** $digest to update $scope

// a factory is nothing more than a function that returns an object literal
myApp.factory('viewFactory', function($http) {

    var factory = {};

    factory.saveLogin = function($params) {
        console.log('params: ',$params);
        return $http({
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            url: '/login', // this may or may not cause issue depending on who's handling routes.
            method: 'POST',
            data: $params
        })
        .success(function(data) {
            console.log('saved to db');
            // all good.
        })
        .error(function(err) {
             console.log('error saving or logging in');
             redirectTo('/errors/'+err); // pass code for error
        })
        console.log('firing savelogin');
    }

    factory.loginUser = function(loginData) {
        console.log('loginUser', loginData);
        $params = $.param({
            'email': loginData.login.email,
            'password': loginData.login.password,
            'confirm': loginData.login.confirm,
            'firstname': loginData.login.firstname,
            'lastname': loginData.login.lastname,
            'usertype': loginData.login.usertype });
        this.saveLogin($params);
    }
	// most important step: return the object so it can be used by the rest of our angular code
	//console.log(factory);
	return factory;
});

//
//
// CONTROLLERS
// **********************************************************************
//
// CONT - login
//
myApp.controller('viewController', function($scope, viewFactory) {

	$scope.user = []; // make sure customers blank

	$scope.loginUser = function() { // add new customer to list
        console.log($scope.login.email); // making it here.
        $scope.login.email;
        $scope.login.password;
        // check if these exist?
        $scope.login.confirm;
        $scope.login.firstname;
        $scope.login.lastname;
        $scope.login.usertype;
        loginFactory.loginUser($scope);
	}

});
