(function() {
'use strict';

	angular
		.module('app')
		.factory('ProfileService', ProfileService);

	ProfileService.$inject = ['$http', '$cookieStore', '$rootScope', 'CiayoService'];
	function ProfileService($http, $cookieStore, $rootScope, CiayoService) {
		var service = {
			requestFollow:requestFollow,
			searchUser:searchUser,
		};
		
		return service;
		//http://192.168.35.56:8000/login
		//{"data":{"email":"miftarockavanka@gmail.com","password":"superadmi","latitude":"32","longitude":"32"}}
		// {"data":{"user_id":"1"}}
		function requestFollow(user_id,callback,errCallback){
			var c={
				data:{
					user_id:user_id
				}
			};
			CiayoService.Api('user/info', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		function searchUser(keyword,limit,offset,callback,errCallback){
			var c={
				data:{
					keyword:keyword,
					limit:limit,
					offset:offset
				}
			};
			CiayoService.Api('search/user/name', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		
	}
})();