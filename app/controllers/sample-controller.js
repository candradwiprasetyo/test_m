(function() {
'use strict';

	angular
		.module('app')
		.controller('SampleController', SampleController);

	SampleController.$inject = ['CiayoService','$state','cardFactory'];
	function SampleController(CiayoService, $state,cardFactory) {
		var vm = this;
		angular.extend(vm,{
			js_timeline:[]
			
		});
	}
})();