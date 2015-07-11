"use strict";
define(["services", "../require/route-config"], function(app, routeConfig) {
    return app.config(function($routeProvider, $httpProvider) {

        $routeProvider
        .when('/', 
            routeConfig.config(
                'views/user/home.html',
                '../../appResources/controller/homeController'
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
                'views/user/searchResults.html',
                '../../appResources/controller/searchResultsController'
        ))
        .when('/checkOut',
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
                '../../appResources/controller/userChangePwdController'
        ))
        .when('/forgotPassword',
            routeConfig.config(
                'views/user/userForgotPwd.html',
                '../../appResources/controller/userForgotPwdController'
        ))
        .when('/profile',
            routeConfig.config(
                'views/user/userProfile.html',
                '../../appResources/controller/userProfileController'
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