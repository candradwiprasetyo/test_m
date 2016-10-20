(function() {
'use strict';

	angular
		.module('app')
		.controller('DetailPageController', DetailPageController);

	DetailPageController.$inject = ['CiayoService','$cookieStore','detailPageFactory'];
	function DetailPageController(CiayoService, $cookieStore,detailPageFactory) {
		var vm = this;
		angular.extend(vm,{
			detailPageFactory:detailPageFactory
		});
		function init(){
			detailPageFactory.init();
		}
		init();
	}
})();