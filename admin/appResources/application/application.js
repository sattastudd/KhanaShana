"use strict";
define(["services", "../require/route-config"], function(app, routeConfig) {
    return app.config(function($routeProvider, $httpProvider) {

        $routeProvider
        .when('/login',
            routeConfig.config(
                'views/login/login.html',
                '../../appResources/controller/login/loginController'
        ))

        .otherwise({
            redirectTo : '/login'
        });
        //Will use it later.
        //Will know how. 
        $httpProvider.interceptors.push("authInterceptor");

        return app;
    });
});