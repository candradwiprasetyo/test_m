(function () {
	'use strict';

	angular
		.module('app')
		.factory('friendRequestFactory', friendRequestFactory);
	friendRequestFactory.$inject = ['$rootScope','modalFactory', 'CiayoService', '$state', 'mutualFriendDrawer', 'navbarFactory', '$cookieStore'];

	function friendRequestFactory($rootScope,modalFactory, CiayoService, $state, mutualFriendDrawer, navbarFactory, $cookieStore) {
		var factory = {
			type:'user',
			fr_list:[],
			// email_list:
			// 		  [{
			// 	        address: 'candradwiprasetyo@gmail.com', value: 'false'
			// 	      },
			// 	      {
			// 	        address: 'selubungers@gmail.com', value: 'false'
			// 	      },
			// 	      {
			// 	        address: 'diahwidhilestari@gmail.com', value: 'false'
			// 	      },
			// 	      {
			// 	        address: 'melon.candra@yahoo.com', value: 'false'
			// 	      }],
			email_list:[],
			email:'',
			getFrList:getFrList,
			countFr:'',
			view_user:view_user,
			action_accept:action_accept,
			action_decline:action_decline,
			fr_start:false,
			actionSendInvitation:actionSendInvitation,
			actionSendInvitationGmail:actionSendInvitationGmail,
			open_modal_item1:open_modal_item1,
			close_modal_item1:close_modal_item1,
			open_modal_item2:open_modal_item2,
			close_modal_item2:close_modal_item2,
			open_modal_item3:open_modal_item3,
			close_modal_item3:close_modal_item3,
			modal_item1: false,
			modal_item2:false,
			item2_load:false,
			getMutualFriend:getMutualFriend,
			i_email: '',
			load_email:load_email,
			start_load_email:false,
			i_search:'',
			i_description: 'There’s a distortion in time and space, and I got teleported into the CIAYO World! It’s fun here, tho. Join in!'
		};

		function load_email(){
			factory.item2_load = true;
			factory.start_load_email = true;
		}

		function open_modal_item1(){
			factory.i_email = '';
			factory.modal_item1 = true;
		}

		function open_modal_item2(){
			
			if(factory.start_load_email==true){
				factory.modal_item2 = true;
			}else{
				factory.modal_item2 = true;
				var config = {
			      	'client_id': '788891428909-o4a2s2hht5jud5at66crv1je57f9198i.apps.googleusercontent.com',
			      	'scope': 'https://www.google.com/m8/feeds'
			    };
			    gapi.auth.authorize(config, function() {
			       	fetch(gapi.auth.getToken());
			    });
			}
		}

		function fetch(token) {
		    $.ajax({
			    url: "https://www.google.com/m8/feeds/contacts/default/full?access_token=" + token.access_token + "&alt=json",
			    dataType: "jsonp",
			    success:function(data) {
			    	factory.modal_item2 = true;   
			        //console.log(JSON.stringify(data));
			  		var data_json = data;
			        //console.log(data_json);
					var entry_data = data_json.feed.entry;

					factory.email_name = data_json.feed.author.name;
					
					 for(var i=0; i<entry_data.length; i++){
					 	if(entry_data[i].gd$email){
					 		var email = entry_data[i].gd$email[0].address;

					 		factory.email_list.push({address: email});

					 		
					 	}
					 }	     

					 

			    }
			});
		}

		function open_modal_item3(){
			factory.modal_item3 = true;
		}

		function close_modal_item1(){
			factory.modal_item1 = false;
		}
		function close_modal_item2(){
			factory.modal_item2 = false;
		}

		function close_modal_item3(){
			factory.modal_item3 = false;
		}

		function actionSendInvitationGmail(){

			//console.log(factory.i_email);
			var jml = 0;
			var error = 0;
			for(var i=0; i<factory.email_list.length; i++){
				if(factory.email_list[i].value==true){
					jml++;
					var ok = false;
						var c = {
							data: {
								"email": factory.email_list[i].address
							}
						}
					CiayoService.Api('users/invite', c, function(response) {
						if(response.status==200){
							var data = response.data.c.data;

							
							//modalFactory.message(data.message.email[0]);
							
							if (data.error == false) {
								
							}else{
								error++;
							}
						}
						if(ok){
							console.log(data.message);
						}else{
							//...
						}
					});
				}
			}


			if(jml==0){
				modalFactory.message('Please select email');			
			}else{
				factory.modal_item2 = false;
				if(error==0){
					modalFactory.message("Your invitation has been sent");
				}else{
					modalFactory.message("Sent invitation error");
				}
			}
		}

		function actionSendInvitation(){

			if(factory.i_email){
				modalFactory.message(factory.i_email);

				var email_all = factory.i_email;

				var email = email_all.split(',');

				var error = 0;
				for(var i=0; i<email.length; i++){

					//console.log(email[i]);
					var ok = false;
						var c = {
							data: {
								"email": email[i]
							}
						}
					CiayoService.Api('users/invite', c, function(response) {
						if(response.status==200){
							var data = response.data.c.data;

							
							//modalFactory.message(data.message.email[0]);
							
							if (data.error == false) {
								
							}else{
								error++;
							}
						}
						if(ok){
							console.log(data.message);
						}else{
							//...
						}
					});
				}

				if(error==0){
					modalFactory.message("Your invitation has been sent");
				}else{
					modalFactory.message("Sent invitation error");
				}
				factory.modal_item1 = false;

			}else{
				modalFactory.message('Please fill email');
			}
			
		}

		function getFrList(){
			
				factory.fr_list=[];

				var offset = factory.fr_list.length;
				var limit = 3;

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
							
							value.accept = false;
							value.decline = false;
							
							//console.log(friend_connection);
							factory.fr_list.push(value);

							
						});

						factory.fr_start = true;

					}else{
						//...
					}
				});
			
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

					$rootScope.$broadcast( "user.friend_request",'data');	

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

					$rootScope.$broadcast( "user.friend_request",'data');	
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
         	getFrList(true);
        });

        //socket add friend
        socket.on('nf002', function(data){ 
         	factory.fr_list = [];
         	factory.fr_start = false;
         	getFrList(true);
        });


		return factory;
	}
})();