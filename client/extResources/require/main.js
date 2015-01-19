"use strict";

require.config({
	baseUrl: "extResources/require",
	paths: {
		angular: "../../extResources/angular/angular.min",
		ngRoute: "../../extResources/angular/angular-route.min",
		ui_bootstrap: "../../extResources/angular/ui-bootstrap.min",
		ngResource: "../../extResources/angular/angular-resource.min",
		services: "../../appResources/services/services",
		directives: "../../appResources/directives/directives",
		application: "../../appResources/application/application",
	},

	shim: {
		"angular": {
			"exports": "angular"
			}
		},
	priority: ["angular"]
});

require(["angular", "ngRoute", "ui_bootstrap", "ngResource", "services", "application", "directives"], function(angular) {
    angular.element(document).ready(function() {
        angular.bootstrap(document, ["khanaShanaApp"]);
    });
});
