(function () {
	'use strict';

	angular
		.module('app')
		.factory('friendConnectionFactory', friendConnectionFactory);
	friendConnectionFactory.$inject = ['$rootScope','modalFactory', 'CiayoService', 'mutualFriendDrawer', 'drawerFactory'];

	function friendConnectionFactory($rootScope, modalFactory,CiayoService, mutualFriendDrawer, drawerFactory) {
		var factory =  function (_user){
			var user = this;
			angular.extend(user,{
				// id:'',
				// username:'',
				// display_name:'',
				// full_name:'',
				showFrame:showFrame,
				closeFrame:closeFrame,
				action_addfriend:action_addfriend,
				cancel_friend_request:cancel_friend_request,
				action_response:action_response,
				closeActionResponse:closeActionResponse,
				action_response_accept:action_response_accept,
				action_response_delete:action_response_delete,
				action_follow:action_follow,
				action_unfollow:action_unfollow,
				getMutualFriend:getMutualFriend,
				setState:setState

			});
			init();
			function init(){
				// vm.id = user.user_id ||'';
				// vm.username = user.username || '';
				// vm.full_name = user.full_name || '';
				// vm.display_name = user.display_name || '';
				angular.extend(user,_user);
			}

			function setState(){
				drawerFactory.setState();
			}

			function showFrame(){
				$rootScope.$broadcast(
				"cButton",{})
				user.frame = true;
			}
			$rootScope.$on('cButton',function(){
				user.frame=false;
			})
			function closeFrame(){
				user.frame = false;
			}

			// add friend
			function action_addfriend(user){
				//alert(user_id+'_'+id);
				var user_id = user.user_id;
				//console.log(user_id);
				
				var ok = false;
				var c = {
					data: {
						"friend_id": user_id
					}
				}

				CiayoService.Api('users/relation/create', c, function(response) {
					if(response.status==200){
						var data = response.data.c.data;

						if (data.error == false) {
							ok = true;
						}
					}
					if(ok){
						console.log(response);
						user.icon_addfriend = false;
						user.name_addfriend = false;
						user.ci_check = true;

						user.icon_follow = false;
						user.name_follow = false;
					}else{
						//...
					}
				});
			}

			// cancel friend request
			function cancel_friend_request(user){


				var user_id = user.user_id;
				
				var ok = false;
				var c = {
					data: {
						"friend_id": user_id
					}
				}

				CiayoService.Api('users/relation/cancel', c, function(response) {
					if(response.status==200){
						var data = response.data.c.data;

						console.log('sukses');
						user.icon_addfriend = true;
						user.name_addfriend = true;
						user.icon_self = 0;
						user.name_self = 0;
						user.ci_star = false;
						user.icon_action_response = false;
					}
					
				});
				
			}

			// Action response (accept or reject)
			function action_response(user){
				
				user.icon_action_response = true;
				
			}

			// click outside action-response
			function closeActionResponse(user){
				//alert("test");
				user.icon_action_response = false;
			}

			// action response accpet
			function action_response_accept(user){
				//alert(user_id+'_'+id);
				var user_id = user.user_id;
				//console.log(user_id);
				
				var ok = false;
				var c = {
					data: {
						"user_relation_id": user_id
					}
				}

				CiayoService.Api('users/relation/confirm', c, function(response) {
					if(response.status==200){
						var data = response.data.c.data;

						if (data.error == false) {
							ok = true;
						}
					}
					if(ok){
						user.icon_addfriend = false;
						user.name_addfriend = false;
						user.checklist_addfriend = false;
						user.icon_follow = false;
						user.name_follow = false;
						user.icon_action_response = false;
						user.status.friend.approve=true;
						user.hide_approve = true;
					}else{
						//...
					}
				});
			}

			// action response delete
			function action_response_delete(user){
				//alert(user_id+'_'+id);
				var user_id = user.user_id;
				//console.log(user_id);
				
				var ok = false;
				var c = {
					data: {
						"friend_id": user_id
					}
				}

				CiayoService.Api('users/relation/reject', c, function(response) {
					if(response.status==200){
						var data = response.data.c.data;

						if (data.error == false) {
							ok = true;
						}
					}
					if(ok){
						user.icon_addfriend = true;
						user.name_addfriend = true;
						user.icon_self = 0;
						user.name_self = 0;
						user.ci_star = false;
						user.icon_action_response = false;
					}else{
						//...
					}
				});
			}	

			// action follow
			function action_follow(user){
				//alert(user_id+'_'+id);
				var user_id = user.user_id;
				
				var ok = false;
				var c = {
					data: {
						user_id:user_id,
						follow:true
					}
				}

				CiayoService.Api('users/follow', c, function(response) {
					if(response.status==200){
						var data = response.data.c.data;

						if (data.error == false) {
							ok = true;
						}
					}
					if(ok){
						user.icon_follow = false;
						user.name_follow = false;
					}else{
						//...
					}
				});
			}

			// action unfollow
			function action_unfollow(user){
				//alert(user_id+'_'+id);
				//alert(user_id+'_'+id);
				var user_id = user.user_id;
				
				var ok = false;
				var c = {
					data: {
						user_id:user_id,
						follow:false
					}
				}

				CiayoService.Api('users/follow', c, function(response) {
					if(response.status==200){
						var data = response.data.c.data;

						if (data.error == false) {
							ok = true;
						}
					}
					if(ok){
						user.icon_follow = true;
						user.name_follow = true;
					}else{
						//...
					}
				});
			}		

		}

		function getMutualFriend(user_id, username){
			mutualFriendDrawer.open(user_id, username);
		}
		
		return factory;
	}
})();