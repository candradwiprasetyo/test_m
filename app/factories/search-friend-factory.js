(function () {
	'use strict';

	angular
		.module('app')
		.factory('searchFriendFactory', searchFriendFactory);
	searchFriendFactory.$inject = ['$rootScope','modalFactory', 'CiayoService', 'friendConnectionFactory', '$cookieStore', '$stateParams'];

	function searchFriendFactory($rootScope,modalFactory, CiayoService, friendConnectionFactory, $cookieStore, $stateParams) {
		var factory = {
			type:'user',
			user_list:[],
			mutual_list:[],
			getFriendList:getFriendList,
			getFriendListNext:getFriendListNext,
			getMutualList:getMutualList,
			load_more:false,
			loading: false,
			isloading:false,
			load_more_mutual:false,
			loading_mutual: false,
			isloading_mutual:false,
			redirect_page:redirect_page,
			tab_active:'friend',
			get_profile:get_profile,
			user_friend_id: '',
			init
		};

		function init(){
			factory.load_more = false;
			factory.loading = false;
			factory.isloading = false;
			factory.load_more_mutual = false;
			factory.loading_mutual = false;
			factory.isloading_mutual = false;
			factory.user_list = [];
			factory.mutual_list = [];
		}

		function get_profile(){

			factory.user_list=[];

			if($stateParams.username){
				var ok = false;
				var c = {
					data: {
						"username": $stateParams.username
					}
				}

				CiayoService.Api('users/info', c, function(response) {
					if(response.status==200){
						var data = response.data.c.data;
						factory.user_friend_id = data.content.user_id;
						getFriendList(true);
						getMutualList(true);
					}
					
				});

				factory.myprofile = false;

			}else{
				factory.user_friend_id = '';
				getFriendList(true);
				getMutualList(true);
				factory.myprofile = true;
			}

			
			//var user_friend_id = ($stateParams.username) ? '999' : $cookieStore.get('user_id');
			
		}

		function getFriendListNext(keyword, start, limit, offset, api, type){
			
			
				if(start){
					factory.user_list=[];
				}

				offset = offset + 10;

				getApiNext(keyword, start, limit, offset, api, type);
			
		}

		function getMutualListNext(keyword, start, limit, offset, api, type){
			
			
				if(start){
					factory.mutual_list=[];
				}

				offset = offset + 10;

				getApiNext(keyword, start, limit, offset, api, type);
			
		}

		function getFriendList(start){
			
			if(!factory.isloading){
				factory.isloading = true;
				factory.loading = true;
				
				if(factory.tab_active=='friend'){
					var keyword = factory.search_text;
				}else{
					var keyword = '';
				}
				
					if(start){
						factory.user_list=[];
					}
					
					var offset = factory.user_list.length;
					var limit = 10;
					
					getApi(keyword, start, limit, offset, 'search/friend/name', 'friend');
					getFriendListNext(keyword, false, limit, offset, 'search/friend/name', 'friend');
				
			}
			
		}

		function getMutualList(start){
			
			if(!factory.isloading_mutual){
				factory.isloading_mutual = true;
				factory.loading_mutual = true;
				
				if(factory.tab_active=='mutual'){
					var keyword = factory.search_text;
				}else{
					var keyword = '';
				}
				
					if(start){
						factory.mutual_list=[];
					}
					
					var offset = factory.mutual_list.length;
					var limit = 10;
					
					getApi(keyword, start, limit, offset, 'users/friend/mutual', 'mutual');
					getMutualListNext(keyword, false, limit, offset, 'users/friend/mutual', 'mutual');
				
			}
			
		}

		function getApi(keyword, start, limit, offset, api, type){
			var ok = false;

			if($stateParams.username){
				var c = {
					data: {
						"user_id": factory.user_friend_id,
						"keyword": keyword,
						"limit": limit,
						"offset": offset
					}
				}
			}else{
				var c = {
					data: {
						"keyword": keyword,
						"limit": limit,
						"offset": offset
					}
				}
			}

			//console.log(c);

			CiayoService.Api(api, c, function(response) {
				if(response.status==200){
					var data = response.data.c.data;
					if (data.error == false) {
						ok = true;
					}
				}
				if(ok){
					//factory.user_list = factory.user_list.concat(data.content.list_user);
					var tmp=(data.content.list_user);

					if(type=='friend'){
						factory.count_friend_list = data.meta.total;
					}else{
						factory.count_mutual_list = data.meta.total;
					}

					//console.log(tmp.length);
					angular.forEach(tmp,function(value,key){
						
						value.frame = false;
						if($cookieStore.get('user_id')==tmp[key].user_id){
							value.button_self = true;
						}else{
							value.button_self = false;
						}
								
						value.icon_action_response = false;
						value.open_action = false;
						value.ci_star = false;
						value.ci_check = false;
						
						if(tmp[key].status.friend.add==false){
							value.icon_addfriend = true;
							value.name_addfriend = true;
							value.icon_self = 0;
							value.name_self = 0;
							
							
						}else{
							
							if(tmp[key].status.friend.addstatus==false){
								if(tmp[key].status.friend.approve==true){
									value.icon_addfriend = false;
									value.name_addfriend = false;
									value.icon_self = 0;
									value.name_self = 0;
									
								}else{
									value.icon_addfriend = true;
									value.name_addfriend = true;
									value.icon_self = 1;
									value.name_self = 1;
									
									value.ci_star = true;
								}
							}else{
								value.icon_addfriend = false;
								value.name_addfriend = false;
								value.icon_self = 0;
								value.name_self = 0;
								value.ci_check = true;
							}
						}

						if(tmp[key].status.friend.approve==false){
							value.checklist_addfriend = true;
						}else{
							value.checklist_addfriend = false;
						}

						if(tmp[key].status.follow==false){
							value.icon_follow = true;
							value.name_follow = true;
							value.checklist_follow = true;
						}else{
							value.icon_follow = false;
							value.name_follow = false;
						}
						
						var friend_connection = new friendConnectionFactory(value);
						//console.log(friend_connection);
						if(type=='friend'){
							factory.user_list.push(friend_connection);
						}else{
							factory.mutual_list.push(friend_connection);
						}

					});
					if(type=='friend'){
						factory.isloading = false;
					}else{
						factory.isloading_mutual = false;
					}
					//factory.load_more = true;
					//factory.loading = false;
					
					
				}else{
					//...
				}
			});
			
		}

		function getApiNext(keyword, start, limit, offset, api, type){
			var ok = false;
			if($stateParams.username){
				var c = {
					data: {
						"user_id": factory.user_friend_id,
						"keyword": keyword,
						"limit": limit,
						"offset": offset
					}
				}
			}else{
				var c = {
					data: {
						"keyword": keyword,
						"limit": limit,
						"offset": offset
					}
				}
			}

			CiayoService.Api(api, c, function(response) {
				if(response.status==200){
					var data = response.data.c.data;
					if (data.error == false) {
						ok = true;
					}
				}
				if(ok){
					//factory.user_list = factory.user_list.concat(data.content.list_user);

					var tmp_next=(data.content.list_user);

					
					if(tmp_next.length==0){
						if(type=='friend'){
							factory.load_more = false;
						}else{
							factory.load_more_mutual = false;
						}
					}else{
						if(type=='friend'){
							factory.load_more = true;
						}else{
							factory.load_more_mutual = true;
						}
					}	
				}else{
					//...
				}
			});

			if(type=='friend'){
				factory.loading = false;
			}else{
				factory.loading_mutual = false;
			}

				
		}

		function redirect_page(page){
			factory.tab_active = page;
		}

		function getSearchFriend(username){
			searchFriendDrawer.open(username);
		}

		return factory;
	}
})();