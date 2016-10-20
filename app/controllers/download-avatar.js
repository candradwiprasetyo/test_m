(function() {
'use strict';

	angular
		.module('app')
		.controller('DownloadAvatar', DownloadAvatar);

	DownloadAvatar.$inject = ['CiayoService','$state'];
	function DownloadAvatar(CiayoService, $state) {
		var vm = this;
		vm.getAvatar = getAvatar;
		
		function getAvatar(){
			var c = {
				data: {
					avatar_type: 'avatar_3'
				}
			};
			CiayoService.Api('users/avatars', c, function(response){
				console.log(response);
			});
		}
		
		vm.getAvatar();
		
		vm.next = next;
		
		function next() {
			$state.transitionTo('timeline');
		}
	}
})();