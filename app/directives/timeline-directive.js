+function(){
	"use strict";
	angular
		.module("CiayoTimeline", [])
		.directive("cTimeline", cTimeline)
	;
	function cTimeline(){
		return {
			restrict: "E",
			scope: {'type':'='},
			replace:true,
			templateUrl: DIRECTIVES_VIEW+'timeline.html',
			controller:'TimelineController',
			controllerAs:'vm'
		}
	}
}();