(function () {
	'use strict';
	angular
		.module('app')
		.controller('TrendingController', TrendingController);
		
	TrendingController.$inject = ['CiayoService','modalFactory','timelineFactory'];
	function TrendingController(CiayoService,modalFactory,timelineFactory) {
		var vm = this;
		angular.extend(vm,{
			timeline:timelineFactory
		});
		init();
		function init(){
			vm.timeline.type='trending';
			vm.timeline.init();
		}
		
	}
})();