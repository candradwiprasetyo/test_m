(function () {
	'use strict';
	angular
		.module('app')
		.controller('TrendingActivityController', TrendingActivityController);
		
	TrendingActivityController.$inject = ['CiayoService','modalFactory','trendingActivityFactory', '$scope'];
	function TrendingActivityController(CiayoService,modalFactory,trendingActivityFactory, $scope) {
		var vm = this;
		angular.extend(vm,{
			trending_activity:trendingActivityFactory
		});

		function init(){
			vm.trending_activity.getTrendingActivityList(true);
		}

		init();
	}
})();