(function () {
	'use strict';
	angular
		.module('app')
		.controller('ProfileConnectionController', ProfileConnectionController);
		
	ProfileConnectionController.$inject = ['CiayoService','modalFactory','profileConnectionFactory', '$scope', '$stateParams'];
	function ProfileConnectionController(CiayoService,modalFactory,profileConnectionFactory, $scope, $stateParams) {
		var vm = this;
		angular.extend(vm,{
			search:profileConnectionFactory
		});
		init();
		function init(){
			vm.search.user_list=[];
			vm.search.mutual_list=[];
			vm.search.count_friend_list = '';
			vm.search.count_mutual_list = '';

			vm.search.type='user';
			vm.search.get_profile();

		}
	}
})();