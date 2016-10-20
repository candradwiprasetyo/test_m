(function() {
'use strict';

	angular
		.module('app')
		.factory('navbarFactory', navbarFactory);

	navbarFactory.$inject = ['$http', '$cookieStore', '$rootScope', 'CiayoService', 'socketFactory'];
	function navbarFactory($http, $cookieStore, $rootScope, CiayoService, socketFactory) {
		var service = {
			listNotification:listNotification,
			listFriendRequest:listFriendRequest,
			requestMarkAllNotification:requestMarkAllNotification,
			Socket:Socket
		};
		
		return service;

		function requestMarkAllNotification(callback,errCallback){
			var c={
				data:{	}
			};
			CiayoService.Api('notification/read/all', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		
		function listNotification(type, limit, offset, callback,errCallback){
			var c = {
				data: {
					"type": type,
					"limit": limit,
					"offset": offset,
					"order_by": 'created_at'
				}
			}
			CiayoService.Api('notification', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function listFriendRequest(limit, offset, callback,errCallback){
			var c = {
				data: {
					"limit": limit,
					"offset": offset
				}
			}
			CiayoService.Api('users/relation', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}

		function Socket(){
			if(SOCKET_API_SERVER){
				var ioSocket = io.connect(SOCKET_API_SERVER);
			}else{
				var ioSocket = io.connect('https://apidev.ciayo.com/');
			}
			
			var socket = socketFactory({ioSocket:ioSocket});
			return socket;
		}
		
		
	}
})();