"use strict";
define(["services", "../require/route-config"], function(app, routeConfig) {
    return app.config(function($routeProvider, $httpProvider) {

        $routeProvider
        .when('/', 
            routeConfig.config(
                'views/userLandingPage.html',
                '../../appResources/controller/userLandingPageController'
        ));

        $routeProvider
        .when('/searchresult', 
            routeConfig.config(
                'views/userSearchResultPage.html',
                '../../appResources/controller/UserIndexController'
        ));
        
        //Will use it later.
        //Will know how. 
        //$httpProvider.interceptors.push("customHttpInterceptor");
        return app;
    });
});