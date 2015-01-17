globalApp = angular.module('foodApp', ['ngRoute']);

globalApp.config(function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: 'views/userLandingPage.html',
			controller:   'landingPageController'
		})

		.when('/searchresult', {
			templateUrl: 'views/userSearchResultPage.html',
			controller:   'searchResultController'
		})
});

globalApp.controller('landingPageController', function($scope){

	console.log("landing page controller");
	
});

globalApp.controller('searchResultController', function($scope){
	console.log('searc result controller');
});

globalApp.controller('headerController', function(){
	console.log("headerController");	
})

