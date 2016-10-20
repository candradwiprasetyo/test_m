(function () {
	'use strict';
	angular
		.module('app')
		.controller('FriendRequestController', FriendRequestController);
		
	FriendRequestController.$inject = ['CiayoService','modalFactory','friendRequestFactory', '$scope'];
	function FriendRequestController(CiayoService,modalFactory,friendRequestFactory, $scope) {
		var vm = this;
		angular.extend(vm,{
			fr:friendRequestFactory
		});

		function init(){
			vm.fr.getFrList(true);
			vm.fr.fr_start = false;
			vm.fr.load_more = false;
			vm.fr.countFr=0;
		}

		init();
	}
})();