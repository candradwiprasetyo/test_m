+function(){
	"use strict";
	angular
		.module("CiayoModal", [])
		.directive("cModal", cModal)
	;
	function cModal(){
		return {
			restrict: "E",
			replace:true,
			templateUrl: DIRECTIVES_VIEW+'modal-template.html',
			controller:cModalCtrl,
			controllerAs:'mdl'
		}
	}
	cModalCtrl.$inject=['$scope','modalFactory'];
	function cModalCtrl($scope,modalFactory){
		var mdl = this;
		
		angular.extend(mdl,{
			modal:modalFactory
		});
		$scope.$on('modal.open', function(event, args) {
			mdl.modal.setState(true);
		});
		
	}
}();