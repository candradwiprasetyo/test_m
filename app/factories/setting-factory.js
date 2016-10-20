(function() {
	'use strict';

	angular
		.module('app')
		.factory('settingFactory', settingFactory);

	settingFactory.$inject = ['$cookieStore', '$rootScope', '$state', '$stateParams', 'modalFactory', 'CiayoService', 'languageFactory', 'settingConnector'];

	function settingFactory($cookieStore, $rootScope, $state, $stateParams, modalFactory, CiayoService, languageFactory, settingConnector) {
		function factory(){
			var factory = this;
			angular.extend(factory,{
			info: {
				data:[],
				list:[]
			},
			prefix: {
				list:[]
			},
			edit_prefix:'',
			resend_count_email:0,
			resend_count_phone:0,
			load_setting:false,
			timeline_privacy:'Public',
			default_post_privacy:'Public',
			who_can_find_privacy:'Public',
			who_can_add_me_privacy:'Public',
			userBasicInfo:userBasicInfo,
			verifyAccount:verifyAccount,
			resendCodeEmail:resendCodeEmail,
			resendCodePhone:resendCodePhone,
			editEmail:editEmail,
			editPhone:editPhone,
			showEmail:showEmail,
			showPhone:showPhone,
			generalSettings:generalSettings,
			listPrefixPhone:listPrefixPhone,
			changePassword:changePassword,
			changePreference:changePreference,
			saveEditAccount:saveEditAccount,
			changeLanguage:changeLanguage,
			logout:logout,

			userDeactive:userDeactive,
			deleteConfirm:deleteConfirm,
			userDelete:userDelete,
			validatePass:validatePass,
			showTooltip:showTooltip,
			pasteCode:pasteCode,
			sendCode:sendCode,
			loginNotification:loginNotification,
			changeEmailShow:changeEmailShow,
			showModal:showModal
		});

		function userBasicInfo(username) {
			settingConnector.userInfo(username).then(function(data){
				if(data.error==false){
					factory.info.list=[];
					factory.info.list = data.content.users_info;
					angular.forEach(factory.info.list, function(value,key) {
						factory.info.data[value.filter_name] = value;
					})
					factory.load_info = true;
					callback();
				}else{
					modalFactory.message(data.message);
				}
			},function(response){
				
			})
		}

        function pasteCode(event) {
            var item = event.clipboardData.items[0];
            item.getAsString(function (data) {
                var code = data;
                code_1.value = code.charAt(0);
                code_2.value = code.charAt(1);
                code_3.value = code.charAt(2);
                code_4.value = code.charAt(3);
                factory.code_1 = code.charAt(0);
                factory.code_2 = code.charAt(1);
                factory.code_3 = code.charAt(2);
                factory.code_4 = code.charAt(3);
                verifyAccount();
            });
        }

        function sendCode() {
            if(code_1.value && code_2.value && code_3.value && code_4.value) {
                verifyAccount();
            }
        }

        function verifyAccount() {
        	var confirmation_code = factory.code_1 + "" + factory.code_2 + "" + factory.code_3 + "" + factory.code_4;
        	settingConnector.verifyAccount(confirmation_code).then(function(data) {
				$('.cm-setting-wrp').hide();
				$('.-account-verification').fadeOut('slow', function(){
					$('.-account-verification-success').fadeIn('slow');
				});
			},function(response){
				modalFactory.message(data.message);
			})
        }

        function resendCodeEmail() {
        	factory.resend_email_proccess=true;
        	factory.resend_count_email++;
        	var c={
                data:{
                    email:factory.email_address
                }
            };
            CiayoService.Api('settings/sendingverify/email', c, function(response) {
                var ok = false;
                var data = null;
				if(response.status==200) {
					data = response.data.c.data;
					modalFactory.log(data,'info');
					if(data.error == false) {
						ok = true
					}
				}
				if(ok) {
					factory.resend_email_proccess=false;
					showModal(data.message);
				} else {
					factory.resend_email_proccess=false;
					showModal(data.message);
				}
            })
        }

        function resendCodePhone(type) {
        	if(!factory.send_code_phone) {
	        	factory.resend_phone_proccess=true;
	        	if(type) { 
	        		factory.resend_count_phone++;
	        	} else {
	        		factory.send_code_phone = true;
	        	}
	        	var phone_number = factory.prefix_phone+'-'+factory.phone;
	        	phone_number = phone_number.replace('+','');
	        	var c={
	                data:{
	                    phone_number:phone_number
	                }
	            };
	            CiayoService.Api('settings/sendingverify/phone', c, function(response) {
	                var ok = false;
	                var data = null;
					if(response.status==200) {
						data = response.data.c.data;
						modalFactory.log(data,'info');
						if(data.error == false) {
							ok = true
						}
					}
					if(ok) {
						factory.resend_phone_proccess=false;
						if(type) showModal(data.message);
					} else {
						factory.resend_phone_proccess=false;
						if(type) showModal(data.message);
					}
	            })
	        }
        }

		function editEmail() {
			factory.change_email_proccess = true;
			var c = {
				data : {
					email:factory.edit_email_address
				}
			};
			CiayoService.Api('settings/email', c, function(response) {
				var ok = false;
                var data = null;
				if(response.status==200) {
					data = response.data.c.data;
					modalFactory.log(data,'info');
					if(data.error == false) {
						ok = true
					}
				}
				if(ok) {
					factory.change_email_succsess = true;
					factory.old_email_address = factory.email_address;
					factory.email_address = factory.edit_email_address;
					$(".-setting-mobile-number-changed").addClass("-open");
					factory.change_email_proccess = false;
				} else {
					factory.change_email_succsess = false;
					factory.change_email_failed = data.message;
					$(".-setting-mobile-number-changed").addClass("-open");
					factory.change_email_proccess = false;
				}
			});
		}

		function editPhone() {
			factory.change_phone_proccess = true;
			var c = {
				data : {
					phone_number:factory.edit_prefix+'-'+factory.edit_phone
				}
			};
			CiayoService.Api('settings/phone', c, function(response) {
				var ok = false;
                var data = null;
				if(response.status==200) {
					data = response.data.c.data;
					modalFactory.log(data,'info');
					if(data.error == false) {
						ok = true
					}
				}
				if(ok) {
					factory.change_phone_proccess = false;
					factory.change_phone_succsess = true;
					factory.old_prefix = factory.prefix_phone;
					factory.new_prefix = factory.edit_prefix;
					factory.old_phone = factory.phone;
					factory.phone_number = factory.edit_phone;
					$(".-setting-mobile-number-changed").addClass("-open");
				} else {
					factory.change_phone_proccess = false;
					factory.change_phone_succsess = false;
					factory.change_phone_failed = data.message;
					$(".-setting-mobile-number-changed").addClass("-open");
				}
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

		function saveEditAccount() {
			var c = {
				data : {
					email:factory.email_address
				}
			};
			CiayoService.Api('settings/email', c, function(response) {
				var data = null;
				data = response.data.c.data;
				modalFactory.log(data,'info');
			});
			var phone_number = factory.prefix_phone.replace('+','')+'-'+factory.phone_number;
			var c = {
				data : {
					phone_number:phone_number
				}
			};
			CiayoService.Api('settings/phone', c, function(response) {
				var data = null;
				data = response.data.c.data;
				modalFactory.log(data,'info');
			});
			showModal('success change profile settings');
		}

		function generalSettings() {
	    	//$('.loader-wrp').show();
			setTimeout(function(){
				var c = {
					data : {
					}
				};
				CiayoService.Api('settings', c, function(response) {
					var ok = false;
					var data = null;
					var general_settings = null;
					var edit_account = null;
					if(response.status==200) {
						data = response.data.c.data;
						modalFactory.log(data,'info');
						if(data.error == false) {
							ok = true
						}
					}
					if(ok) {
						general_settings = data.content.list_setting.general_setting;

						factory.parallax_view_timeline = general_settings.card_setting.parallax_view;
						factory.comment = general_settings.notification_setting.comment;
						factory.connection_request = general_settings.notification_setting.connection_request;
						factory.notification_tone = general_settings.notification_setting.notifications_tone;
						factory.reset_password = general_settings.email_setting.reset_password;
						factory.login_failed = general_settings.email_setting.login_failed;
						factory.deactive_account = general_settings.email_setting.deactive_account;
						factory.delete_account = general_settings.email_setting.delete_account;
						factory.new_features = general_settings.email_setting.new_features;
						factory.language = String(general_settings.languages_setting.lang.value);

						edit_account = data.content.list_setting.edit_account;

						factory.login_notification = edit_account.login_notification.value;
						factory.email_address = edit_account.email_address.value;
						factory.edit_email_address = factory.email_address;
						factory.verify_status = edit_account.verified;
						factory.prefix_phone = edit_account.phone_number.code;
						if(factory.prefix_phone==null) factory.prefix_phone='';
						try{factory.phone_number = parseInt(edit_account.phone_number.number.replace('-',''))}catch(err){}
						try{factory.phone = parseInt(edit_account.phone_number.number.replace('-',''))}catch(err){}

						factory.email_tmp = factory.email_address;
						factory.phone_tmp = factory.phone_number;

						factory.show_email = data.content.list_setting.edit_account.show_email.value;
						factory.show_phone = data.content.list_setting.edit_account.show_phone.value;

						listPrefixPhone();
						factory.load_setting=true;
						// $('.loader-wrp').fadeOut('slow');
						// $('.-setting').css('margin-left','20px');
						// $('.-setting').show().animate({'margin-left':'0','opacity':'1'});
					} else {
						
					}
				});
			}, 500);
		}

		function listPrefixPhone() {
            var c={
                data:{
                    limit:500,
                    offset:0
                }
            };
            CiayoService.Api('users/setting/prefix_phone_number', c, function(response) {
                var ok = false;
                var data = null;
				if(response.status==200) {
					data = response.data.c.data;

					modalFactory.log(data,'info');

					if(data.error == false) {
						ok = true
					}
				}
				if(ok) {
					factory.prefix.list = data.content.list_prefix_phone_number;
				} else {

				}
            });
        }

        function userDeactive() {
        	var c = {
				data : {
					deactive:true
				}
			};
			CiayoService.Api('settings/deactive', c, function(response) {
				var ok = false;
                var data = null;
				if(response.status==200) {
					data = response.data.c.data;

					modalFactory.log(data,'info');

					if(data.error == false) {
						ok = true
					}
				}
				if(ok) {
					showModal(data.message);
				} else {
					showModal(data.message);
				}
			});
        }

        function deleteConfirm() {
        	var c = {
				data : {
				}
			};
			CiayoService.Api('settings/deleteconfirm', c, function(response) {
				var ok = false;
                var data = null;
				if(response.status==200) {
					data = response.data.c.data;

					modalFactory.log(data,'info');

					if(data.error == false) {
						ok = true
					}
				}
				if(ok) {
					showModal(data.message);
				} else {
					showModal(data.message);
				}
			});
        }

        function userDelete() {
        	var c = {
				data : {
					delete_token:$stateParams.token
				}
			};
			CiayoService.Api('settings/delete', c, function(response) {
				var ok = false;
                var data = null;
				if(response.status==200) {
					data = response.data.c.data;

					modalFactory.log(data,'info');

					if(data.error == false) {
						ok = true
					}
				}
				if(ok) {
					showModal(data.message);
					$cookieStore.remove('token');
                    $state.go('welcome');
				} else {
					showModal(data.message);
				}
			});
        }

        if($stateParams.menu=='delete' && $stateParams.token) {
        	alert($stateParams.token);
            userDelete();
        }

        function changePassword() {
        	settingConnector.changePassword(factory.old_password, factory.new_password, factory.confirm_new_password)
        	.then(function(data) {
        		modalFactory.message(data.message);
        	}, function(response) {
        		//modalFactory.message(data.message);
        	})
        }

        function loginNotification(){
        	var value=(factory.login_notification)?1:0;
        	modalFactory.log(value,'info');
        }

        function changeLanguage(){
        	var language = factory.language;
        	$cookieStore.put('language', language);
        	factory.language = null;
        	languageFactory.changeLanguage(parseInt(language), function(language) {
        		factory.language = String(language);
        	});
        }

        function validatePass(id){
        	//factory.password_valid=false;
        	if(id == 'old_password') {
                var pass = factory.old_password;
                if (pass.length > 7) {
		            if (pass&&pass.match(/^[A-Za-z\d\!\@\#\$\%\^\*\{\[\}\}\:\;\,\.\?\+\-\_\=\~\']{8,}$/)) {
		                factory.old_password_valid=true;
		                $('.old_password').removeClass('error');
		            } else {
		                factory.old_password_valid=false;
		            }
		        } else {
		        	factory.old_password_valid=false;
		        }
            } 
            if(id == 'new_password') {
                var pass = factory.new_password;
                if (pass.length > 7) {
		            if (pass&&pass.match(/^[A-Za-z\d\!\@\#\$\%\^\*\{\[\}\}\:\;\,\.\?\+\-\_\=\~\']{8,}$/)) {
		                factory.new_password_valid=true;
		                $('.new_password').removeClass('error');
		            } else {
		                factory.new_password_valid=false;
		            }
		        } else {
		        	factory.new_password_valid=false;
		        }
            }
            if(id == 'confirm_new_password') {
                var pass = factory.confirm_new_password;
                if (pass.length > 7) {
		            if (pass&&pass.match(/^[A-Za-z\d\!\@\#\$\%\^\*\{\[\}\}\:\;\,\.\?\+\-\_\=\~\']{8,}$/)) {
		                factory.confirm_new_password_valid=true;
		                $('.confirm_new_password').removeClass('error');
		            } else {
		                factory.confirm_new_password_valid=false;
		            }
		        } else {
		        	factory.confirm_new_password_valid=false;
		        }
                if(factory.new_password==factory.confirm_new_password) {
        			factory.password_not_match=false;
        		}
            }
        }

        function showTooltip(type,id) {
        	if(type == 'old_password') {
                var tooltip = $('#tooltip_old_password');
            } 
            if(type == 'new_password') {
                var tooltip = $('#tooltip_new_password');
            }
            if(type == 'confirm_new_password') {
            	var tooltip = $('#tooltip_confirm_new_password');
            }
        	if(id){
        		tooltip.slideDown('fast');
        	} else {
        		tooltip.slideUp('fast');
        		if(factory.old_password&&!factory.old_password_valid){
        			$('.old_password').addClass('error');
        		}
        		if(factory.new_password&&factory.old_password&&!factory.new_password_valid){
        			$('.new_password').addClass('error');
        		}
        		if(factory.confirm_new_password&&!factory.confirm_new_password_valid){
        			$('.confirm_new_password').addClass('error');
        		}
        	}
        }

        function changePreference(type,val) {
			var value = (val)?1:0;
			settingConnector.setPreference(value, type).then(function(data) {
			
			},function(response){
				
			})
        }

		function logout() {
			settingConnector.logout().then(function(data) {
				$cookieStore.remove('token');
                $state.go('welcome');
			},function(response){
				$cookieStore.remove('token');
            	$state.go('welcome');
			})
		}

		function changeEmailShow() {
			$("._change-content").slideDown('fast');
		}

		function showModal(message) {
			factory.modal_info=message;
			$('.-info').addClass('-open');
		}
		}
		return factory;
	}
})();