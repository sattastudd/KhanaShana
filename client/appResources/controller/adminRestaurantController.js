define([], function() {
    function adminRestaurantController($scope) {
    }
    return adminRestaurantController;
});

function restaurantController($scope){

	console.log("admin screen");

	$scope.restaurant = {};

    $scope.restaurant.menu = [];
    
    $scope.addNewDish = function(detail, category){
        console.log(category);
        category.detail.push({
            dish: detail.addDish,
            price: detail.addPrice,
        })
        detail.addDish = null;
        detail.addPrice = null;
        $scope.showSubmitButton = true;
    }
    $scope.addNewCategory = function(){
        $scope.restaurant.menu.push({
            categoryName: $scope.addCategory,
            detail: []
        })
        //$scope.editCategory(category);
        $scope.addCategory = null;
        $scope.showSubmitButton = true;
    }
    
    $scope.editDish = function(detail){
        console.log(detail)
        detail.editActive = true;
        $scope.showSubmitButton = true;
    }

    $scope.deleteDish = function(detail, category, index){
    	console.log("inside delete");
    	$scope.showSubmitButton = true;
    	category.detail.splice(index, 1);
    }
    
    $scope.editButtonActive = function(detail){
        detail.editActive = false;
    }

    $scope.submitDetail = function(){
    	console.log("inside submit detail");
    }

    $scope.submitMenu = function(){
    	console.log($scope.restaurant.menu);
    }

    $scope.deleteCategory = function(index){
    	$scope.restaurant.menu.splice(index, 1);
    }

    $scope.editCategory = function(category){
    	$scope.editCategoryActive = true;
    }
    $scope.editCategoryDone = function(category){
    	$scope.editCategoryActive = false;
    }
}