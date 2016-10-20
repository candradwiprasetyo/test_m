(function () {
	'use strict';
	angular
		.module('app')
		.controller('FriendRequestAllController', FriendRequestAllController);
		
	FriendRequestAllController.$inject = ['CiayoService','modalFactory','friendRequestAllFactory', '$scope'];
	function FriendRequestAllController(CiayoService,modalFactory,friendRequestAllFactory, $scope) {
		var vm = this;
		angular.extend(vm,{
			fr:friendRequestAllFactory
		});

		function init(){
			vm.fr.init();
			vm.fr.getFrList(true);
			vm.fr.fr_start = false;
			vm.fr.load_more = false;
		}

		init();
	}
})();