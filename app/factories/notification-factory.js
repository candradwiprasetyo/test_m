(function () {
	'use strict';

	angular
		.module('app')
		.factory('notificationFactory', notificationFactory);
	notificationFactory.$inject = ['$rootScope','modalFactory', 'CiayoService', '$state', 'navbarFactory', '$cookieStore','cardResponseWith','cardResponsePlace','timelineFactory','cardDetailDrawer','cardFactory'];

	function notificationFactory($rootScope,modalFactory, CiayoService, $state, navbarFactory, $cookieStore,cardResponseWith,cardResponsePlace,timelineFactory,cardDetailDrawer,cardFactory) {
		var factory = {
			type:'user',
			notification_list:[],
			getNotificationList:getNotificationList,
			load_more: false,
			loading: false,
			isloading:false,
			view_notification:view_notification,
			notification_start: false,
			isRetinaDisplay:isRetinaDisplay,
			mark_all_notification:mark_all_notification,
			init:init
		};

		function mark_all_notification(){
			navbarFactory.requestMarkAllNotification (function(response){
				//console.log(response);

				angular.forEach(factory.notification_list,function(value,key){
					factory.notification_list[key].read_at = 1;
				});
		

			},function(response){
				//console.log(response);
			});
		}

		 function isRetinaDisplay() {
		 	
             	if (window.devicePixelRatio >= 2) {
					return 'retina';
				} else {
					return 'non retina';
				}
        }
	
		function getNotificationListNext(start, limit, offset){
			
		
				if(start){
					factory.notification_list=[];
				}

				offset = offset + 10;
			
				var ok = false;
				var c = {
					data: {
						"limit": limit,
						"offset": offset,
						"order_by": 'created_at'
					}
				}
				CiayoService.Api('notification', c, function(response) {
					if(response.status==200){
						var data = response.data.c.data;
						if (data.error == false) {
							ok = true;
						}
					}
					if(ok){
						//factory.notification_list = factory.notification_list.concat(data.content.list_user);

						var tmp_next=(data.content.list_notification);
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


		function getNotificationList(start){
			if(!factory.isloading){
				factory.isloading = true;
				factory.loading = true;
			
				if(start){
					factory.notification_list=[];
				}
			
				var offset = factory.notification_list.length;
				var limit = 10;

				var ok = false;
				var c = {
					data: {
						"limit": limit,
						"offset": offset,
						"order_by": 'created_at'
					}
				}
				CiayoService.Api('notification', c, function(response) {
					if(response.status==200){
						var data = response.data.c.data;
						if (data.error == false) {
							ok = true;
						}
					}
					if(ok){
						//factory.notification_list = factory.notification_list.concat(data.content.list_user);
						var tmp=(data.content.list_notification);
						//console.log(tmp);
						angular.forEach(tmp,function(value,key){
							
							value.frame = false;
							value.read_at = 1;
							
							//console.log(friend_connection);
							factory.notification_list.push(value);
							
						});
						factory.notification_start = true;
						factory.isloading = false;
						factory.loading = false;
						//getNotificationListNext(false, limit, offset);
						if (data.meta.current_page<data.meta.last_page) {
							factory.load_more = true;
						} else {
							factory.load_more = false;
						}
					}else{
						//...
					}
				});
			}
		}

		function view_notification(notification){
			
			var post_id = notification.post_id;
			var read_at_real = notification.read_at;
			var notification_id = notification.notification_id;
			var type = notification.type;
			var username = notification.username;
			var post_code = notification.post_code;
			var from_name = notification.from_user_display_name;

			if(read_at_real==null){
				var read_at = Number(new Date());

				var c = {
					data: {
						"notification_id": notification_id,
						"type" : type,
						"read_at" : read_at
					}
				}
				CiayoService.Api('notification/read', c, function(response) {
					if(response.status==200){

						notification.read_at = 1;

						
						if(type=="friend_request" || type == "follow_request" || type == "added_friend"){
							$state.go('profile', {username: username});
						}else if(type=="ask_with"){
							cardResponseWith.open();
						}else if(type=="ask_place"){
							cardResponsePlace.open();
							//modalFactory.placeCard(post_code);
						}else{
//							$state.go('detail-page', {post_id: post_code});
							var c = {
								data: {
									"post_code": post_code,
								}
							}
							timelineConnector.cardGet(post_code).then(function(data){
									cardDetailDrawer.open(new cardFactory(data.content,timelineFactory._super,'detail'),function(){
										
									});
							},function(response){
								
							});
						}
					}
					
				});
				$rootScope.$broadcast( "user.notification",'data');	

			}else{
				
				if(type=="friend_request" || type == "follow_request" || type == "added_friend"){
					$state.go('profile', {username: username});
				}else if(type=="ask_with"){
					cardResponseWith.open(post_code,from_name);
				}else if(type=="ask_place"){
					cardResponsePlace.open(post_code,from_name);
				}else{
					var c = {
								data: {
									"post_code": post_code,
								}
							}
							CiayoService.Api('post/detail', c, function (response) {
								var data = response.data.c.data;
								if(data.error==false){
									cardDetailDrawer.open(new cardFactory(data.content,timelineFactory._super,'detail'),function(){
									
									});
								}
							});
				}
			}

		}

		function init(){

				var c={
	                data:{
	                    username:''
	                }
	            };
	            CiayoService.Api('users/info', c, function(response) {
	                var data=response.data.c.data;
					factory.token_user_id = data.content.user_id;
					run_socket();
	            });
			 
		}

		function run_socket(){
			// socket commend				
			var socket = navbarFactory.Socket();
			//console.log(socket);
			socket.emit('set_userid', factory.token_user_id);
			socket.on('nf004', function(data){  
				factory.notification_list = [];
				factory.notification_start = false;
				factory.load_more = false;
	         	getNotificationList(true);
	        });

	        //socket like
	        socket.on('nf005', function(data){  
	         	factory.notification_list = [];
	         	factory.notification_start = false;
				factory.load_more = false;
	         	getNotificationList(true);
	        });
			//socket ask response
	        socket.on('ant001', function(data){  
	         	factory.notification_list = [];
	         	factory.notification_start = false;
				factory.load_more = false;
	         	getNotificationList(true);
	        });

	        //socket confirm request friend
	        socket.on('nf003', function(data){ 
	         	factory.notification_list = [];
	         	factory.notification_start = false;
				factory.load_more = false;
	         	getNotificationList(true);
	        });

	        //socket add friend
	        socket.on('nf002', function(data){ 
	         	factory.notification_list = [];
	         	factory.notification_start = false;
				factory.load_more = false;
	         	getNotificationList(true);
	        });
	    }

		return factory;
	}
})();