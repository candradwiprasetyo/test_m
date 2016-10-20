(function() {
'use strict';

	angular
		.module('app')
		.controller('WelcomeController', WelcomeController);

	WelcomeController.$inject = ['CiayoService', 'AuthService', '$state', '$cookieStore', '$stateParams','languageFactory'];
	function WelcomeController(CiayoService, AuthService, $state, $cookieStore, $stateParams, languageFactory) {
		var vm = this;

		vm.registerType = 'email';
		vm.loginType = 'email';
		vm.forPassType = 'email';

		vm.validateEmail = validateEmail;
		vm.validatePassword = validatePassword;
		vm.checkPass = checkPass;
		vm.checkRePass = checkRePass;
		vm.validatePhone = validatePhone;

		vm.register = register;
		vm.login = login;
		vm.forgotPassword = forgotPassword;
		vm.resetPassword = resetPassword;
		
		function validateEmail(name, val) {
			var email = val || '';
			var elem = selectElement('input[name='+name+']');
			
			if(email && email.match(/(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g)) {
				elem.removeClass('error');
				elem.addClass('success');
				vm.isEmailValidated = true;
			} else if(email){
				elem.removeClass('success');
				elem.removeClass('error');
				setTimeout(function(){
					elem.addClass('error');
				}, 1);
				
				vm.isEmailValidated = false;
			} else {
				elem.removeClass('success');
				elem.removeClass('error');
			}
		}

		function validatePassword(name, val){
			var pass = val || '';
			var elem = selectElement('input[name='+name+']');
			
			if(pass){
				if(pass.length > 7){
					$('#'+name+' div:nth-child(2)').addClass('active');
					if(pass.match(/^[A-Za-z\d\!\@\#\$\%\^\*\{\[\}\}\:\;\,\.\?\+\-\_\=\~\']{8,}$/)){
						$('#'+name+' div:nth-child(3)').addClass('active');
						vm.isPassValidated = true;
					} else {
						$('#'+name+' div:nth-child(3)').removeClass('active');
						vm.isPassValidated = false;
					}
				} else {
					$('#'+name+' div:nth-child(3)').removeClass('active');
					$('#'+name+' div:nth-child(2)').removeClass('active');
					vm.isPassValidated = false;
				}
			}
		}

		function checkPass(name, val){
			var pass = val || '';
			var elem = selectElement('input[name='+name+']');
			
			if(pass && pass.match(/^[A-Za-z\d\!\@\#\$\%\^\*\{\[\}\}\:\;\,\.\?\+\-\_\=\~\']{8,}$/)) {
				elem.removeClass('error');
				elem.addClass('success');
				vm.isPassValidated = true;
			} else if(pass){
				elem.removeClass('success');
				elem.removeClass('error');
				setTimeout(function(){
					elem.addClass('error');
				}, 1);
				
				vm.isPassValidated = false;
			} else {
				elem.removeClass('success');
				elem.removeClass('error');
			}
		}
		
		function checkRePass() {
			var elem = selectElement('input[name=rePass]');
			if((vm.newPass == vm.rePass) && vm.rePass) {
				elem.removeClass('error');
				elem.addClass('success');
				vm.isRePassValidated = true;
			} else {
				elem.removeClass('success');
				elem.removeClass('error');
				setTimeout(function(){
					elem.addClass('error');
				}, 1);
				vm.isRePassValidated = false;
			}
		}

		function validatePhone(name, val) {
			var phone = val;
			var elem = selectElement('input[name='+name+']');
			
			if(!isNaN(phone)) {
				elem.removeClass('error');
				elem.addClass('success');
				
				vm.isPhoneValidated = true;
			} else if(phone){
				elem.removeClass('success');
				elem.removeClass('error');
				setTimeout(function(){
					elem.addClass('error');
				}, 1);
				
				vm.isPhoneValidated = false;
			} else {
				elem.removeClass('success');
				elem.removeClass('error');
			}
		}

		function register() {
			var ref = $stateParams.ref;
			var info = $state.current.name=='popcon'?1:0;
			var email = vm.regEmail;
			var phone = '';
			if(vm.regPhone){
				var pclen = vm.regPC.length;
				phone = String(vm.regPhone);
				if(phone.charAt(0) == '0'){
					phone = vm.regPC + '-' +phone.substr(1);
				} else if(phone.substring(0,pclen) == vm.regPC){
					phone = vm.regPC + '-' +phone.substr(pclen);
				} else {
					phone = vm.regPC + '-' +phone;
				}
			}
			if(vm.registerType === 'email') {
				var pass = vm.regEPass;
			} else {
				var pass = vm.regPPass;
			}
			if(vm.registerType == 'email' && !vm.isEmailValidated) {
				vm.errMsg = 'Email tidak valid';
			} else if(vm.registerType == 'phone' && !vm.isPhoneValidated) {
				vm.errMsg = 'Phone tidak valid';
			} else if(!vm.isPassValidated) {
				vm.errMsg = 'Password tidak valid';
			} else {
				vm.showLoading = true;
				AuthService.Register(
					vm.registerType,
					email,
					phone,
					pass,
					info,
					ref
				).then(
					function(data){
						vm.showLoading = false;
						if(data.status!=-1){
							if(data.error) {
								if(vm.registerType == 'email') {
									vm.errMsg = data.message;
								} else {
									vm.errMsg = data.message;
								}
								setTimeout(function(){
									vm.errMsg = '';
								}, 2000);
								vm.inputFocus(vm.registerType=='email'?'regEmail':'regPhone');
							} else {
								$state.go('create-avatar.gender');
							}
						} else {
							vm.errMsg = 'Network Error';
							setTimeout(function(){
								vm.errMsg = '';
							}, 2000);
						}
					}
				);
			}
			setTimeout(function(){
				vm.errMsg = '';
			}, 3000);
			vm.inputFocus(vm.registerType=='email'?'regEmail':'regPhone');
		}

		function login() {
			$cookieStore.remove('token');
			var email = vm.logEmail;
			var pass = vm.loginType==='email'?vm.logEPass:vm.logPPass;
			var phone = '';
			if(vm.logPhone){
				var pclen = vm.logPC.length;
				phone = String(vm.logPhone);
				if(phone.charAt(0) == '0'){
					phone = vm.logPC + '-' +phone.substr(1);
				} else if(phone.substring(0,pclen) == vm.logPC){
					phone = vm.logPC + '-' +phone.substr(pclen);
				} else {
					phone = vm.logPC + '-' +phone;
				}
			}
			vm.showLoading = true;
			AuthService.Login(
				vm.loginType,
				email,
				phone,
				pass
			).then(
				function(data){
					vm.showLoading = false;
					if(!data.error && data.content) {
						languageFactory.getLanguage();

						if(data.content.profile_completed){
							$state.go('timeline');
						} else {
							$state.go('create-avatar.name');
						}
					} else {
						vm.errMsg = data.message || 'Network Error';
						
						vm.inputFocus(vm.loginType=='email'?'logEPass':'logPPass');
					}
				}
			);
			// AuthService.Login(c, function(response) {
			// 	vm.showLoading = false;
			// 	if(!response.error && response.content) {
			// 		languageFactory.getLanguage();

			// 		if(response.content.profile_completed){
			// 			$state.go('timeline');
			// 		} else {
			// 			$state.go('create-avatar.name');
			// 		}
			// 	} else {
			// 		vm.errMsg = response.message || 'Unknown Error';
					
			// 		vm.inputFocus(vm.loginType=='email'?'logEPass':'logPPass');
			// 	}
			// });
		}

		function forgotPassword() {
			if(vm.forPassType == 'email') {
				var email = vm.fpEmail;
				if(email){
					email = email.toLowerCase();
				}
			} else {
				var phone = '';
				if(vm.fpPhone){
					var pclen = vm.fpPC.length;
					phone = vm.fpPhone+'';
					if(phone.charAt(0) == '0'){
						phone = vm.fpPC+'-'+phone.substr(1);
					} else if(phone.substring(0,pclen) == vm.fpPC){
						phone = vm.fpPC+'-'+phone.substr(pclen);
					} else {
						phone = vm.fpPC+'-'+phone;
					}
				}
			}
			vm.showLoading = true;
			AuthService.ForgotPassword(
				vm.forPassType,
				email,
				phone
			).then(
				function(data){
					console.log(data);
					if(!data.error){
						$state.transitionTo('forgot-password-success');
					} else {
						vm.errMsg = data.message || 'Unknown Error';
						setTimeout(function(){
							vm.errMsg = null;
						}, 3000);
						vm.inputFocus(vm.forPassType=='email'?'fpEmail':'fpPhone');
					}
				}
			);
			// CiayoService.Api('password', c, function(response){
			// 	vm.showLoading = false;
			// 	if(response.data.c.data.error){
			// 		vm.errMsg = response.data.c.data.message.email?response.data.c.data.message.email[0]:response.data.c.data.message.phone[0];
			// 		setTimeout(function(){
			// 			vm.errMsg = null;
			// 		}, 3000);
			// 		vm.inputFocus(vm.forPassType=='email'?'fpEmail':'fpPhone');
			// 	} else {
			// 		$state.transitionTo('forgot-password-success');
			// 	}
			// });
		}
		
		function resetPassword() {
			var token = $stateParams.token;
			if(vm.isRePassValidated && vm.isPassValidated){
				var c = {
					data: {
						password: vm.newPass,
						confirm_password: vm.rePass,
						password_token: token
					}
				};
				
				CiayoService.Api('password/change', c, function(response){
					if(response.status == 200){
						var data = response.data.c.data;
						if(data.error){
							vm.errMsg = data.message;
							setTimeout(function(){
								vm.errMsg = null;
							}, 3000);
						} else {
							$state.transitionTo('welcome');
						}
					} else {
						alert(response.status+': '+response.statusText);
					}
				});
			} else if(!vm.isPassValidated){
				vm.errMsg = "Password Min 8 Character";
				setTimeout(function(){
					vm.errMsg = null;
				}, 3000);
				vm.inputFocus('newPass');
			} else {
				vm.errMsg = "Password Not Match";
				setTimeout(function(){
					vm.errMsg = null;
				}, 3000);
				vm.inputFocus('rePass');
			}
		}

		// Init Function
		function getPhoneCode() {
			var c = {
				data: {
				}
			};
			
			CiayoService.Api('users/setting/prefix_phone_number', c, function(response){
				vm.listPhoneCode =	response.data.c.data.content.list_prefix_phone_number;
			});
		}
		
		getPhoneCode();

		// Addtional Function
		function selectElement(el) {
			return angular.element(document.querySelectorAll(el));
		}

		vm.inputFocus = inputFocus;
		function inputFocus(el) {
			$('input[name='+el+']').removeClass('error');
			setTimeout(function(){
				$('input[name='+el+']').focus();
			},250);
		}

		if($cookieStore.get('language')) {
			vm.language = String($cookieStore.get('language'));
		} else {
			vm.language = String(2);
		}

		vm.changeLanguage = changeLanguage;
		function changeLanguage(){
        	var language = vm.language;
        	$cookieStore.put('language', language);
        	vm.language = null;
        	languageFactory.changeLanguage(parseInt(language), function(language) {
        		vm.language = String(language);
        	});
        }

  	}
})();