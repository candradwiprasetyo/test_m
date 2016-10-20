(function () {
	'use strict';

	angular
		.module('app')
		.factory('trendingPeopleFactory', trendingPeopleFactory);
	trendingPeopleFactory.$inject = ['$rootScope','modalFactory', 'CiayoService', '$state', 'friendConnectionFactory', '$cookieStore'];

	function trendingPeopleFactory($rootScope,modalFactory, CiayoService, $state, friendConnectionFactory, $cookieStore) {
		var factory = {
			trending_people_list:[],
			getTrendingPeopleList:getTrendingPeopleList,
			trending_people_start:false
		};

		function getTrendingPeopleList(start){
				
				//if(start){
					factory.trending_people_start=false;
					factory.trending_people_list=[];
				//}
					var offset = 0;
					var limit = 20;

					var ok = false;
					var c = {
						data: {
							"limit": limit,
							"offset": offset
						}
					}
					// CiayoService.Api('users/trending', c, function(response) {
					// 	if(response.status==200){
					// 		var data = response.data.c.data;
					// 		if (data.error == false) {
					// 			ok = true;
					// 		}
					// 	}
					// 	if(ok){

					// 		//console.log(countFr);
							
					// 		var tmp=(data.content.trending);
					// 		//console.log(tmp);
					// 		factory.count = 1;
					// 		angular.forEach(tmp,function(value,key){
					// 			value.trending_people_number = factory.count;
					// 			if((value.trending_people_number+'').length==1){
					// 				value.trending_people_number = "0"+value.trending_people_number;
					// 			}
					// 			factory.trending_people_list.push(value);
								
					// 			factory.count++;
					// 		});

					// 		factory.trending_people_start = true;

					// 	}else{
					// 		//...
					// 	}
					// });

					CiayoService.Api('users/trending', c, function(response) {
						if(response.status==200){
							var data = response.data.c.data;
							if (data.error == false) {
								ok = true;
							}
						}
						if(ok){
							//factory.user_list = factory.user_list.concat(data.content.list_user);
							var tmp=(data.content.trending);
							console.log(tmp.length);
							factory.count = 1;
							angular.forEach(tmp,function(value,key){

								value.trending_people_number = factory.count;
					 			if((value.trending_people_number+'').length==1){
					 				value.trending_people_number = "0"+value.trending_people_number;
					 			}
								
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
								factory.trending_people_list.push(friend_connection);

								factory.count++;

							});

							factory.trending_people_start = true;
							
							
						}else{
							//...
						}
					});
				
		}
		

		return factory;
	}
})();