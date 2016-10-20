(function () {
	'use strict';

	angular
		.module('app')
		.factory('searchFactory', searchFactory);
	searchFactory.$inject = ['$rootScope','$filter','modalFactory', 'CiayoService', 'friendConnectionFactory', '$cookieStore'];

	function searchFactory($rootScope,$filter,modalFactory, CiayoService, friendConnectionFactory, $cookieStore) {
		var factory = {
			user_list:[],
			getUserList:getUserList,
			load_more:false,
			loading: false,
			isloading:false,
			clearSearch:clearSearch,
			isEmpty:false
		};


		function clearSearch(){
			factory.search_text = '';
			factory.user_list = [];
			factory.load_more = false;
		}

		function getUserListNext(keyword, start, limit, offset, api){
			
			if(keyword){
				if(start){
					factory.user_list=[];
				}

				offset = offset + 10;

				getApiNext(keyword, start, limit, offset, api);

			}else{
				factory.user_list=[];
			}
			
		}

		function getUserList(start){

			if(!factory.isloading){
				factory.isloading = true;
				factory.loading = true;
				var keyword = factory.search_text;
				if(keyword){
					if(start){
						factory.user_list=[];
					}
					
					var offset = factory.user_list.length;
					var limit = 10;

					getApi(keyword, start, limit, offset, 'search/user/name');
					getUserListNext(keyword, false, limit, offset, 'search/user/name');

				}else{
					factory.user_list=[];
					factory.isloading = false;
					factory.loading = false;
					factory.load_more = false;
				}
			}
			
		}


		function getApi(keyword, start, limit, offset, api){
			var ok = false;
			var c = {
				data: {
					"keyword": keyword,
					"limit": limit,
					"offset": offset
				}
			}
			factory.isEmpty=false;
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

					factory.count_friend_list = data.meta.total;

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

						/*if(tmp[key].status.self.add==true){
							value.icon_self = 1;
							value.name_self = 1;
						}else{
							value.icon_self = 0;
							value.name_self = 0;
						}*/

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
						factory.user_list.push(friend_connection);

					});
					factory.isloading = false;
					//factory.load_more = true;
					//factory.loading = false;
					factory.isEmpty=tmp.length==0;
					
				}else{
					//...
				}
			});
		}

		function getApiNext(keyword, start, limit, offset, api){
			var ok = false;
			var c = {
				data: {
					"keyword": keyword,
					"limit": limit,
					"offset": offset
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
					factory.loading = false;
					if(tmp_next.length==0){
						factory.load_more = false;
					}else{
						factory.load_more = true;
					}		

				}else{
					//...
				}
			});
		}

		return factory;
	}
})();