"use strict";

require.config({
	baseUrl: "extResources/require",
	paths: {
		angular: "../../extResources/angular/angular.min",
        angular_animate: "../../extResources/angular/angular-animate.min",
		ngRoute: "../../extResources/angular/angular-route.min",
		ui_bootstrap: "../../extResources/angular/ui-bootstrap.min",
		ngTouch: "../../extResources/angular/angular-touch.min",
		services: "../../appResources/services/services",
		directives: "../../appResources/directives/directives",
		application: "../../appResources/application/application",
		topController: "../../appResources/TopController"
	},

	shim: {
		"angular": {
			"exports": "angular"
			}
		},
	priority: ["angular"]
});

require(["angular", "angular_animate", "ngRoute", "ui_bootstrap", "ngTouch", "services", "application", "directives", "topController"], function(angular) {
    angular.element(document).ready(function() {
        angular.bootstrap(document, ["petooRam"]);
    });
});
