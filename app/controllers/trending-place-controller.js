(function () {
	'use strict';
	angular
		.module('app')
		.controller('TrendingPlaceController', TrendingPlaceController);
		
	TrendingPlaceController.$inject = ['CiayoService','modalFactory','trendingPlaceFactory', '$scope'];
	function TrendingPlaceController(CiayoService,modalFactory,trendingPlaceFactory, $scope) {
		var vm = this;
		angular.extend(vm,{
			trending_place:trendingPlaceFactory
		});

		function init(){
			vm.trending_place.getTrendingPlaceList(true);
		}

		init();
	}
})();