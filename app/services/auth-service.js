(function() {
'use strict';

	angular
		.module('app')
		.factory('AuthService', AuthService);

	AuthService.$inject = ['$http', '$cookieStore', '$rootScope', 'CiayoService','welcomeConnector', '$q'];
	function AuthService($http, $cookieStore, $rootScope, CiayoService, welcomeConnector, $q) {
		var service = {
			Register:Register,
			Login:Login,
			ForgotPassword:ForgotPassword,
			Logout:Logout,
			IsAuth:IsAuth,
			finishProfile:finishProfile
		};
		
		return service;

		////////////////
		
		// Fungsi untuk register
		function Register(type, email, phone, pass, info, ref) {
			return welcomeConnector.register(type, email, phone, pass, info, ref).then(
				function(data){
					return data;
				}
			);
			// CiayoService.Api('register', c, function(response) {
			// 	var response = response.data.c;
			// 	// cek error yah
			// 	if(!response.data.error){
			// 		setAuth(response.token, response.data.content.user_id, '', '');
			// 		callback(response.data);
			// 	} else {
			// 		callback(response.data);
			// 	}
			// });
		}
		
		// Fungsi untuk login
		function Login(type, email, phone, pass) {
			return welcomeConnector.login(type, email, phone, pass).then(
				function(data){
					if(data.content){
						$cookieStore.put('gender', data.content.gender);
						$cookieStore.put('profile', data.content.profile_completed);
					}
					return data;
				}
			);
			// Send Req
			// CiayoService.Api('login', c, function(response) {
			// 	if(response.data) {
			// 		var response = response.data.c;
			// 		// cek error dulu disini
			// 		if(!response.data.error){
			// 			//console.log(response);
			// 			setAuth(response.token, response.data.content.user_id, response.data.content.gender, response.data.content.profile_completed);
			// 			callback(response.data);
			// 		} else {
			// 			callback(response.data);
			// 		}
			// 	} else {
			// 		callback(response);
			// 	}
			// });
		}

		function ForgotPassword(type, email, phone) {
			return welcomeConnector.forgotPassword(type, email, phone).then(
				function(data){
					return data;
				}
			);
		}
		
		// Fungsi untuk logout dan hapus cookie user
		function Logout() {
			var c = {
				data: ''
			};
			CiayoService.Api('logout', c, function(response) {
				var response = response.data.c;
				console.log(response);
			});
		}
		
		function finishProfile(){
			$cookieStore.put('profile', true);
		}
		// Fungsi untuk mengecek apakah user tsb sudah login apa belum
		function IsAuth() {
			if($cookieStore.get('token')){
				return true;
			} else {
				
			}
			return false;
		}
	}
	
})();