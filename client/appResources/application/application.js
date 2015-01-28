"use strict";
define(["services", "../require/route-config"], function(app, routeConfig) {
    return app.config(function($routeProvider, $httpProvider) {

        $routeProvider
        .when('/', 
            routeConfig.config(
                'views/userHome.html',
                '../../appResources/controller/userHomeController'
        ))
        .when('/restaurantDetails', 
            routeConfig.config(
                'views/adminRestaurantDetails.html',
                '../../appResources/controller/adminRestaurantController'
        ))
        .when('/login',
            routeConfig.config(
                'views/login.html',
                '../../appResources/controller/LoginController'
        ))
        .when('/adminHome',
            routeConfig.config(
                'views/adminHome.html',
                '../../appResources/controller/adminHomeController'
        ))
        .when('/adminRestaurant',
            routeConfig.config(
                'views/adminRestaurants.html',
                '../../appResources/controller/adminRestHomeController'
        ))
        //Will use it later.
        //Will know how. 
        //$httpProvider.interceptors.push("customHttpInterceptor");
        return app;
    });
});