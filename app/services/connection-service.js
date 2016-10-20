(function() {
'use strict';

	angular
		.module('app')
		.factory('ConnectionService', ConnectionService);

	ConnectionService.$inject = ['$http', '$cookieStore', '$rootScope', 'CiayoService'];
	function ConnectionService($http, $cookieStore, $rootScope, CiayoService) {
		var service = {
			requestFollow:requestFollow,
			requestCreate:requestCreate,
			requestLoad:requestLoad,
			requestConfirm:requestConfirm,
			requestDelete:requestDelete,
			userBlock:userBlock,
			userUnblock:userUnblock,
			blocklist:blocklist,
		};
		
		return service;
		
		function requestFollow(user_id,follow,callback,errCallback){
			var c={
				data:{
					user_id:user_id,
					follow:follow
				}
			};
			CiayoService.Api('users/follow', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		
		function requestCreate(friend_id,category_id,callback,errCallback){
			var c={
				data:{
					friend_id:friend_id,
					category_id:category_id
				}
			};
			CiayoService.Api('users/relation/create', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		function requestLoad(limit,offset,callback,errCallback){
			var c={
				data:{
					limit:limit,
					offset:offset
				}
			};
			CiayoService.Api('users/relation', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		function requestConfirm(user_relation_id,callback,errCallback){
			var c={
				data:{
					"user_relation_id": user_relation_id,
				}
			};
			CiayoService.Api('users/relation/confirm', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		function requestDelete(friend_id,callback,errCallback){
			var c={
				data:{
					"friend_id": friend_id,
				}
			};
			CiayoService.Api('users/relation/reject', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		
		function userBlock(user_id,callback,errCallback){
			var c={
				data:{
					"user_id": user_id,
				}
			};
			CiayoService.Api('users/block', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		function userUnblock(user_id,callback,errCallback){
			var c={
				data:{
					"user_id": user_id,
				}
			};
			CiayoService.Api('users/unblock', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		
		function blocklist(callback,errCallback){
			var c={
				data:{ }
			};
			CiayoService.Api('users/block/list', c, function(response) {
				if(response.status==200){
					callback(response);
				} else {
					errCallback(response);
				}
			});
		}
		
	}
})();