+function(){
	"use strict";
	angular
		.module("CiayoDrawer", [])
		.directive("cDrawer", cDrawer	)
	;
	cDrawer.$inject=['drawerFactory']
	function cDrawer(drawerFactory){
		return {
			restrict: "E",
			replace:true,
			templateUrl: DIRECTIVES_VIEW+'drawer_template.html',
			controller:cDrawerCtrl,
			controllerAs:'vm'
		}
	}
	cDrawerCtrl.$inject=['$scope','drawerFactory'];
	function cDrawerCtrl($scope,drawerFactory){
		var vm = this;
		
		angular.extend(vm,{
			drawer:drawerFactory
		});
		$scope.$on('drawer.open', function(event, args) {
			vm.drawer.setState(true);
		});
		
	}
	
}();