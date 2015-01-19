define([], function(){
	function TopController($scope){
	}
	return TopController;
});

function parentController($scope, DataStore, AppConstants){
	console.log('Hi. I am parentController');

	$scope.appName = AppConstants.appName;
}