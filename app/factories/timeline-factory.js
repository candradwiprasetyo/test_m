(function () {
	'use strict';

	angular
		.module('app')
		.factory('timelineFactory', timelineFactory);
	timelineFactory.$inject = ['$rootScope', 'modalFactory', 'CiayoService', 'cardFactory', '$cookieStore', '$stateParams','timelineConnector','socketFactory'];

	function timelineFactory($rootScope, modalFactory, CiayoService, cardFactory, $cookieStore, $stateParams,timelineConnector,socketFactory) {
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
			card_list: [],
			getCardList: getCardList,
			load_more: false,
			loading: true,
			isloading: false,
			loading_count: [],
			clearSearch: clearSearch,
			init: init,
			insert: insert,
			_super: _super,
			new_post_count:0,
			new_post_loading:false,
			new_post_paused:false,
			new_post_timer:null,
			newPostLoad:newPostLoad
		};


		function init() {
			factory.loading_count = [{}];
			loadPermission(
				function () {
					getSettings(function (response) {
						var data = response.data.c.data;
						if (data.error == false) {
							var content = data.content;
							_super.parallax_setting = content.list_setting.general_setting.card_setting.parallax_view;
							getUserInfo();
						}
					}, function () {
						getUserInfo();
					});
				}
			);
		}
		
		function clearSearch() {
			factory.search_text = '';
			factory.card_list = [];
			factory.load_more = false;
		}

		function getCardList(start) {
			if(!factory.loading && !factory.load_more){
				return;
			}
			if (!factory.isloading) {
				factory.isloading = true;
				factory.loading = true;

				if (start) {
					factory.card_list = [];
				}


				var offset = factory.card_list.length;
				var limit = 3;
				var username= null;
				var pointer_id=null;
				if (factory.type == 'profile') {
					username= $stateParams.username;
				} else if (factory.type == 'trending') {
					if (offset >= 8) {limit = 2;}
					
				}
				if(offset>0){
					pointer_id = factory.card_list[offset-1].id;
				}
				
				timelineConnector.timelineGet(factory.type,limit,offset,pointer_id,username)
					.then(function(data){
					if (data.error == false) {
						if (factory.type == 'trending') {
							var tmp = (data.content.trending);
						} else {
							var tmp = (data.content.posts);
						}
						angular.forEach(tmp, function (value, key) {

							value.frame = false;
							var card = new cardFactory(value, _super);
							factory.card_list.push(card);

						});
						factory.isloading = false;
						factory.loading = false;

						if (factory.type == 'trending') {
							if (offset >= 8) {
								factory.load_more = false;
							} else {
//								if (data.meta.current_page < data.meta.last_page) {
									factory.load_more = true;
//								} else {
//									factory.load_more = false;
//								}
							}

						} else {

							if (data.meta.current_page < data.meta.last_page) {
								factory.load_more = true;
							} else {
								factory.load_more = false;
							}
						}
						if (start == true) {
							factory.loading_count.pop();
						}
					} else {
						//...
					}
				}, function(){
						
					});
			}
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
			timelineConnector.postAttributesGet().then(function(data){
				if(data.error==false){
					_super.permission.list = [];
					_super.permission = data.content.post_category;
					angular.forEach(_super.permission, function (value, key) {
						value.icon = value.name.toLocaleLowerCase().replace(' ', '-');
					});
					callback();
				}else{
					modalFactory.message(data.message);
				}
			},function(response){
				
			})
		}

		function deleteCard(card) {
			var index = factory.card_list.indexOf(card);
			if (index != -1) {
				factory.card_list.splice(index, 1);
			}
		}

		function getUserInfo() {
			var username = ''; //$stateParams.username?$stateParams.username:'';
			var ok = false;
			var c = {
				data: {
					"username": username
				}
			}
			CiayoService.Api('users/info', c, function (response) {
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
						runSocket();
						newPostPause();
					}
				}

			});
		}

		function insert(value) {
			var card = new cardFactory(value, _super);
			factory.card_list.unshift(card);
		}
		
		function runSocket(){
			var ioSocket = io.connect(SOCKET_API_SERVER);
			var socket = socketFactory({ioSocket:ioSocket});
			socket.emit('set_userid', _super.user.id);
			socket.on('np001',onNewPost);
		}
		function onNewPost(data){
			factory.new_post_count++;
		}
		function newPostLoad(){
			newPostPause();
			factory.new_post_loading=true;
			timelineConnector.timelineGet('timeline',factory.new_post_count,0,null,'',true)
				.then(function(data){
				var tmp = (data.content.posts).reverse();
				angular.forEach(tmp, function (value, key) {
					value.frame = false;
					var card = new cardFactory(value, _super);
					factory.card_list.unshift(card);
				});
				factory.new_post_loading = false;
			},function(response){
				
			})
			factory.new_post_count=0;
		}
		function newPostPause(){
			factory.new_post_paused=true;
			clearTimeout(factory.new_post_timer);
			factory.new_post_timer = setTimeout(newPostResume, 30000);
		}
		function newPostResume(){
			factory.new_post_paused = false;
		}
		return factory;
	}
})();