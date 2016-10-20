(function () {
	'use strict';

	angular
		.module('app')
		.factory('CiayoService', CiayoService);

	CiayoService.$inject = ['$http', '$cookieStore', '$state', '$q'];

	function CiayoService($http, $cookieStore, $state, $q) {

		//$http.defaults.useXDomain = true;
		// Setting CORS 
		//$http.defaults.useXDomain = true
		var service = {
			Api: Api,
			get: get
				// Socket:Socket
		};

		return service;

		////////////////

		// Fungsi untuk req ke API
		function Api(_url, c, callback, force_url) {
			// URL API

			//var url = 'http://api.ciayo.dcc/'+url;
			var url = API_SERVER + _url;
			if (force_url) {
				url = _url;
			}
			//var url = 'https://apibete.ciayo.com/'+url;
			//var url = 'http://192.168.35.245:8000/'+url;
			//			var url = 'http://192.168.35.56:8000/'+url;

			// C JSON Object
			if ($cookieStore.get('language')) {
				var lang = $cookieStore.get('language');
			} else {
				var lang = 2;
			}
			var c = c;
			angular.extend(c, {
				timestamp: Date.now(),
				app: SCREEN_TYPE,
				screen_type: SCREEN_TYPE,
				image_type: '',
				latitude: '-6.225652',
				longitude: '106.74576',
				language: lang
			});
			//c.timestamp = Date.now();
			//			c.app = 'Web';
			//			c.screen_type = 'Web';
			//			c.language = 1;
			//			c.image_type = '';
			//			c.latitude = '-6.225652';
			//			c.longitude = '106.74576';
			if (!Date.now) {
				Date.now = function () {
					return new Date().getTime();
				}
			}

			// Set Data
			var json = angular.toJson(c);
			json = encodeURIComponent(json);
			var data = 'c=' + json;

			// get token
			var token = $cookieStore.get('token') || '';
			var header = {};
			if (token) {
				header = {
					"Content-Type": "application/x-www-form-urlencoded",
					"Authorization": 'Bearer ' + token
				};
			} else {
				header = {
					"Content-Type": "application/x-www-form-urlencoded"
				};
			}
			var log_data = {
					url: url,
					request: data,
					response: {}
				}
				// Req with $http
			$http({
					method: 'POST',
					url: url,
					data: data,
					headers: header
				})
				.then(function (response) {
					//console.log(response);
					var data = response.data.c.data;
					if (data.message == 'token_invalid' || data.message == 'token_not_provided') {
						$state.transitionTo('welcome');
						$cookieStore.remove('token');
					}
					var ok = 0;
					log_data.response = response.status;
					if (response.status == 200) {
						var data = response.data.c.data;
						if (data.token != null) {
							$cookieStore.put('token', data.token);
						}

						if (data.error != undefined) {
							ok = 1;
						} else {
							if (data.message == 'token_invalid') {
								$cookieStore.remove('token');
								$cookieStore.remove('user_id');
								$cookieStore.remove('gender');
								$state.transitionTo('welcome');
								ok = -1;
							}
						}
					} else {
						var data = response.data.c.data;

					}
					if (ok == 1) {
						callback(response); //log(log_data);
					} else
					if (ok == 0) {
						callback(response);
						log(log_data);
					}
				}, function (response) {
					if (_url == 'users/info') {
						var data = response.data;
						if (data['c'] != undefined)
							if (c.data.username == '' && data.c.data.message == 'user_not_found') {
								$cookieStore.remove('token', token);
								$cookieStore.remove('gender', gender);
								$cookieStore.remove('profile', profile);
								return;
							}
					}
					// Kenapa ini di tambah ?
					// if(response.data==undefined || !response.data){
					// 	$state.transitionTo('welcome');
					// 	$cookieStore.remove('token');
					// 	return;
					// }
					console.log(response);
					if (response.data) {
						var data = response.data.c.data;
						if (data.message == 'token_invalid' || data.message == 'token_not_provided') {
							// $state.transitionTo('welcome');
							$cookieStore.remove('token');
							//$state.reload();
						}
						log(log_data);
					}
					callback(response);
				});

			function log(log_data) {
				//				$http({
				//					method: 'POST',
				////					url: 'https://beta.ciayo.com/ciayo-errorlog/errorlog.php',
				//					url:'http://localhost/test.php',
				//					data:JSON.stringify(log_data),
				//				}).then(function successCallback(response) { }, function errorCallback(response) { });
				$.post('https://fr-logs.ciayo.com/errorlog.php', log_data);

			}
		}

		function get(_url, data, force_url) {
			var deferred = $q.defer();
			if (!Date.now) {
				Date.now = function () {
					return new Date().getTime();
				}
			}

			var url = (force_url ? '' : API_SERVER) + _url;

			var c = {
				data: data || {},
				timestamp: Date.now(),
				app: SCREEN_TYPE,
				screen_type: SCREEN_TYPE,
				image_type: '',
				latitude: '-6.225652',
				longitude: '106.74576',
				language: $cookieStore.get('language') || 2

			};

			// Set Data
			var json = angular.toJson(c);
			var data = 'c=' + encodeURIComponent(json);;

			// get token
			var token = $cookieStore.get('token') || '';
			var header = {
				"Content-Type": "application/x-www-form-urlencoded"
			};
			if (token) {
				angular.extend(header, {
					"Authorization": 'Bearer ' + token
				});
			}
			var log_data = {
					url: url,
					request: data,
					response: {}
				}
				// Req with $http
			$http({
					method: 'POST',
					url: url,
					data: data,
					headers: header
				})
				.then(function (response) {
					var data = response.data.c.data;
					var ok = 0;
					log_data.response = response.status;
					if (response.status == 200) {
						var data = response.data.c.data;
						if (data.message == 'token_invalid' || data.message == 'token_not_provided') {
							$state.transitionTo('welcome');
							$cookieStore.remove('token');
							$cookieStore.remove('user_id');
							$cookieStore.remove('gender');
							$state.transitionTo('welcome');
							return;
						} else
						if (response.data.c.token != null) {
							console.log('ini masuk kah ??');
							$cookieStore.put('token', response.data.c.token);
						}
						deferred.resolve(data);
					} else {
						deferred.reject(response);
						(response);
						log(log_data);
					}
				}, function (response) {
					if (_url == 'users/info') {
						var data = response.data;
						if (data['c'] != undefined)
							if (c.data.username == '' && data.c.data.message == 'user_not_found') {
								$cookieStore.remove('token', token);
								$cookieStore.remove('user_id', gender);
								$cookieStore.remove('gender', profile);
								return;
							}
					}
					if (response.data) {
						var data = response.data.c.data;
						if (data.message == 'token_invalid' || data.message == 'token_not_provided') {
							$cookieStore.remove('token');
							$cookieStore.remove('user_id');
							$cookieStore.remove('gender');
							//$state.reload();
						}
						log(log_data);
					}
					deferred.reject(response);
				});

			function log(log_data) {
				$.post('https://fr-logs.ciayo.com/errorlog.php', log_data);

			}
			return deferred.promise;
		}
		// function Socket(){
		// 	var ioSocket = io.connect("https://apidev.ciayo.com/");
		// 	//var ioSocket = io.connect("http://192.168.204.28:8080/");

		// 	var socket = socketFactory({ioSocket:ioSocket});
		// 	return socket;
		// }
	}
})();