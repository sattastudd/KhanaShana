"use strict";
define(["services", "../require/route-config"], function(app, routeConfig) {
    return app.config(function($routeProvider, $httpProvider) {

        $routeProvider
        .when('/', 
            routeConfig.config(
                'views/user/userHome.html',
                '../../appResources/controller/userHomeController'
        ))
        .when('/restaurantDetails', 
            routeConfig.config(
                'views/admin/adminRestaurantDetails.html',
                '../../appResources/controller/adminRestaurantController'
        ))
        .when('/login',
            routeConfig.config(
                'views/login/login.html',
                '../../appResources/controller/LoginController'
        ))
        .when('/adminHome',
            routeConfig.config(
                'views/admin/adminHome.html',
                '../../appResources/controller/adminHomeController'
        ))
        .when('/adminRestaurant',
            routeConfig.config(
                'views/admin/adminRestaurants.html',
                '../../appResources/controller/adminRestHomeController'
        ))
        .when('/userSearchResult',
            routeConfig.config(
                'views/user/userSearchResult.html',
                '../../appResources/controller/userSearchResultController'
        ))
        .when('/userCheckOut',
            routeConfig.config(
                'views/user/UserCheckOut.html',
                '../../appResources/controller/userCheckOutController'
        ))
        .when('/userRestaurantHome',
            routeConfig.config(
                'views/userRestaurantHome.html',
                '../../appResources/controller/userRestaurantHomeController'
        ))
        //Will use it later.
        //Will know how. 
        //$httpProvider.interceptors.push("customHttpInterceptor");
        return app;
    });
});