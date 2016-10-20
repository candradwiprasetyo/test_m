(function () {
	'use strict';
	angular
		.module('app')
		.controller('SearchController', SearchController);
		
	SearchController.$inject = ['CiayoService','modalFactory','searchFactory', '$scope'];
	function SearchController(CiayoService,modalFactory,searchFactory, $scope) {
		var vm = this;
		angular.extend(vm,{
			search:searchFactory
		});
		init();
		function init(){
			vm.search.type='user';
		}
	}
})();