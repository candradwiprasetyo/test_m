(function () {
	'use strict';

	angular
		.module('app')
		.factory('friendRequestAllFactory', friendRequestAllFactory);
	friendRequestAllFactory.$inject = ['$rootScope','modalFactory', 'CiayoService', '$state', 'mutualFriendDrawer', 'navbarFactory', '$cookieStore'];

	function friendRequestAllFactory($rootScope,modalFactory, CiayoService, $state, mutualFriendDrawer, navbarFactory, $cookieStore) {
		var factory = {
			type:'user',
			fr_list:[],
			getFrList:getFrList,
			countFr:'',
			view_user:view_user,
			action_accept:action_accept,
			action_decline:action_decline,
			fr_start:false,
			load_more: false,
			loading: false,
			isloading:false,
			init:init,
			accept:false,
			decline:false,
			getMutualFriend:getMutualFriend
		};

		function init(){
			factory.fr_list = [];
			getFrList()
		}

		function getFrListNext(limit, offset){
			
				var offset = offset + 10;

				var ok = false;
				var c = {
					data: {
						"limit": limit,
						"offset": offset
					}
				}
				CiayoService.Api('users/relation', c, function(response) {
					if(response.status==200){
						var data = response.data.c.data;
						if (data.error == false) {
							ok = true;
						}
					}
					if(ok){

						var tmp_next=(data.content.data);
						
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
			
		}


		function getFrList(start){
			
			if(!factory.isloading){
				factory.isloading = true;
				factory.loading = true;

				if(start){
					factory.fr_list = [];
				}

				var offset = factory.fr_list.length;
				var limit = 10;

				var ok = false;
				var c = {
					data: {
						"limit": limit,
						"offset": offset
					}
				}
				CiayoService.Api('users/relation', c, function(response) {
					if(response.status==200){
						var data = response.data.c.data;
						factory.countFr = response.data.c.data.meta.total;
						if (data.error == false) {
							ok = true;
						}
					}
					if(ok){

						//console.log(countFr);
						
						var tmp=(data.content.data);
						//console.log(tmp);
						angular.forEach(tmp,function(value,key){
							if(value){
								value.accept = false;
								value.decline = false;
								
								//console.log(friend_connection);
								factory.fr_list.push(value);	
							}
							

							
						});

						factory.fr_start = true;
						factory.isloading = false;
						getFrListNext(limit, offset);

					}else{
						//...
					}
				});
			}
		}

		function view_user(friend){
			$state.go('profile', {user: friend.username});
		}

		function action_accept(friend){
			

			var c={
				data:{
					"user_relation_id": friend.list_user.user_id
				}
			};

			CiayoService.Api('users/relation/confirm', c, function(response) {
				if(response.status==200){
					//console.log(friend);
					friend.accept = true;
					friend.decline = false;
				}else{
					console.log(response);
				}
				
			});

		}

		function action_decline(friend){
			var c={
				data:{
					"friend_id": friend.list_user.user_id
				}
			};

			CiayoService.Api('users/relation/reject', c, function(response) {
				if(response.status==200){
					//console.log(friend);
					friend.accept = false;
					friend.decline = true;
				}else{
					console.log(response);
				}
				
			});
		}

		function getMutualFriend(user_id, username){
			mutualFriendDrawer.open(user_id, username);
		}

		//socket confirm request friend		
		var socket = navbarFactory.Socket();
		//console.log(socket);
		socket.emit('set_userid', $cookieStore.get('user_id'));
        socket.on('nf003', function(data){ 
         	factory.fr_list = [];
         	factory.fr_start = false;
         	factory.load_more = false;
         	getFrList(true);
        });

        //socket add friend
        socket.on('nf002', function(data){ 
         	factory.fr_list = [];
         	factory.fr_start = false;
         	factory.load_more = false;
         	getFrList(true);
        });


		return factory;
	}
})();