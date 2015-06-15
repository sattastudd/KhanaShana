"use strict";
define(["services", "../require/route-config"], function (app, routeConfig) {
    return app.config(function ($routeProvider, $httpProvider) {

        $routeProvider
            .when('/login',
            routeConfig.config(
                'views/login/login.html',
                '../../appResources/controller/login/loginController'
            ))
            .when('/dashboard',
            routeConfig.config(
                'views/dashboard/dashboard.html',
                '../../appResources/controller/dashboard/dashboardController'
            ))

            .when('/users',
            routeConfig.config(
                'views/users/userList.html',
                '../../appResources/controller/users/userListController'
            ))

            .when('/newUser',
            routeConfig.config(
                'views/users/createEditUser.html',
                '../../appResources/controller/users/createOrEditUserController'
            ))

            .when( '/restaurants/approved',
            routeConfig.config(
                'views/restaurants/approvedRestaurantList.html',
                '../../appResources/controller/restaurants/approvedRestaurantListController'
            ))

            .when( '/restaurants/pendingApproval',
            routeConfig.config(
                'views/restaurants/pendingApprovalRestaurantList.html',
                '../../appResources/controller/restaurants/pendingApprovalRestaurantListController'
            ))

            .when( '/restaurants/pendingDetails',
            routeConfig.config(
                'views/restaurants/pendingDetailsRestaurantList.html',
                '../../appResources/controller/restaurants/pendingDetailsRestaurantListController'
            ))

            .when( '/restaurants/new',
            routeConfig.config(
                'views/restaurants/addNewRestaurant.html',
                '../../appResources/controller/restaurants/newRestaurantController'
            ))

            .when( '/restaurants/approve',
            routeConfig.config(
                'views/restaurants/approveRestaurant.html',
                '../../appResources/controller/restaurants/restaurantApprovalController'
            ))

            .when( '/cuisines/all',
            routeConfig.config(
                'views/cuisines/cuisineList.html',
                '../../appResources/controller/cuisines/cuisineListController'
            ))

            .when( '/locations/all',
            routeConfig.config(
                'views/locations/locationList.html',
                '../../appResources/controller/locations/locationListController'
            ))

            .when( '/locations/new',
            routeConfig.config(
                'views/locations/newOrEditLocation.html',
                '../../appResources/controller/locations/newOrEditLocationController'
            ))

            .otherwise({
                redirectTo: '/login'
            });
        //Will use it later.
        //Will know how. 
        $httpProvider.interceptors.push("authInterceptor");

        return app;
    });
});