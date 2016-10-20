(function () {
	'use strict';
	angular
	.module('apiModule',[])
	.factory('apiConnector',apiConnector);
	
	function apiConnector(){
		var apiConnector = this;
		angular.extend(apiConnector,{
			
		});
		/*
		data=object
		callback=function(response){}
		*/
		function request(request_url,data,callback,bypass_url){
			
			if(!Date.now) {
				Date.now = function() {
					return new Date().getTime();
				}
			}
			
			var url = ((bypass_url||false)?API_SERVER:'')+request_url;
			
			//ambil lang dari factory lang
			var lang=2;
			
			var c = data || {};
			angular.extend(c,{
				timestamp : Date.now(),
				app: SCREEN_TYPE,
				screen_type : SCREEN_TYPE,
				image_type : '',
				latitude:'',
				longitude:'',
				language:lang;
			});
			var json = angular.toJson(c);
			var send_data = 'c='+encodeURIComponent(json);
			
			var header={
				"Content-Type": "application/x-www-form-urlencoded"
			};
			if(token){
				header["Authorization"] =  'Bearer '+token;
			}
			
			$http({
				method : 'POST',
				url: url,
				data:send_data,
				headers:header
			})
			.then(function(response){
				if(response.status==200){
					var data = response.data.c.data;
					//cek token invalid
					//cek user not found
					//put new token
				}
			},function(response){
				
			});
		}
		return apiConnector;
	}
})();