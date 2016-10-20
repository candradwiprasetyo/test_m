+function(){
	"use strict";
	angular
		.module("CiayoNavbar", [])
		.directive("cNavbar", cNavbar)
	;
	/*
	attr = active  ['timeline','friend-request','notification','search','menu']
	*/
	function cNavbar(){
		return {
			restrict: "E",
			scope: {},
			replace:true,
			templateUrl: DIRECTIVES_VIEW+'navbar.html',
			link:function(scope, element, attrs, controller, transcludeFn){
				scope.active = attrs.active;
			},
			controller:function ($cookieStore, $state, $scope, navbarFactory, $rootScope, CiayoService, modalFactory) {
				
				// get data count notification
				$scope.list_notification_count=[];

				$scope.mark_all_notification = mark_all_notification;

				function mark_all_notification(){
					
					    
					$scope.notification_count=0;

					
				}

				function get_notification_count(type, limit, offset){
		
					navbarFactory.listNotification ( 
						type, limit, offset,
						function(response){//callback sucess
							//console.log(response.data.c.data.content);
							$scope.notification_count = response.data.c.data.content.count_notif;
							if($scope.notification_count>99){
								$scope.notification_count = '99+';
							}
							
							//console.log($scope.notification_count);

						},
						function(response){//err callback
							console.log(response);
						}
					);
				}
				get_notification_count("null", '1', 0);

				// get data count friend request
				$scope.list_friend_request_count=[];
				//$scope.friend_request_count=0;

				function get_friend_request_count(limit, offset){
					
					navbarFactory.listFriendRequest ( 
						limit, offset,
						function(response){//callback sucess
							
							$scope.friend_request_count = response.data.c.data.meta.total;
							if($scope.friend_request_count>99){
								$scope.friend_request_count='99+';
							}
							//console.log($scope.friend_request_count);
							
						},
						function(response){//err callback
							console.log(response);
						}
					);
				}
				get_friend_request_count('1', 0);

				function init(){

						var c={
			                data:{
			                    username:''
			                }
			            };
			            CiayoService.Api('users/info', c, function(response) {
			                var data=response.data.c.data;
							$scope.token_user_id = data.content.user_id;
							run_socket();
			            });
					 
				}

				init();

				function show_popup_achievement(data){
					// if(data){
					// 	modalFactory.popup_achievement(data);
					// }
					//var data = ['66'];
					for(var i=0; i<data.length; i++){
						modalFactory.popup_achievement(data[i]);
					}

					//console.log(data);
				}

				//show_popup_achievement('');


				function run_socket(){
					// socket commend				
					var socket = navbarFactory.Socket();
					//console.log(socket);
					socket.emit('set_userid', $scope.token_user_id);
					socket.on('nf004', function(data){  
			         	get_notification_count("null", '1', 0);
			        });

			        //socket popup achievement
					socket.on('ach001', function(data){	
						
						//console.log(data)
						show_popup_achievement(data);
						
					});

			        //socket like
			        socket.on('nf005', function(data){  
			         	get_notification_count("null", '1', 0);
			        });

			        //socket confirm request friend
			        socket.on('nf003', function(data){ 
			         	get_friend_request_count('1', 0);
			         	get_notification_count("null", '1', 0);
			        });

			        //socket add friend
			        socket.on('nf002', function(data){ 
			         	get_friend_request_count('1', 0);
			         	get_notification_count("null", '1', 0);
			        });


				 	var user_notification = $rootScope.$on(
	                    "user.notification",
	                    function(event, data) {
	                       
	                        get_notification_count("null", '1', 0);
	                    }
	                );

	                var user_friend_request = $rootScope.$on(
	                    "user.friend_request",
	                    function(event, data) {
	                        get_friend_request_count('1', 0);
	                        
	                    }
	                );
	            }

			}
		}
	}
}();