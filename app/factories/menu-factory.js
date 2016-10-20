(function () {
	'use strict';

	angular
		.module('app')
		.factory('menuFactory', menuFactory);
	menuFactory.$inject = ['$rootScope','modalFactory', 'CiayoService', '$state'];

	function menuFactory($rootScope,modalFactory, CiayoService, $state) {
		var factory = {
			userBasicInfo:userBasicInfo
		};

		function userBasicInfo() {
			
			var c = {
				data : {
					username:''
				}
			};
			CiayoService.Api('users/info', c, function(response) {
				var ok = false;
				var data = null;
				if(response.status==200) {
					data = response.data.c.data;
					
					if(data.error == false) {
						ok = true;
					}
				}
				if(ok) {
					
					factory.menu_avatar = data.content.users_avatar.avatar_crop;
					factory.menu_background_avatar = data.content.users_avatar.background_avatar;		

					//console.log(factory.menu_avatar);
				} else {

				}
			});
			
		}
		

		return factory;
	}
})();