(function () {
	'use strict';
	angular
	.module('WelcomeModule',[])
	.factory('welcomeFactory',welcomeFactory);
	
	function welcomeFactory(){
		var welcome = this;
		var ciayo = window.ciayo;
		var welcomeModel = new (ciayo.model('WelcomeModel'))();
		angular.extend(welcome,{
			data:welcomeModel.data,
			login:login
		})
		
		
		function login(){
			var status_code = welcomeModel.login();
			if(status_code==1){
				//api
				
				return status_code;
			}
			return status_code;
		}
		return this;
	}
})();