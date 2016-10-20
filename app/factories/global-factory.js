(function () {
	'use strict';

	angular
		.module('app')
		.factory('globalFactory', globalFactory);
	globalFactory.$inject = ['$rootScope', 'CiayoService', 'listService'];

	function globalFactory($rootScope, CiayoService, listService) {
		//achievement, card detail, modal
		var factory = {
			data:null,
			init:init
		};

		function init(){
			console.log('Global sukses');
		}
		
		return factory;
	}
})();