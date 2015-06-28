"use strict";
define(["services", "../require/route-config"], function (app, routeConfig) {
    return app.config(function ($routeProvider, $httpProvider) {

        $routeProvider
            .when('/login',
            routeConfig.config(
                'views/login/login.html',
                '../../appResources/controller/login/loginController'
            ))

            .when( '/dashboard',
            routeConfig.config(
                'views/dashboard/dashboard.html',
                '../../appResources/controller/dashboard/dashboardController'
            ))

            .when( '/restaurant/my',
            routeConfig.config(
                'views/restaurant/editRestaurant.html',
                '../../appResources/controller/restaurant/restaurantEditController'
            ))

            .when( '/restaurant/additional',
            routeConfig.config(
                'views/restaurant/restaurantDetails.html',
                '../../appResources/controller/restaurant/restaurantDetailsController'
            ))

            /*.otherwise({
                redirectTo: '/login'
            });*/

        //Will use it later.
        //Will know how. 
        $httpProvider.interceptors.push("authInterceptor");

        return app;
    });
});