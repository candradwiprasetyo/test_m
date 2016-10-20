(function () {
	'use strict';

	angular
		.module('app')
		.factory('drawerFactory', drawerFactory);
	drawerFactory.$inject = ['$rootScope', 'CiayoService'];

	function drawerFactory($rootScope, CiayoService) {
		
		var factory = {
			drawer_class:'',
			isOpen:'',
			template:'',
			title:'',
			data:null,
			setState:setState
		};
		function setState(value){
			if(value){
				factory.isOpen='-open';
				$(".cm").addClass("-locked");
			}else{
				$(".cm").removeClass("-locked")
				factory.isOpen='';
				factory.template='';
				factory.title='';
				factory.data=null;
				factory.drawer_class='';
			}
		}
		return factory;
	}
})();