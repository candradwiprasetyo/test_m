(function() {
'use strict';

	angular
		.module('app')
		.service('AvatarService', AvatarService);

	AvatarService.$inject = ['CiayoService'];
	function AvatarService(CiayoService) {
		this.setGender = setGender;
		this.setName = setName;
		this.setAvatar = setAvatar;
		this.setMascot = setMascot;
		this.getAvatarDefault = getAvatarDefault;
		this.getAvatarInit = getAvatarInit;
		this.getAvatarUser = getAvatarUser;
		this.getMascot = getMascot;
		
		////////////////
		function setGender(gender, callback) {
			var c = {
				data: {
					filter_value: gender
				}
			};
			CiayoService.Api('users/filter/saveGender', c, function(response){
				callback(returnData(response));
			});
		}

		function setName(name, callback) {
			var c = {
				data: {
					screen_name: name
				}
			}
			CiayoService.Api('users/screen/name', c, function(response){
				callback(returnData(response));
			});
		}

		function setAvatar(bg, ava, callback) {
			CiayoService.Api(AVATAR_API_SERVER+'users/background', bg, function(response){
				if(response.status == 200){
					if(!response.data.c.data.error){
						CiayoService.Api(AVATAR_API_SERVER+'users/filter/update', ava, function(response){
							callback(returnData(response));
						}, true);
					} else {
							var data = {
								error: true,
								message: response.data.c.data.message
							};
					}
				} else {
					var data = {
						error: true,
						error_code: response.status,
						message: response.statusText
					};
					callback(data);
				}
			}, true);
		}

		function setMascot(id, callback) {
			var c = {
				data: {
					media_id_mascot: id
				}
			};
			CiayoService.Api('users/mascot', c, function(response){
				callback(returnData(response));
			});
		}

		function getAvatarInit(gender, callback) {
			var c = {
				data: {
					user_gender: gender
				}
			};
			CiayoService.Api(AVATAR_API_SERVER+'avatar/init', c, function(response){
				callback(returnData(response));
			}, true);
		}

		function getAvatarDefault(gender, callback) {
			var c = {
				data: {
					user_gender: gender
				}
			};
			CiayoService.Api(AVATAR_API_SERVER+'avatar/defaultAvatars', c, function(response){
				callback(returnData(response));
			}, true);
		}

		function getAvatarUser(callback) {
			var c = {
				data: {
					avatar_type: 'avatar_3'
				}
			};
			CiayoService.Api(AVATAR_API_SERVER+'users/download/avatar', c, function(response){
				callback(returnData(response));
			}, true);
		}

		function getMascot(callback) {
			var c = {
				data: ''
			};
			CiayoService.Api('mascot', c, function(response){
				callback(returnData(response));
			});
		}

		function returnData(response) {
			if(response.status == 200) {
				var data = response.data.c.data;
			} else {
				var data = {
					error: true,
					error_code: response.status,
					message: response.statusText
				};
			}
			return data;
		}
	}
})();