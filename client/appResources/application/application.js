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
        .when('/search',
            routeConfig.config(
                'views/user/userSearchResult.html',
                '../../appResources/controller/userSearchResultController'
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
        .when('/userCheckOut',
            routeConfig.config(
                'views/user/UserCheckOut.html',
                '../../appResources/controller/userCheckOutController'
        ))
        .when('/404',
            routeConfig.config(
                'views/user/error404.html',
                '../../appResources/controller/errorPageController'
        ))
        .when('/restaurant/:restSLug',
            routeConfig.config(
                'views/user/restaurant/restaurantHome.html',
                '../../appResources/controller/user/restaurant/restaurantDetailsController'
        ))
        .when('/changePwd',
            routeConfig.config(
                'views/user/userChangePwd.html',
                '../../appResources/controller/user/userChangePwdController'
        ))
        .otherwise({
            redirectTo: '/404'
        });

        //Will use it later.
        //Will know how. 


        $httpProvider.interceptors.push("authInterceptor");

        return app;
    });
});