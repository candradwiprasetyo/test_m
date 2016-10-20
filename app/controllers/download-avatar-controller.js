(function() {
'use strict';

	angular
		.module('app')
		.controller('DownloadAvatarController', DownloadAvatarController);

	DownloadAvatarController.$inject = ['AvatarService','$cookieStore', '$sce'];
	function DownloadAvatarController(AvatarService, $cookieStore, $sce) {
		var vm = this;

		vm.getAvatar = getAvatar();
		vm.urlDownload = '';

		function getAvatar() {
			AvatarService.getAvatarUser(function(data){
				if(data.error){
					alert(data.message);
				} else {
					vm.urlDownload = $sce.trustAsResourceUrl(AVATAR_API_SERVER+'users/avatar');
					vm.showLoading = false;
					vm.avaUserImg = data.content.url;
					vm.avaUserBg = data.content.background_avatar;
					var token = $cookieStore.get('token');
					vm.avaData = '{"data":{"token":"'+token+'"},"timestamp":1468376374025,"app":"Web","screen_type":"Web","image_type":"","latitude":"-6.225652","longitude":"106.74576","language":1}';
				}
			});
		}
	}
})();