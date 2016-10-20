(function () {
	'use strict';
	angular
		.module('app')
		.controller('TrendingPeopleController', TrendingPeopleController);
		
	TrendingPeopleController.$inject = ['CiayoService','modalFactory','trendingPeopleFactory', '$scope'];
	function TrendingPeopleController(CiayoService,modalFactory,trendingPeopleFactory, $scope) {
		var vm = this;
		angular.extend(vm,{
			search:trendingPeopleFactory
		});

		function init(){
			vm.search.type='trending';
			vm.search.getTrendingPeopleList();
		}

		init();
	}
})();