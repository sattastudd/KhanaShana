define([], function() {
    function userRestaurantHomeController($scope) {
    }
    return userRestaurantHomeController;
});

function userRestaurantController ($scope){
	console.log("inside restaurant home page");

	$scope.category = [{name:'Starters', dish:[{name:"Samosa", price:'20'},{name:"Soup", price:'100'}]},
						{name:'Main Course', dish:[{name:"butter Paneer", price:'110'},{name:"Kadhai Paneer", price:'130'}]},
						{name:'Pizza', dish:[{name:"butter Paneer", price:'110'},{name:"Kadhai Paneer", price:'130'}]},
						{name:'Starters', dish:[{name:"Samosa", price:'20'},{name:"Soup", price:'100'}]},
						{name:'Main Course', dish:[{name:"butter Paneer", price:'110'},{name:"Kadhai Paneer", price:'130'}]},
						{name:'Pizza', dish:[{name:"butter Paneer", price:'110'},{name:"Kadhai Paneer", price:'130'}]},
						{name:'Starters', dish:[{name:"Samosa", price:'20'},{name:"Soup", price:'100'}]},
						{name:'Main Course', dish:[{name:"butter Paneer", price:'110'},{name:"Kadhai Paneer", price:'130'}]},
						{name:'Pizza', dish:[{name:"butter Paneer", price:'110'},{name:"Kadhai Paneer", price:'130'}]},
						{name:'Starters', dish:[{name:"Samosa", price:'20'},{name:"Soup", price:'100'}]},
						{name:'Main Course', dish:[{name:"butter Paneer", price:'110'},{name:"Kadhai Paneer", price:'130'}]},
						{name:'Pizza', dish:[{name:"butter Paneer", price:'110'},{name:"Kadhai Paneer", price:'130'}]}
					  ];

	$scope.showDish = true;
	$scope.menuActive = false;
	$scope.menuListClicked = function(index){
		var current = $scope.category[index];
        var status = current.showDish;

         for(var i=0; i<$scope.category.length; i++){
            
            var obj = $scope.category[i];
            obj.showDish = true;
        }
        current.showDish = !status;
	}

}