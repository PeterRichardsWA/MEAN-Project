 <script>

    		// build module. myApp should be same for all references.
    		var myApp = angular.module('myApp', []);

    		 // a factory is nothing more than a function that returns an object literal
			myApp.factory('taskFactory', function () {
			   	
                var tasks = [
			        {name: 'Eat Lunch', priority: 'High', deadline: new Date('February 26, 2015'),createdDate: new Date('January 5, 2015')},
                    {name: 'Get Lack Belt', priority: 'High', deadline: new Date('March 6, 2015'),createdDate: new Date('January 5, 2015')},
                    {name: 'Play Volleyball', priority: 'Medium', deadline: new Date('March 1, 2015'),createdDate: new Date('January 5, 2015')}];

			    var factory = {};

			    factory.gettasks = function(callback) {
			        callback(tasks);
	    		}

	    		// most important step: return the object so it can be used by the rest of our angular code
	    		//console.log(factory);
	    		return factory;
	    	});
            //console.log(factory.getStudents);

	    	//  build the controllers
			myApp.controller('tasksController', function($scope, taskFactory) {
			
				$scope.tasks = []; // make sure tasks blank
			
				taskFactory.gettasks(function(data) {
					$scope.tasks = data;
				}); // load current set of tasks

				$scope.addtask = function() { // add new task to list
					var d = new Date();
                    $scope.newtask.createdDate = d.getTime();
                    $scope.taskdate = new Date($scope.taskdate);
                    $scope.tasks.push($scope.newtask);
					$scope.newtask = {};
				}
                $scope.removetask = function(task) {
                    $scope.tasks.splice($scope.tasks.indexOf(task),1);
                }
	    	});

	</script>