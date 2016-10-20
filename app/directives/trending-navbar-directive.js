+function(){
	"use strict";
	angular
		.module("TrendingNavbar", [])
		.directive("cTrendingNavbar", cTrendingNavbar)
	;
	/*
	attr = active  ['timeline','friend-request','notification','search','menu']
	*/
	function cTrendingNavbar(){
		return {
			restrict: "E",
			scope: {},
			replace:true,
			templateUrl: DIRECTIVES_VIEW+'trending-navbar.html',
			link:function(scope, element, attrs, controller, transcludeFn){
				scope.active = attrs.active;
			}
		}
	}
}();