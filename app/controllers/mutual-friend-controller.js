(function () {
	'use strict';
	angular
		.module('app')
		.controller('MutualFriendController', MutualFriendController);
		
	MutualFriendController.$inject = ['CiayoService','modalFactory','mutualFriendFactory', '$scope'];
	function MutualFriendController(CiayoService,modalFactory,mutualFriendFactory, $scope) {
		var vm = this;
		angular.extend(vm,{
			mutual:mutualFriendFactory
		});

		function init(){
			vm.mutual.user_id = $stateParams.user_id;
			vm.mutual.username = $stateParams.username;
			vm.mutual.init();
			vm.mutual.getMutualFriendList(true);
		}

		init();
	}
})();