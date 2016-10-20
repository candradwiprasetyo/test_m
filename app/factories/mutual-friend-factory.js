(function () {
	'use strict';

	angular
		.module('app')
		.factory('mutualFriendFactory', mutualFriendFactory);
	mutualFriendFactory.$inject = ['$rootScope','modalFactory', 'CiayoService', '$state', '$stateParams'];

	function mutualFriendFactory($rootScope,modalFactory, CiayoService, $state, $stateParams) {
		var factory = {
			type:'user',
			user_id:'',
			username:'',
			mutual_friend_list:[],
			getMutualFriendList:getMutualFriendList,
			action_accept:action_accept,
			action_decline:action_decline,
			mutual_start:false,
			load_more: false,
			loading: false,
			isloading:false,
			accept: false,
			decline: false,
			init: init
		};
		function init(){
			factory.accept = false;
			factory.decline = false;
			factory.mutual_friend_list = [];
		}

		function getMutualFriendListNext(limit, offset){
				
				var offset = offset + 10;

				var ok = false;
				var c = {
					data: {
						"user_id": factory.user_id,
						"limit": limit,
						"offset": offset
					}
				}
				CiayoService.Api('users/friend/mutual', c, function(response) {
					if(response.status==200){
						var data = response.data.c.data;
						if (data.error == false) {
							ok = true;
						}
					}
					if(ok){

						var tmp_next=(data.content.list_user);
						
						if(tmp_next.length==0){
							factory.load_more = false;
						}else{
							factory.load_more = true;
						}		


					}else{
						//...
					}
				});

				factory.loading = false;
				factory.loader_drawer = false;
			
		}


		function getMutualFriendList(start){
			
			//alert($stateParams.user_id);

			getUserInfo();
			
			if(!factory.isloading){
				factory.isloading = true;
				factory.loading = true;

				if(start){
					factory.mutual_friend_list = [];
				}
				var offset = factory.mutual_friend_list.length;
				var limit = 10;

				var ok = false;
				var c = {
					data: {
						"user_id": factory.user_id,
						"limit": limit,
						"offset": offset
					}
				}
				CiayoService.Api('users/friend/mutual', c, function(response) {
					if(response.status==200){
						var data = response.data.c.data;
						
						if (data.error == false) {
							ok = true;
						}
					}
					if(ok){

						//console.log(countFr);
						
						var tmp=(data.content.list_user);
						//console.log(tmp);
						angular.forEach(tmp,function(value,key){
							
							value.accept = false;
							value.decline = false;
							
							//console.log(friend_connection);
							factory.mutual_friend_list.push(value);

							
						});

						factory.mutual_start = true;
						factory.isloading = false;
						getMutualFriendListNext(limit, offset);

					}else{
						//...
					}
				});
			}
		}

		function getUserInfo(){

			var user_id = factory.user_id;//$stateParams.user_id;
			var username = factory.username;//$stateParams.username;
			//alert(user_id);

			var ok = false;
			var c = {
				data: {
					"username": username
				}
			}
			CiayoService.Api('users/info', c, function(response) {
					if(response.status==200){
						var data = response.data.c.data;
						//console.log(data);
						if (data.error == false) {
							ok = true;
						}
					}
					if(ok){
						var tmp=[];//(data.content.users_info);
						angular.forEach(data.content.users_info,function(value_new,key){
							tmp[value_new.filter_id]=value_new;
						});

						var full_name = 
						(tmp[2]==undefined?'':tmp[2].value)+ ' ' +
						(tmp[3]==undefined?'':tmp[3].value)+ ' ' +
						(tmp[4]==undefined?'':tmp[4].value);

						var display_name = tmp[5].value;
						
						var gender_name = (tmp[1].value=='1') ? 'Male' : 'Female';

						//console.log(gender_name);
						
						factory.background_avatar_parent	= 	data.content.users_avatar.background_avatar;
						factory.avatar_parent				= 	data.content.users_avatar.avatar;
						factory.username_parent 			= 	username;
						factory.user_id_parent 				= 	user_id;
						factory.user_display_name_parent 	= 	display_name;
						factory.user_full_name_parent 		= 	full_name;
						factory.gender_name_parent 			= 	gender_name;
						factory.status 						=   data.content.status;
						console.log(factory.status);
						if(data.content.status.friend.add==true){
							

							if(data.content.status.friend.approve==true){
								factory.approve = true;
								factory.accept = true;
							}else{
								factory.approve = false;
								factory.accept = false;
							}

						}else{
							factory.approve = false;
							factory.accept = false;
						}

					}
				});
			
				
		}

		function view_user(friend){
			$state.go('profile', {user: friend.username});
		}

		function action_accept(user_id){
			
			console.log(user_id);
			var c={
				data:{
					"user_relation_id": user_id
				}
			};

			CiayoService.Api('users/relation/confirm', c, function(response) {
				if(response.status==200){
					//console.log(friend);
					factory.accept = true;
					factory.decline = false;
				}else{
					console.log(response);
				}
				
			});

		}

		function action_decline(user_id){
			console.log(user_id);

			var c={
				data:{
					"friend_id": user_id
				}
			};

			CiayoService.Api('users/relation/reject', c, function(response) {
				if(response.status==200){
					//console.log(friend);
					factory.accept = false;
					factory.decline = true;
				}else{
					console.log(response);
				}
				
			});
		}

		


		return factory;
	}
})();