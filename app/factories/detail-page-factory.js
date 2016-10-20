	(function () {
		'use strict';

		angular
			.module('app')
			.factory('detailPageFactory', detailPageFactory);
		detailPageFactory.$inject = ['$rootScope', 'modalFactory', 'CiayoService', 'cardFactory', '$cookieStore', '$stateParams'];

		function detailPageFactory($rootScope, modalFactory, CiayoService, cardFactory, $cookieStore, $stateParams) {
			var post_code = $stateParams.post_code;
			var _super = {
				permission: [],
				deleteCard: deleteCard,
				user: {
					id: null,
					username: '',
					user_display_name: '',
					avatar: {
						background: '',
						full_body: '',
						face: '',
						cropped: ''
					},
				},
				parallax_setting: true
			}
			var factory = {
				type: '',
				card: [],
				getCardList: getCardList,
				
				loading: false,
				isloading: false,
				init: init,
				_super: _super
			};


			function init() {
				_super.parallax_setting = false;
				getCardList(true);
//				loadPermission(
//					function () {
//						getSettings(function (response) {
//							var data = response.data.c.data;
//							if (data.error == false) {
//								var content = data.content;
								//content.list_setting.general_setting.card_setting.parallax_view;
								//getUserInfo();
//							}
//						}, function () {
//							getUserInfo();
//						});
//					}
//				);
			}
			
			function getCardList(start) {
				var c = {
					data: {
						"post_code": post_code,
					}
				}
				var url = $cookieStore.get('token')?'post/detail':'public/timeline/detail';
				CiayoService.Api(url, c, function (response) {
					var ok=false;
					if (response.status == 200) {
						var data = response.data.c.data;
						if (data.error == false) {
							ok = true;
						}
					}
					if (ok) {
						var tmp = (data.content);
						tmp.frame = false;
						factory.card = new cardFactory(tmp, _super);
						factory.isloading = false;
						factory.loading = false;
					} else {
						//...
					}
				});
			}

			function getSettings(callback, errCallback) {
				var c = {
					data: {}
				};
				CiayoService.Api('settings', c, function (response) {
					if (response.status == 200) {
						callback(response);
					} else {
						callback(response);
					}
				});
			}

			function loadPermission(callback) {
				if (_super.permission.length != 0) {
					callback();
					return;
				}
				var c = {
					data: {}
				}
				CiayoService.Api('post/attributes', c, function (response) {
					var ok = false;
					var data = null;
					if (response.status == 200) {
						data = response.data.c.data;
						if (data.error == false) {
							ok = true;
						}
					}
					if (ok) {
						_super.permission.list = [];
						_super.permission = data.content.post_category;
						angular.forEach(_super.permission, function (value, key) {
							value.icon = value.name.toLocaleLowerCase().replace(' ', '-');
						});
						callback();
					} else {

					}
				});
			}

			function deleteCard(card) {
				
			}

			function getUserInfo() {
				var username = '';
				var ok = false;
				var c = {
					data: {
						"username": username
					}
				}
				CiayoService.Api('public/users/info', c, function (response) {
					if (response.status == 200) {
						var data = response.data.c.data;
						if (data.error == false) {
							var card = data.content;
							//user_info
							_super.user.id = card.user_id;
							//user_avatar
							_super.user.avatar.background = card.users_avatar.background_avatar;
							_super.user.avatar.full_body = card.users_avatar.avatar;
							_super.user.avatar.cropped = card.users_avatar.avatar_crop;
							getCardList(true);
						}
					}

				});
			}

			
			return factory;
		}
	})();