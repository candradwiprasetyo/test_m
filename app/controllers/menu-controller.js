(function () {
	'use strict';
	angular
		.module('app')
		.controller('MenuController', MenuController);
		
	MenuController.$inject = ['CiayoService','modalFactory','menuFactory', '$scope'];
	function MenuController(CiayoService,modalFactory,menuFactory, $scope) {
		var vm = this;
		angular.extend(vm,{
			menu:menuFactory
		});
		init();
		function init(){
			vm.menu.userBasicInfo();
		}
	}
})();