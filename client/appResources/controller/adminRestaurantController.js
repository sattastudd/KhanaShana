define([], function() {
    function adminRestaurantController($scope) {
    }
    return adminRestaurantController;
});

function restaurantController($scope){

	console.log("admin screen");

    $scope.menu = [];

    $scope.restDetail = {};
    
    $scope.addNewDish = function(dishDetail, category){
        //console.log(category);
        category.detail.push({
            dish: dishDetail.addDish,
            price: dishDetail.addPrice,
        })
        dishDetail.addDish = null;
        dishDetail.addPrice = null;
        $scope.showSubmitButton = true;
    }
    $scope.addNewCategory = function(){
        $scope.menu.push({
            categoryName: $scope.addCategory,
            detail: []
        })
        //$scope.editCategory(category);
        $scope.addCategory = null;
        $scope.showSubmitButton = true;
    }
    
    $scope.editDish = function(dishDetail){
        console.log(dishDetail)
        dishDetail.editActive = true;
        $scope.showSubmitButton = true;
    }

    $scope.deleteDish = function(dishDetail, category, index){
    	console.log("inside delete");
    	$scope.showSubmitButton = true;
    	category.detail.splice(index, 1);
    }
    
    $scope.editButtonActive = function(dishDetail){
        dishDetail.editActive = false;
    }

    $scope.submitDetail = function(){
    	console.log("inside submit dishDetail");
        console.log($scope.restDetail);
    }

    $scope.submitMenu = function(){
    	console.log($scope.menu);
    }

    $scope.deleteCategory = function(index){
    	$scope.menu.splice(index, 1);
    }

    $scope.editCategory = function(category){
    	$scope.editCategoryActive = true;
    }
    $scope.editCategoryDone = function(category){
    	$scope.editCategoryActive = false;
    }
}