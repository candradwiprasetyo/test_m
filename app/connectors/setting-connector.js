(function () {
	'use strict';

	angular
		.module('app')
		.factory('settingConnector', settingConnector);
	settingConnector.$inject = ['CiayoService', '$q', 'modalFactory'];

	function settingConnector(CiayoService, $q, modalFactory) {
		var factory = {
			userInfo:userInfo,
			verifyAccount:verifyAccount,
			sendVerifyEmail:sendVerifyEmail,
			sendVerifyPhone:sendVerifyPhone,
			editEmail:editEmail,
			editPhone:editPhone,
			setPreference:setPreference,
			generalSettings:generalSettings,
			listPrefixPhone:listPrefixPhone,
			userDeactive:userDeactive,
			deleteConfirm:deleteConfirm,
			userDelete:userDelete,
			changePassword:changePassword,
			logout:logout
		}

		return factory;

		function userInfo(username) {
			var data = {username:username}
			return CiayoService.get('users/info', data).then(function(data) {
				if(data.error == true){
					modalFactory.message(data.message);
				}
				return data;
			});
		}

		function verifyAccount(confirmation_code) {
			var data = {confirmation_code:confirmation_code}
			return CiayoService.get('settings/verify', data).then(function(data) {
				if(data.error == true) {
					modalFactory.message(data.message);
				}
				return data;
			});
		}

		function sendVerifyEmail(email) {
			var data = {email:email} 
			return CiayoService.get('settings/sendingverify/email', data).then(function(data) {
				if(data.error == true) {
					modalFactory.message(data.message);
				}
				return data;
			});
		}

		function sendVerifyPhone(phone_number) {
			var data = {phone_number:phone_number}
			return CiayoService.get('settings/sendingverify/phone', data).then(function(data) {
				if(data.error == true) {
					modalFactory.message(data.message);
				}
				return data;
			});
		}

		function editEmail(email) {
			var data = {email:email}
			return CiayoService.get('settings/email', data).then(function(data) {
				if(data.error == true) {
					modalFactory.message(data.message);
				}
				return data;
			});
		}


		function editPhone(phone_number) {
			var data = {phone_number:phone_number}
			return CiayoService.get('settings/phone', data).then(function(data) {
				if(data.error == true) {
					modalFactory.message(data.message);
				}
				return data;
			});
			return deferred.promise;
		}

		function setPreference(value, type) {
			var value = value?1:0;
			var data = {value:value,type:type}
			return CiayoService.get('settings/preference', data).then(function(data) {
				if(data.error == true) {
					modalFactory.message(data.message);
				}
				return data;
			});
		}

		function generalSettings() {
			var data = {}
			return CiayoService.get('settings', data).then(function(data) {
				if(data.error == true) {
					modalFactory.message(data.message);
				}
				return data;
			});
		}

		function listPrefixPhone(limit, offset) {
			var data = {limit:limit, offset:offset}
			return CiayoService.get('users/setting/prefix_phone_number', data).then(function(data) {
				if(data.error == true) {
					modalFactory.message(data.message);
				}
				return data;
			});
		}

		function userDeactive() {
			var data = {deactive:true}
			return CiayoService.get('settings/deactive', data).then(function(data) {
				if(data.error == true) {
					modalFactory.message(data.message);
				}
				return data;
			});
		}

		function deleteConfirm() {
			var data = {}
			return CiayoService.get('settings/deleteconfirm', data).then(function(data) {
				if(data.error == true) {
					modalFactory.message(data.message);
				}
				return data;
			});
		}

		function userDelete(token) {
			var data = {token:token}
			return CiayoService.get('settings/delete', data).then(function(data) {
				if(data.error == true) {
					modalFactory.message(data.message);
				}
				return data;
			});
		}

		function changePassword(old_password, new_password, confirm_new_password) {
			var data = {old_password:old_password, new_password:new_password, confirm_new_password:confirm_new_password}
			return CiayoService.get('settings/password', data).then(function(data) {
				if(data.error == true) {
					modalFactory.message(data.message);
				}
				return data;
			});
		}

		function logout() {
			var data = {}
			return CiayoService.get('logout', data).then(function(data) {
				if(data.error == true) {
					modalFactory.message(data.message);
				}
				return data;
			});
		}
	}
})();