(function() {
	'use strict';

	angular
		.module('app')
		.factory('profileFactory', profileFactory);

	profileFactory.$inject = ['$state', 'modalFactory','$stateParams','CiayoService', 'friendConnectionFactory', '$cookieStore', 'searchFriendDrawer', '$rootScope', 'settingConnector'];

	function profileFactory($state, modalFactory,$stateParams,CiayoService, friendConnectionFactory, $cookieStore, searchFriendDrawer, $rootScope, settingConnector) {
		var factory = {
			userBasicInfo:userBasicInfo,
			listTitle:listTitle,
			editFilter:editFilter,
			editUsername:editUsername,
			editWebsite:editWebsite,
			saveWebsite:saveWebsite,
			removeWebsite:removeWebsite,
			saveNameTitle:saveNameTitle,
			listPrefix:listPrefix,
			settingHide:settingHide,
			showEmail:showEmail,
			showPhone:showPhone,
			showBirthday:showBirthday,
			showNationality:showNationality,
			listAchievement:listAchievement,
			listBadge:listBadge,
			showAchievement:showAchievement,
			showBadge:showBadge,
			pickAchievement:pickAchievement,
			pickBadge:pickBadge,
			removeAchievement:removeAchievement,
			removeBadge:removeBadge,
			saveChoiceAchievement:saveChoiceAchievement,
			saveChoiceBadge:saveChoiceBadge,
			listChoiceAchievement:listChoiceAchievement,
			listChoiceBadge:listChoiceBadge,
			choiceAchievementSave:choiceAchievementSave,
			choiceBadgeSave:choiceBadgeSave,
			getDetailAchievement:getDetailAchievement,
			seeAllAchievement:seeAllAchievement,
			closeDetail:closeDetail,
			openSearchAchievement:openSearchAchievement,
			gotoTab:gotoTab,
			state:1,
			profileContent:profileContent,
			saveMediaSocial:saveMediaSocial,
			saveMoreSocialMedia:saveMoreSocialMedia,
			listSocialMedia:listSocialMedia,
			deleteSocialMedia:deleteSocialMedia,
			editMediaSocial:editMediaSocial,
			cancelRequest:cancelRequest,
			sendRequest:sendRequest,
			reset:reset,
			follow,
			addfriend,
			approvefriend,
			info: {
				data:[],
				list:[]
			},
			title: {
				list: []
			},
			choice_achievement: [],
			choice_badge: [],
			pick_achievement: [],
			pick_badge: [],
			slot1: [],
			slot2: [],
			type:'',
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
			data_profile: [],
			getSearchFriend:getSearchFriend,
			goto_back:goto_back,
			getBanner:getBanner
		}

		function getBanner(){

			var c = {
				data: {
					type: "profile"
				}
			}

			CiayoService.Api('users/banner', c, function(response) {
                var data=response.data.c.data.content.image;
                factory.banner = data;
				setTimeout(function(){
					$('.c-banner').children("ul").parallax({
						clipRelativeInput: false,
						originX: 0.0,
						originY: 1.0,
						frictionY: 0.0,
					});
				}, 1000)
                //console.log(data);
            });
			
		}

		factory.edit_list_website = [];

		function userBasicInfo() {
			//setTimeout(function(){
				factory.load_info = false;
				var c = {
					data : {
						username:$stateParams.username
					}
				};
				CiayoService.Api('users/info', c, function(response) {
					var ok = false;
					var data = null;
					if(response.status==200) {
						data = response.data.c.data;
						//console.log(data);
						modalFactory.log(data,'info');
						var info=[];
						if(data.error == false) {
							ok = true;
						}
					}
					if(ok) {
						get_profile();
						settingHide();
						factory.info.list=[];
						factory.info.list = data.content.users_info;
						factory.username = $stateParams.username;
						factory.user_id = data.content.user_id;

						factory.status_follow = data.content.status.follow;
						factory.status_approve = data.content.status.friend.approve;
						factory.status_add = data.content.status.friend.add;
						factory.status_addstatus = data.content.status.friend.addstatus;
						factory.profile_avatar = data.content.users_avatar.avatar;

						factory.info.data=[];
						angular.forEach(factory.info.list, function(value,key) {
							factory.info.data[value.filter_id] = value;
						})

						if(factory.username) {
							try {
								factory.email = data.content.email;
							}catch(err){}
							try {
								factory.phone = data.content.phone;
							}catch(err){}
							
							try {
								factory.place_of_birth = factory.info.data[7].value+', ';
								factory.edit_place_birth = factory.info.data[7].value;
							}catch(err){}
							try {
								var timestamp = factory.info.data[6].value;
								var date = new Date(timestamp * 1000);
								if($cookieStore.get('language')==1) {
									var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
								}
								if($cookieStore.get('language')==2) {
									var months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
								}
								factory.date_of_birth = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();

								var _date = parseInt(date.getDate());
								if(_date<10) {
									_date = "0" + date.getDate();
								}
								var _mounth = parseInt(date.getMonth())+1;
								if(_mounth<10) {
									_mounth = "0" + (parseInt(date.getMonth())+1);
								}
								var newdate = _date + "/" + _mounth + "/" + date.getFullYear();
								$('#inputDate').val(newdate);
							}catch(err){}
						}

						try {
							factory.first_name = factory.info.data[2].value
							factory.edit_first_name = factory.first_name
						}catch(err){factory.first_name=''}
						try {
							factory.middle_name = factory.info.data[3].value
							factory.edit_middle_name = factory.middle_name
						}catch(err){factory.middle_name=''}
						try {
							factory.last_name = factory.info.data[4].value
							factory.edit_last_name = factory.last_name
						}catch(err){factory.last_name=''}
						try {factory.profile_name = factory.info.data[5].value}catch(err){}
						try {factory.edit_profile_name = factory.info.data[5].value}catch(err){}
						
						try {factory.pinterest = 'http://pinterest.com/'+factory.info.data[501].value}catch(err){factory.pinterest = false}
						try {factory.facebook = 'http://facebook.com/'+factory.info.data[480].value;factory.facebook_account=factory.facebook}catch(err){ factory.facebook = false}
						try {factory.twitter = 'http://twitter.com/'+factory.info.data[481].value;factory.twitter_account=factory.twitter}catch(err){ factory.twitter = false}
						try {factory.instagram = 'http://instagram.com/'+factory.info.data[482].value;factory.instagram_account=factory.instagram}catch(err){factory.instagram = false}
						try {factory.path = 'http://path.com/'+factory.info.data[500].value;factory.path_account=factory.path}catch(err){factory.path = false}

						factory.socialType = [];
						if(!factory.facebook) factory.socialType.push({name: 'Facebook', value: 'facebook'});
						if(!factory.twitter) factory.socialType.push({name: 'Twitter', value: 'twitter'});
						if(!factory.instagram) factory.socialType.push({name: 'Instagram', value: 'instagram'});
						if(!factory.pinterest) factory.socialType.push({name: 'Pinterest', value: 'pinterest'});
						if(!factory.path) factory.socialType.push({name: 'Path', value: 'path-01'});
						try {factory.select_social_media = factory.socialType[0].value}catch(err){}
						if(factory.facebook&&factory.twitter&&factory.instagram&&factory.pinterest&&factory.path) {
							factory.all_social_media = true;
						} else {
							factory.all_social_media = false;
						}
						try {factory.title = factory.info.data[520].value;factory.edit_title=factory.title;factory._title=true}catch(err){factory.title='no title';factory.edit_title='no title'}
						
						try {factory.nationality = factory.info.data[8].value;factory.edit_nationality=String(factory.nationality)}catch(err){factory.nationality=''}
						try {
		                	factory.website = factory.info.data[37].value.split(',');
		                	factory.list_website = [];
		                	for(var i=0 ; i<factory.website.length ; i++) {
			                	var val=factory.website[i].split('//');
								if(val[1] != undefined) {
									var value = val[1];
								} else {
									var value = val[0];
								}
								factory.list_website.push({"name":value});
							}
							factory.edit_list_website = [];
							angular.forEach(factory.list_website,function(value,key){
								factory.edit_list_website.push({"name":value.name});

							});
						}catch(err){factory.website = '';factory.list_website = []}
						factory.load_info = true;
					} else {
						modalFactory.message(data.message);
						window.history.back();
					}
				});
			//},500);
		}

		function reset() {
			factory.username='';
			factory.first_name='';
			factory.middle_name='';
			factory.last_name='';
			factory.profile_name='';
			factory.profile_avatar='';
			factory.place_of_birth='';
			factory.date_of_birth='';
			factory.title='no title';
			factory.date_of_birth='';
			factory.email='';
			factory.phone='';
			factory.nationality='';
			factory.website='';
		}

		function getSetting() {
			var c={
                data:{
                    username:$stateParams.username
                }
            };
            CiayoService.Api('users/info', c, function(response) {
                var data=response.data.c.data;
				factory.user_id = data.content.user_id;
            });
		}

		getSetting();

		function settingHide() {
			factory.place_of_birth='';
			factory.date_of_birth='';
			factory.email = '';
			factory.phone = '';
			var c={
                data:{
                }
            };
            CiayoService.Api('settings', c, function(response) {
            	var data = response.data.c.data;
                var setting = data.content.list_setting;
				var general = setting.general_setting;
				var email_setting = general.email_setting;
				var edit_account = setting.edit_account;
				var edit_basic_info = setting.edit_basic_info;

				if(!factory.username) {
					try{factory.email = edit_account.email_address.value}catch(err){}
					try{factory.phone = edit_account.phone_number.value}catch(err){}

					factory.edit_email = factory.email;
					factory.edit_phone = factory.phone;

					try{factory.place_of_birth = edit_basic_info.place_of_birth.value}catch(err){}
					if(factory.place_of_birth!=null) {
						factory.place_of_birth = edit_basic_info.place_of_birth.value+', ';
						factory.edit_place_birth = edit_basic_info.place_of_birth.value;
					} else {
						factory.place_of_birth = '';
						factory.edit_place_birth = '';
					}
					
					var timestamp = edit_basic_info.date_of_birth.value;
					var date = new Date(timestamp * 1000);
					if($cookieStore.get('language')==1) {
						var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
					}
					if($cookieStore.get('language')==2) {
						var months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
					}
					factory.date_of_birth = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();

					var _date = parseInt(date.getDate());
					if(_date<10) {
						_date = "0" + date.getDate();
					}
					var _mounth = parseInt(date.getMonth())+1;
					if(_mounth<10) {
						_mounth = "0" + (parseInt(date.getMonth())+1);
					}
					var newdate = _date + "/" + _mounth + "/" + date.getFullYear();
					$('#inputDate').val(newdate);
				}

				factory.show_email = edit_account.show_email.value;
				factory.show_phone = edit_account.show_phone.value;
				//factory.show_birthday = edit_account.show_birthday.value;
				//factory.show_nationality = edit_account.show_nationality.value;
            });
		}

		function showEmail() {
			var value=(factory.show_email)?1:0;
			settingConnector.setPreference(value, 'show_email').then(function(data) {
			
			},function(response){
				
			})
		}

		function showPhone() {
			var value=(factory.show_phone)?1:0;
			settingConnector.setPreference(value, 'show_phone').then(function(data) {
			
			},function(response){
				
			})
		}

		function showBirthday() {
			var value=(factory.show_birthday)?1:0;
			settingConnector.setPreference(value, 'show_birthday').then(function(data) {
			
			},function(response){
				
			})
		}

		function showNationality() {
			var value=(factory.show_nationality)?1:0;
			settingConnector.setPreference(value, 'show_nationality').then(function(data) {
			
			},function(response){
				
			})
		}

		function cancelRequest() {
			$('.cm-modal.-ask-personal-info.-placendate.-dialog').removeClass('-open');
			$('.cm-modal.-ask-personal-info.-email.-dialog').removeClass('-open');
			$('.cm-modal.-ask-personal-info.-phone.-dialog').removeClass('-open');
		}

		function sendRequest(type) {
			$('.cm-modal.-ask-personal-info.-placendate.-dialog').removeClass('-open');
			$('.cm-modal.-ask-personal-info.-email.-dialog').removeClass('-open');
			$('.cm-modal.-ask-personal-info.-phone.-dialog').removeClass('-open');
		}

		function listTitle() {
			var c={
				data:{
					tittle:true
				}
			};
			CiayoService.Api('users/achievement/all', c, function(response) {
				var ok = false;
				var data = null;
				if(response.status==200) {
					data = response.data.c.data;
					modalFactory.log(data,'info');
					var title=[];
					if(data.error == false) {
						ok = true;
					}
				}
				if(ok) {
					factory.list_title = data.content.data;
				} else {

				}
			});
		}

		function saveNameTitle() {
			var updated_filter = [{"filter_id":520,"filter_value" : factory.edit_title}];
			var c={
                data:{
                    updated_filter:updated_filter,
                    type:2
                }
            };
            CiayoService.Api('users/filter/update', c, function(response) {
                var ok = false;
				var data = null;
				if(response.status==200) {
					data = response.data.c.data;
					modalFactory.log(data,'info');
					var title=[];
					if(data.error == false) {
						ok = true;
					}
				}
				if(ok) {
					//modalFactory.message(data.message);
				} else {
					//modalFactory.message(data.message);
				}
            });
		}

		function editUsername() {
			if(factory.profile_name!=factory.edit_profile_name) {
				var c={
	                data:{
	                    screen_name:factory.edit_profile_name
	                }
	            };
	            CiayoService.Api('users/screen/name', c, function(response) {
	            	var ok = false;
	                var data = null;
					if(response.status==200) {
						data = response.data.c.data;
						modalFactory.log(data,'info');
						var title=[];
						if(data.error == false) {
							ok = true;
						}
					}
					if(ok) {
						//modalFactory.message(data.message);
						factory.profile_name = factory.edit_profile_name;
					} else {
						//modalFactory.message(data.message);
					}
	            });
	        }
            var value = factory.edit_title;
			var c={
                data:{
                    value:value
                }
            };
            CiayoService.Api('users/filter/update/achievement', c, function(response) {
            	var ok = false;
                var data = null;
				if(response.status==200) {
					data = response.data.c.data;
					modalFactory.log(data,'info');
					var title=[];
					if(data.error == false) {
						ok = true;
					}
				}
				if(ok) {
					factory.title = factory.edit_title;
            		factory._title = true;
					//modalFactory.message(data.message);
				} else {
					//modalFactory.message(data.message);
				}
            });
		}

		function editFilter() {
			//alert();
			if(!factory.edit_first_name) factory.edit_first_name = "-";
			if(!factory.edit_middle_name) factory.edit_middle_name = "-";
			if(!factory.edit_last_name) factory.edit_last_name = "-";
			var updated_filter = [{"filter_id":2,"filter_value" : factory.edit_first_name},{"filter_id":3,"filter_value" : factory.edit_middle_name},{"filter_id":4,"filter_value" : factory.edit_last_name},{"filter_id":6,"filter_value" : angular.element('#timestamp').val()},{"filter_id":7,"filter_value" : factory.edit_place_birth},{"filter_id":37,"filter_value" : factory.edit_website},{"filter_id":8,"filter_value" : factory.edit_nationality}];
			var c={
                data:{
                    updated_filter:updated_filter,
                    type:2
                }
            };
            CiayoService.Api('users/filter/update', c, function(response) {
            	var ok = false;
                var data = null;
				if(response.status==200) {
					data = response.data.c.data;
					modalFactory.log(data,'info');
					var title=[];
					if(data.error == false) {
						ok = true;
					}
				}
				if(ok) {
					modalFactory.message(data.message);
					factory.first_name = factory.edit_first_name;
					factory.middle_name = factory.edit_middle_name;
					factory.last_name = factory.edit_last_name;
					userBasicInfo();
				} else {
					modalFactory.message(data.message);
				}
            });
		}

		function editWebsite() {
			factory.edit_list_website.push({"name":factory.edit_website});
			factory.edit_website = '';
		}

		function removeWebsite(id) {
			for(var i = 0; i < factory.edit_list_website.length; i++) {
				if(factory.edit_list_website[i]['name']==id) {
			    	delete factory.edit_list_website[i];
			    }
			}
			factory.temp_list_website = factory.edit_list_website;
			factory.edit_list_website = [];
			angular.forEach(factory.temp_list_website,function(value,key){
				factory.edit_list_website.push({"name":value.name});
			});
		}

		factory.website_value = '';

		function saveWebsite() {
			if(factory.edit_website) editWebsite();
			var id = 1;
			angular.forEach(factory.edit_list_website,function(value,key){
				if(id==1) {
					factory.website_value = value.name;
				} else {
					factory.website_value += ","+value.name;
				}
				id++;
			});
			factory.website_value = factory.website_value.replace('undefined',' ');
			if(!factory.website_value) {
				factory.website_value = ' ';
			}
			console.log(factory.website_value);
			var updated_filter = [{"filter_id":37,"filter_value" : factory.website_value}];
			var c={
                data:{
                    updated_filter:updated_filter,
                    type:2
                }
            };
            CiayoService.Api('users/filter/update', c, function(response) {
            	var ok = false;
                var data = null;
				if(response.status==200) {
					data = response.data.c.data;
					modalFactory.log(data,'info');
					var title=[];
					if(data.error == false) {
						ok = true;
					}
				}
				if(ok) {
					modalFactory.message(data.message);
					factory.list_website = [];
					angular.forEach(factory.edit_list_website,function(value,key){
						factory.list_website.push({"name":value.name});
					});
					$(".cm").removeClass("-locked");
        			$(".cm-panel.-edit-profile-website").removeClass("-open");
				} else {
					modalFactory.message(data.message);
				}
            });
		}

		factory.achievement_sort = 'true';

		function listAchievement(){
			factory.open_list_choice_achievement = true;
			factory.open_list_choice_badge = false;
			if($stateParams.username) {
				var user_id = factory.user_friend_id;
			} else {
				var user_id = null;
			}
			var c={
				data:{
					orderType:'name',
					orderBy:'asc',
					limit:50,
					offset:0,
					search:factory.keyword_choice_achievement,
					user_id:user_id
				}
			};
			CiayoService.Api('achievement/completed', c, function(response) {
				var ok = false;
                var data = null;
				if(response.status==200) {
					modalFactory.log('list choice achievement');
					data = response.data.c.data;
					modalFactory.log(data,'info');
					if(data.error == false) {
						ok = true;
					}
				}
				if(ok) {
					factory.list_choice_achievement = data.content.data;
					factory.achievement_count = 0;
					angular.forEach(factory.list_choice_achievement,function(value,key){
						if(value.percent==100) factory.achievement_count++;
					});
				} else {
					
				}
			});
		}

		function listBadge(){
			factory.open_list_choice_achievement = false;
			factory.open_list_choice_badge = true;
			var c={
				data:{
					orderType:'name',
					orderBy:'asc',
					limit:10,
					offset:0,
					search:factory.keyword_choice_badge
				}
			};
			CiayoService.Api('badge', c, function(response) {
				var ok = false;
                var data = null;
				if(response.status==200) {
					modalFactory.log('list badge');
					data = response.data.c.data;
					modalFactory.log(data,'info');
					if(data.error == false) {
						ok = true;
					}
				}
				if(ok) {
					factory.list_choice_badge = data.content.data;
				} else {
					
				}
			});
		}

		factory.slot1[1]=null;
		factory.slot1[2]=null;
		factory.slot1[3]=null;
		factory.slot1[4]=null;
		factory.slot1[5]=null;
		factory.slot1[6]=null;
		factory.slot1[7]=null;
		factory.slot1[8]=null;
		factory.slot1[9]=null;
		factory.slot1[10]=null;
		factory.slot1[11]=null;
		factory.slot1[12]=null;

		factory.slot2[1]=null;
		factory.slot2[2]=null;
		factory.slot2[3]=null;
		factory.slot2[4]=null;
		factory.slot2[5]=null;
		factory.slot2[6]=null;
		factory.slot2[7]=null;
		factory.slot2[8]=null;
		factory.slot2[9]=null;
		factory.slot2[10]=null;
		factory.slot2[11]=null;
		factory.slot2[12]=null;

		function showAchievement(slot) {
			factory.choice_type = 'Achievements';
			listAchievement();
			factory.slot_achievement = slot;
		}

		function showBadge(slot) {
			factory.choice_type = 'Badges';
			factory.slot_badge = slot;
		}

		function pickAchievement(slot,id,image) {
			factory.choice_achievement[id] = '';
			factory.pick_achievement[factory.slot1[slot]] = '';
			factory.pick_achievement[id] = id;
			factory.choice_achievement[slot] = image;
			factory.slot1[slot] = id;
			$(".cm").removeClass("-locked");
        	$(".cm-panel.-edit-profile-search-achievement").removeClass("-open");
		}

		function pickBadge(slot,id,image) {
			factory.choice_badge[id] = '';
			factory.pick_badge[factory.slot2[slot]] = '';
			factory.pick_badge[id] = id;
			factory.choice_badge[slot] = image;
			factory.slot2[slot] = id;
			$(".cm").removeClass("-locked");
        	$(".cm-panel.-edit-profile-search-achievement").removeClass("-open");
		}

		function removeAchievement(id) {
			factory.choice_achievement[id] = '';
			factory.pick_achievement[factory.slot1[id]] = '';
			factory.slot1[id] = null;
		}

		function removeBadge(id) {
			factory.choice_badge[id] = '';
			factory.pick_badge[factory.slot2[id]] = '';
			factory.slot2[id] = null;
		}

		function saveChoiceAchievement() {
			var user_threshold_achievement = [];
			for(var i=1;i<=12;i++) {
				if(factory.slot1[i]!=null) {
					user_threshold_achievement.push({"threshod_id":factory.slot1[i],"order":i});
				}
			}
			var user_threshold_badge = [];
			for(var i=1;i<=12;i++) {
				if(factory.slot2[i]!=null) {
					user_threshold_badge.push({"threshod_id":factory.slot2[i],"order":i});
				}
			}
			choiceAchievementSave(user_threshold_achievement);
			choiceBadgeSave(user_threshold_badge);
		}

		listChoiceBadge();

		function choiceAchievementSave(user_threshold) {
			user_threshold = JSON.stringify(user_threshold);
			user_threshold = user_threshold.replace('[]','[{"threshod_id":"1","order":"100"}]');
			user_threshold = JSON.parse(user_threshold);
			var c={
				data:{
					user_threshold:user_threshold
				}
			};
			CiayoService.Api('users/achievement/save', c, function(response) {
				var ok = false;
                var data = null;
				if(response.status==200) {
					modalFactory.log('save choice achievement');
					data = response.data.c.data;
					modalFactory.log(data,'info');
					if(data.error == false) {
						ok = true;
					}
				}
				if(ok) {
					modalFactory.message(data.message);
					//factory.data_choice_achievement = user_threshold;
					listChoiceAchievement();
				} else {
					//modalFactory.message(data.message);
				}
			});
		}

		function saveChoiceBadge() {
			var user_threshold = [];
			if(user_threshold.length) {
				for(var i=1;i<=12;i++) {
					if(factory.slot2[i]!=null) {
						user_threshold.push({"threshod_id":factory.slot2[i],"order":i});
					}
				}
				choiceBadgeSave(user_threshold);
			}
		}

		function choiceBadgeSave(user_threshold) {
			user_threshold = JSON.stringify(user_threshold);
			user_threshold = user_threshold.replace('[]','[{"threshod_id":"1","order":"100"}]');
			user_threshold = JSON.parse(user_threshold);
			var c={
				data:{
					type: "badge",
					user_threshold:user_threshold
				}
			};
			CiayoService.Api('users/achievement/save', c, function(response) {
				var ok = false;
                var data = null;
				if(response.status==200) {
					modalFactory.log('save choice badge');
					data = response.data.c.data;
					modalFactory.log(data,'info');
					if(data.error == false) {
						ok = true;
					}
				}
				if(ok) {
					modalFactory.message(data.message);
					//factory.data_choice_badge = user_threshold;
					listChoiceBadge();
				} else {
					//modalFactory.message(data.message);
				}
			});
		}

		function listChoiceAchievement() {
			if($stateParams.username) {
				var user_id = factory.user_friend_id;
			} else {
				var user_id = null;
			}
			var c={
				data:{
					user_id:user_id
				}
			};
			CiayoService.Api('users/achievement/choice', c, function(response) {
				var ok = false;
                var data = null;
				if(response.status==200) {
					data = response.data.c.data;
					modalFactory.log(data,'info');
					if(data.error == false) {
						ok = true;
					}
				}
				if(ok) {
					modalFactory.log(data.message);
					factory.data_choice_achievement = data.content.data;
					var tab = factory.data_choice_achievement.length/4;
					var no = 1;
					factory.choice_achievement_tab = [];
					factory.choice_achievement_tab.push({"no":no});
					no++;
					if(factory.data_choice_achievement.length>4) {
						factory.choice_achievement_tab.push({"no":no});
					}
					no++;
					if(factory.data_choice_achievement.length>8) {
						factory.choice_achievement_tab.push({"no":no});
					}
				} else {
					modalFactory.log(data.message);
				}
			});
		}

		function listChoiceBadge() {
			if($stateParams.username) {
				var user_id = factory.user_friend_id;
			} else {
				var user_id = null;
			}
			var c={
				data:{
					type: "badge",
					user_id:user_id
				}
			};
			CiayoService.Api('users/achievement/choice', c, function(response) {
				var ok = false;
                var data = null;
				if(response.status==200) {
					data = response.data.c.data;
					modalFactory.log(data,'info');
					if(data.error == false) {
						ok = true;
					}
				}
				if(ok) {
					modalFactory.log(data.message);
					factory.data_choice_badge = data.content.data;
					var tab = factory.data_choice_badge.length/4;
					var no = 1;
					factory.choice_badge_tab = [];
					if(factory.data_choice_badge.length>4){
						for(var i=0;i<tab;i++) {
							factory.choice_badge_tab.push({"no":no});
							no++;
						}
					}
				} else {
					modalFactory.log(data.message);
				}
			});
		}

		function getDetailAchievement(id) {
			factory.achievement_detail = null;
			$('.cm').addClass('-locked');
        	$('.cm-achievement').addClass('-open');
        	var c = {
				data: {
					"id_achievement": id,
					"user_id": factory.user_id
				}
			};

			CiayoService.Api('achievement/detail', c, function(response) {
				var ok = false;
                var data = null;
				if(response.status==200) {
					modalFactory.log('detail achievement');
					data = response.data.c.data;
					modalFactory.log(data,'info');
					if(data.error == false) {
						ok = true;
					}
				}
				if(ok) {
					modalFactory.log(data.message);
					factory.achievement_detail = data.content;
				} else {
					modalFactory.log(data.message);
				}
			});
		}

		function openSearchAchievement() {
			$('.cm-achievement ._title button').fadeOut('fast');
        	$('#searchbox').slideDown('fast');
		}

		function gotoTab(no) {
			factory.select_tab = no;
			no = (no-1)*326;
			$('#content_achievement').animate({scrollTop: no},200);
		}

		function closeDetail() {
			$('.cm').removeClass('-locked');
        	$('.cm-achievement').removeClass('-open');
		}

		function seeAllAchievement() {
			factory.seeall = true
			$('.cm-profile-content ._achievement').css('max-height','none');
			$('.cm-profile-content ._badge ._content, .cm-profile-content ._achievement ._content').css('max-height','none');
		}

		function listSocialMedia() {
            var c={data:{}};
            CiayoService.Api('users/sosmed', c, function(response) {
                var ok = false;
                var data = null;
				if(response.status==200) {
					data = response.data.c.data;
					modalFactory.log(data,'info');
					if(data.error == false) {
						ok = true;
					}
				}
				if(ok) {
					modalFactory.log(data.message);
					factory.list_social_media = [];
					angular.forEach(data.content.data[0],function(value,key){
						factory.list_social_media[value.filter_id]=value;
					});
					modalFactory.log('list social media');
					modalFactory.log(data);
				} else {
					modalFactory.log(data.message);
				}
            });
            if(factory.facebook&&factory.twitter&&factory.instagram&&factory.pinterest&&factory.path) {
				factory.all_social_media = true;
			} else {
				factory.all_social_media = false;
			}
        }

        listSocialMedia();

        function saveMoreSocialMedia() {
        	var filter_id = null;
			var filter_value = null;
			var type = null;

			if(factory.select_social_media=='facebook') {
				filter_id = 480;
				factory.facebook = 'http://facebook.com/'+factory.add_more_social_media;
				factory.facebook_account = factory.add_more_social_media;
				type = 0;
			}
			if(factory.select_social_media=='twitter') {
				filter_id = 481;
				factory.twitter = 'http://twitter.com/'+factory.add_more_social_media;
				factory.twitter_account = factory.add_more_social_media;
				type = 1;
			}
			if(factory.select_social_media=='instagram') {
				filter_id = 482;
				factory.instagram = 'http://instagram.com/'+factory.add_more_social_media;
				factory.instagram_account = factory.add_more_social_media;
				type = 2;
			}
			if(factory.select_social_media=='bbm') {
				filter_id = 483;
				factory.bbm = factory.add_more_social_media;
				factory.bbm_acount = factory.add_more_social_media;
				type = 3;
			}
			if(factory.select_social_media=='whatsup') {
				filter_id = 484;
				factory.whatsup = factory.add_more_social_media;
				factory.whatsup_account = factory.add_more_social_media;
				type = 4;
			}
			if(factory.select_social_media=='skype') {
				filter_id = 485;
				factory.skype = factory.add_more_social_media;
				factory.skype_account = factory.add_more_social_media;
				type = 5;
			}
			if(factory.select_social_media=='googleplus') {
				filter_id = 486;
				factory.googleplus = factory.add_more_social_media;
				factory.googleplus_account = factory.add_more_social_media;
				type = 6;
			}
			if(factory.select_social_media=='path-01') {
				filter_id = 500;
				factory.path = 'http://path.com/'+factory.add_more_social_media;
				factory.path_account = factory.add_more_social_media;
				type = 7;
			}
			if(factory.select_social_media=='pinterest') {
				filter_id = 501;
				factory.pinterest = 'http://pinterest.com/'+factory.add_more_social_media;
				factory.pinterest_account = factory.add_more_social_media;
				type = 8;
			}
			filter_value = factory.add_more_social_media;
			var val=filter_value.split('.com/');
			if(val[1] != undefined) {
				var value = val[1];
			} else {
				var value = val[0];
			}

			var c = {
				data:{
					type:type,
					value:value
				}
			};
			CiayoService.Api('users/sosmed/save', c, function(response) {
				var ok = false;
                var data = null;
				if(response.status==200) {
					data = response.data.c.data;
					modalFactory.log(data,'info');
					var title=[];
					if(data.error == false) {
						ok = true;
					}
				}
				if(ok) {
					showModal(data.message);
					for(var i = 0; i < factory.socialType.length; i++) {
						if(factory.socialType[i]['value']==factory.select_social_media) {
					    	delete factory.socialType[i];
					    }
					}
					factory.tempSocialType = factory.socialType;
					factory.socialType = [];
					angular.forEach(factory.tempSocialType,function(value,key){
						factory.socialType.push({"name":value.name,"value":value.value});
					});

					try {factory.select_social_media = factory.socialType[0].value}catch(err){}
					factory.add_more_social_media = '';
					listSocialMedia();
				} else {
					showModal(data.message);
				}
            });
        }

		function saveMediaSocial(id) {
			var filter_id = null;
			var filter_value = null;
			var type = null;
			if(id=='facebook') {
				filter_id = 480;
				filter_value = factory.facebook_account;
				factory.facebook = factory.facebook_account;
				type = 0;
			}
			if(id=='twitter') {
				filter_id = 481;
				filter_value = factory.twitter_account;
				factory.twitter = factory.twitter_account;
				type = 1;
			}
			if(id=='instagram') {
				filter_id = 482;
				filter_value = factory.instagram_account;
				factory.instagram = factory.instagram_account;
				type = 2;
			}
			if(id=='bbm') {
				filter_id = 483;
				filter_value = factory.bbm_account;
				factory.bbm = factory.bbm_account;
				type = 3;
			}
			if(id=='whatsup') {
				filter_id = 484;
				filter_value = factory.whatsup_account;
				factory.whatsup = factory.whatsup_account;
				type = 4;
			}
			if(id=='skype') {
				filter_id = 485;
				filter_value = factory.skype_account;
				factory.skype = factory.skype_account;
				type = 5;
			}
			if(id=='googleplus') {
				filter_id = 486;
				filter_value = factory.googleplus_account;
				factory.googleplus = factory.googleplus_account;
				type = 6;
			}
			if(id=='path-01') {
				filter_id = 500;
				filter_value = factory.path_account;
				factory.path = factory.path_account;
				type = 7;
			}
			if(id=='pinterest') {
				filter_id = 501;
				filter_value = factory.pinterest_account;
				factory.pinterest = factory.pinterest_account;
				type = 8;
			}
			var val=filter_value.split('.com/');
			if(val[1] != undefined) {
				var value = val[1];
			} else {
				var value = val[0];
			}

			var c = {
				data:{
					type:type,
					value:value
				}
			};
			CiayoService.Api('users/sosmed/save', c, function(response) {
				var ok = false;
                var data = null;
				if(response.status==200) {
					data = response.data.c.data;
					modalFactory.log(data,'info');
					var title=[];
					if(data.error == false) {
						ok = true;
					}
				}
				if(ok) {
					modalFactory.message(data.message);
					for(var i = 0; i < factory.socialType.length; i++) {
						if(factory.socialType[i]['value']==id) {
					    	delete factory.socialType[i];
					    }
					}
					factory.tempSocialType = factory.socialType;
					factory.socialType = [];
					angular.forEach(factory.tempSocialType,function(value,key){
						factory.socialType.push({"name":value.name,"value":value.value});
					});

					try {factory.select_social_media = factory.socialType[0].value}catch(err){}
					listSocialMedia();
				} else {
					modalFactory.message(data.message);
				}
            });
		}

		function deleteSocialMedia(type,id) {
			if(id!=undefined) {
				var c={
	                data:{
	                    id:id
	                }
	            };
	            CiayoService.Api('users/sosmed/delete', c, function(response) {
	                var ok = false;
	                var data = null;
					if(response.status==200) {
						data = response.data.c.data;
						modalFactory.log(data,'info');
						var title=[];
						if(data.error == false) {
							ok = true;
						}
					}
					if(ok) {
						//modalFactory.message(data.message);
						if(type=='facebook') {
							factory.facebook = null;
							$('#facebook').removeClass('-add');
						}
						if(type=='twitter') {
							factory.twitter = null;
							$('#twitter').removeClass('-add');
						}
						if(type=='instagram') {
							factory.instagram = null;
							$('#instagram').removeClass('-add');
						}
						if(type=='bbm') {
							factory.bbm = null;
							$('#bbm').removeClass('-add');
						}
						if(type=='whatsup') {
							factory.whatsup = null;
							$('#whatsup').removeClass('-add');
						}
						if(type=='skype') {
							factory.skype = null;
							$('#skype').removeClass('-add');
						}
						if(type=='googleplus') {
							factory.googleplus = null;
							$('#googleplus').removeClass('-add');
						}
						if(type=='path-01') {
							factory.path = null;
							$('#path').removeClass('-add');
						}
						if(type=='pinterest') {
							factory.pinterest = null;
							$('#pinterest').removeClass('-add');
						}

						factory.socialType = [];
						if(!factory.facebook) factory.socialType.push({name: 'Facebook', value: 'facebook'});
						if(!factory.twitter) factory.socialType.push({name: 'Twitter', value: 'twitter'});
						if(!factory.instagram) factory.socialType.push({name: 'Instagram', value: 'instagram'});
						if(!factory.pinterest) factory.socialType.push({name: 'Pinterest', value: 'pinterest'});
						if(!factory.path) factory.socialType.push({name: 'Path', value: 'path-01'});
						try {factory.select_social_media = factory.socialType[0].value}catch(err){}

						listSocialMedia();
					} else {
						modalFactory.message(data.message);
					}
	            });
	        }
		}

		function editMediaSocial(type,id) {
			if(id!=undefined) {
				if(type=='facebook') {
					var value=factory.facebook_account;
					factory.facebook = 'http://facebook.com/'+value;
				}
				if(type=='twitter') {
					var value=factory.twitter_account;
					factory.twitter = 'http://twitter.com/'+value;
				}
				if(type=='instagram') {
					var value=factory.instagram_account;
					factory.instagram = 'http://instagram.com/'+value;
				}
				if(type=='bbm') {
					var value=factory.bbm_account;
				}
				if(type=='whatsup') {
					var value=factory.whatsup_account;
				}
				if(type=='skype') {
					var value=factory.skype_account;
				}
				if(type=='googleplus') {
					var value=factory.googleplus_account;
				}
				if(type=='path-01') {
					var value=factory.path_account;
					factory.path = 'http://path.com/'+value;
				}
				if(type=='pinterest') {
					var value=factory.pinterest_account;
					factory.pinterest = 'http://pinterest.com/'+value;
				}

				var val=value.split('.com/');
				if(val[1] != undefined) {
					var value = val[1];
				} else {
					var value = val[0];
				}

				if(type=='facebook') {
					factory.facebook = 'http://facebook.com/'+value;
				}
				if(type=='twitter') {
					factory.twitter = 'http://twitter.com/'+value;
				}
				if(type=='instagram') {
					factory.instagram = 'http://instagram.com/'+value;
				}
				if(type=='path-01') {
					factory.path = 'http://path.com/'+value;
				}
				if(type=='pinterest') {
					factory.pinterest = 'http://pinterest.com/'+value;
				}

				var c={
	                data:{
	                    id:id,
	                    value:value
	                }
	            };
	            CiayoService.Api('users/sosmed/update', c, function(response) {
	                var ok = false;
	                var data = null;
					if(response.status==200) {
						data = response.data.c.data;
						modalFactory.log(data,'info');
						var title=[];
						if(data.error == false) {
							ok = true;
						}
					}
					if(ok) {
						modalFactory.message(data.message);
						listSocialMedia();
					} else {
						modalFactory.message(data.message);
					}
	            });
	        }
		}

		function showModal(message) {
			factory.modal_info=message;
			$('.-info').addClass('-open');
		}

		function follow() {
			var follow = factory.status_follow?false:true;
			var c={
				data:{
					user_id:factory.user_id,
					follow:follow
				}
			};
			CiayoService.Api('users/follow', c, function(response) {
				var ok = false;
                var data = null;
				if(response.status==200) {
					data = response.data.c.data;
					modalFactory.log(data,'info');
					var title=[];
					if(data.error == false) {
						ok = true;
					}
				}
				if(ok) {
					modalFactory.message(data.message);
					factory.status_follow = !factory.status_follow;
				} else {
					modalFactory.message(data.message);
				}
			});
		}

		function addfriend() {
			var c={
				data:{
					"friend_id": factory.user_id
				}
			};
			CiayoService.Api('users/relation/create', c, function(response) {
				var ok = false;
                var data = null;
				if(response.status==200) {
					data = response.data.c.data;
					modalFactory.log(data,'info');
					if(data.error == false) {
						ok = true;
					}
				}
				if(ok) {
					factory.status_add = true;
					factory.status_addstatus = true;
					factory.status_follow = true;
					modalFactory.message(data.message);
				} else {
					modalFactory.message(data.message);
				}
			});
		}

		function approvefriend() {
			if(!factory.status_approve) {
				if(factory.status_add&&factory.status_addstatus) {
					var c={
						data:{
							friend_id:factory.user_id
						}
					};
					CiayoService.Api('users/relation/cancel', c, function(response) {
						var ok = false;
		                var data = null;
						if(response.status==200) {
							data = response.data.c.data;
							modalFactory.log(data,'info');
							if(data.error == false) {
								ok = true;
							}
						}
						if(ok) {
							factory.status_approve = false;
	                		factory.status_add = false;
	                		factory.status_follow = false;
	                		factory.status_addstatus = false;
							modalFactory.message(data.message);
						} else {
							modalFactory.message(data.message);
						}
					});
				} else {
					var c={
						data:{
							user_relation_id:factory.user_id
						}
					};
					CiayoService.Api('users/relation/confirm', c, function(response) {
						var ok = false;
		                var data = null;
						if(response.status==200) {
							data = response.data.c.data;
							modalFactory.log(data,'info');
							if(data.error == false) {
								ok = true;
							}
						}
						if(ok) {
							factory.status_approve = true;
	                		factory.status_add = true;
	                		factory.status_follow = true;
							modalFactory.message(data.message);
						} else {
							modalFactory.message(data.message);
						}
					});
				}
			}
		}

		factory.overview_content = true;

		function profileContent(id) {

			factory.state = id;
			if(id == 4) {
				listAchievement();
				listBadge();
			}
			/*
			var $inner = $("._profile-inner-content");
			id--;	
	        $inner.animate({
	            left: "-"+id+"00%"
	        },200);
	        */
		}

		function listPrefix() {
			var c={
                data:{
                    limit:500,
                    offset:0
                }
            };
            CiayoService.Api('users/setting/prefix_phone_number', c, function(response) {
                factory.list_prefix = response.data.c.data.content.list_prefix_phone_number;
            });
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

						//factory.data_profile = data.content;

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

						//console.log(display_name);
						
						factory.background_avatar_parent	= 	data.content.users_avatar.background_avatar;
						factory.avatar_parent				= 	data.content.users_avatar.avatar;
						factory.user_display_name_parent 	= 	display_name;
						factory.user_full_name_parent 		= 	full_name;
						factory.gender_name_parent 			= 	gender_name;
					}
					
				});

				factory.myprofile = false;

			}else{

				var ok = false;
				var c = {
					data: {
						"username": ''
					}
				}

				CiayoService.Api('users/info', c, function(response) {
					if(response.status==200){
						var data = response.data.c.data;
						factory.user_friend_id = '';
						getFriendList(true);
						getMutualList(true);

						//factory.data_profile = data.content;

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

						//console.log(display_name);
						
						factory.background_avatar_parent	= 	data.content.users_avatar.background_avatar;
						factory.avatar_parent				= 	data.content.users_avatar.avatar;
						factory.user_display_name_parent 	= 	display_name;
						factory.user_full_name_parent 		= 	full_name;
						factory.gender_name_parent 			= 	gender_name;
					}
					
				});

				
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
				var keyword = '';
				
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
				var keyword = '';
				
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

		function getSearchFriend(user_id){
			searchFriendDrawer.open(user_id);
		}

		function goto_back(){
			if($rootScope.backState == 'avatar'){
				$rootScope.backState = '';
				$state.go('menu');
			} else {
				window.history.back();
			}
		}

		return factory;
	}
})();