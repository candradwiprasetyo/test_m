(function () {
	'use strict';

	angular
		.module('app')
		.factory('cardFactory', cardFactory);
	cardFactory.$inject = ['$rootScope','$cookieStore','$sce','$filter','modalFactory',
		'cardParallaxFactory', 'cardCommentFactory', 'cardReactionFactory', 'cardSharingFactory',
		'cardCaptionDrawer', 'cardWithDrawer', 'cardDetailDrawer', 'friendConnectionFactory','drawerFactory','timelineConnector'
	];

	function cardFactory($rootScope,$cookieStore,$sce,$filter,modalFactory,
		cardParallaxFactory, cardCommentFactory, cardReactionFactory, cardSharingFactory,
		cardCaptionDrawer, cardWithDrawer, cardDetailDrawer, friendConnectionFactory,drawerFactory,timelineConnector
	) {

		function factory(card, _super,type) {
			var vm = this;
			angular.extend(vm, {
				drawer:drawerFactory,
				setState: setState,
				setLayer: setLayer,
				openDrawer: openDrawer,
				changePermission: changePermission,
				setSubscribe: setSubscribe,
				editCaption: editCaption,
				editWith: editWith,
				deletePrompt: deletePrompt,
				downloadImage: downloadImage,
				askWith: askWith,
				askPlace: askPlace
			});

			init();

			function init() {
				var load = false;
				angular.extend(vm, {
					id:'',
					code:'',
					detail_link:'',
					created_at:null,
					loading_count: 0,
					layer: {
						type: 0, //0->not active, 1->item, 2->with, 3->place
						data: null,
						index: 0
					},
					state: 0, //0->comment,1->share,2->download,3->menu,4->c-button
					title: '',
					image_download: '',
					image_preview:'',
					login: _super.user,
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
						mood: {
							id: 0,
							text: ''
						},
						status: {
							self: true,
							follow: false,
							friend: {
								add: false,
								addStatus: false,
								approve: false
							}
						},
						user_list_button: null
					},
					subscribe: true,
					parallax: null,
					caption: '',
					item: {
						type: 0, //-1->empty,0->filled
						list: []
					},
					with: {
						type: 1, //-1->empty,0->filled,2->alone
						count: 0,
						list: []
					},
					place: {
						type: 1, //-1->empty,1->secret
						data: null
					},
					permission: {
						value: 0,
						list: _super.permission
					},
					link:{'twitter':'','pinterest':''},
					download_link:$sce.trustAsResourceUrl(API_SERVER+'post/download/card'),
					download_data:'',
					is_static:false,is_loading:false,
					reaction: new cardReactionFactory(card.post_id, load),
					comment: new cardCommentFactory(card.post_id,card.enable_comment,type || null),
					sharing: new cardSharingFactory(card.post_id,card)
				});
				transform();

			}

			function transform() {
				vm.id = card.post_id;
				vm.code = card.post_code;
				vm.detail_link = $sce.trustAsResourceUrl(window.location.href+'detail-page/'+card.post_code);
				vm.is_static = true;//navigator.userAgent.search('UCBrowser')!=-1;
				vm.created_at = card.created_at;
				//title
				vm.title = card.activity_detail.activity_title;
				vm.image_download = card.generated_image_url;
				vm.image_preview = card.activity_detail.preview;
				if(vm.image_preview==undefined){
					vm.is_loading = vm.image_preview!=undefined;
					downloadImage();
				}
				//user_info
				vm.user.id = card.user_id;
				vm.user.username = card.username;
				vm.user.user_display_name = card.user_display_name;
				//user_avatar
				vm.user.avatar.background = card.user_avatar.full_body.background_avatar;
				vm.user.avatar.full_body = card.user_avatar.full_body.avatar;
				if(card.user_avatar)
				vm.user.avatar.face = card.user_avatar.face;
				vm.user.avatar.cropped = card.user_avatar.full_body.avatar_crop;
				//mood_id
				if (card.activity_detail.mood) {
					vm.user.mood.id = card.activity_detail.mood.id;
					vm.user.mood.text = card.activity_detail.mood.text;
				}

				//user_status
				if (card.user_status) {
					vm.user.status.self = false;
					vm.user.status.follow = card.user_status.follow;
					vm.user.status.friend.add = card.user_status.friend.add;
					vm.user.status.friend.addstatus = card.user_status.friend.addstatus;
					vm.user.status.friend.approve = card.user_status.friend.approve;

					var value = {
						user_id: null,
						username: null,
						status: {
							friend: {
								add: null,
								addstatus: null,
								approve: null
							},
							follow: null
						}
					};

					// struktur data default api
					value.user_id = card.user_id;
					value.username = card.username;
					value.status.friend.add = card.user_status.friend.add;
					value.status.friend.addstatus = card.user_status.friend.addstatus;
					value.status.friend.approve = card.user_status.friend.approve;
					value.status.follow = card.user_status.follow;


					value.icon_action_response = false;
					value.open_action = false;
					value.ci_star = false;
					value.ci_check = false;

					if (card.user_status.friend.add == false) {
						value.icon_addfriend = true;
						value.name_addfriend = true;
						value.icon_self = 0;
						value.name_self = 0;


					} else {

						if (card.user_status.friend.addstatus == false) {
							if (card.user_status.friend.approve == true) {
								value.icon_addfriend = false;
								value.name_addfriend = false;
								value.icon_self = 0;
								value.name_self = 0;

							} else {
								value.icon_addfriend = true;
								value.name_addfriend = true;
								value.icon_self = 1;
								value.name_self = 1;

								value.ci_star = true;
							}
						} else {
							value.icon_addfriend = false;
							value.name_addfriend = false;
							value.icon_self = 0;
							value.name_self = 0;
							value.ci_check = true;
						}
					}

					if (card.user_status.friend.approve == false) {
						value.checklist_addfriend = true;
					} else {
						value.checklist_addfriend = false;
					}

					if (card.user_status.follow == false) {
						value.icon_follow = true;
						value.name_follow = true;
						value.checklist_follow = true;
					} else {
						value.icon_follow = false;
						value.name_follow = false;
					}


					var friend_connection = new friendConnectionFactory(value);
					vm.user.user_list_button = (friend_connection);


				}
				//parallax
				card.activity_detail.face = vm.user.avatar.face;
				card.activity_detail.back_hair = card.user_avatar.back_hair;
				card.activity_detail.parallax_setting = _super.parallax_setting;
				vm.parallax = new cardParallaxFactory(card.activity_detail);
				//caption
				vm.caption = card.activity_detail.caption;
				//item
				vm.item.type = card.items_detail.items.length == 0 ? -1 : 0;
				angular.forEach(card.items_detail.items, function (value, key) {
					vm.item.list.push({
						id: value.item_id,
						name: value.name,
						type: value.type,
						image: {
							thumbnail: value.image,
							detail: value.image_detail
						}
					})
				});
				//with
				vm.with.type = card.with_detail.with_status.value;
				vm.with.count = card.with_detail.with_user_count;
				//place
				vm.place.type = card.place_detail.place_status.value;
				if (card.place_detail.place) {
					vm.place.data = {
						id: card.place_detail.place.place_id,
						name: card.place_detail.place.place_name,
						address: card.place_detail.place.place_address,
						position: {
							lat: card.place_detail.place.place_lat,
							long: card.place_detail.place.place_long
						},
						image: {
							thumbnail: card.place_detail.place.place_image,
							detail: card.place_detail.place.place_image_detail
						}
					}
				}
				//permission
				angular.forEach(vm.permission.list, function (value, key) {
					if (value.id == card.permission.group)
						vm.permission.data = value;
				});
				//link
				vm.link.twitter = card.activity_detail.share.twitter;
				vm.link.pinterest = card.activity_detail.share.pinterest;
				var token = $cookieStore.get('token');
				vm.download_data = '{"data":{"token":"'+token+'","post_id":"'+card.post_id+'"},"timestamp":1468376374025,"app":"Web","screen_type":"Web","image_type":"","latitude":"-6.225652","longitude":"106.74576","language":1}';
				if(vm.image_download!=undefined){
					vm.link.pinterest = vm.link.pinterest.replace('[IMAGE_PINTEREST]',vm.image_download);
				}
				parseTitle();
				preloadImage()
				if(vm.id==1){
					setState(1)
				}
			}
			function preloadImage(){
				vm.loading_image = true;
				var img = new Image();
				img.src = vm.image_preview;
				img.onload = function(){
					vm.loading_image = false;
					$rootScope.$apply();
				}
			}
			function parseTitle() {
				if (vm.title == undefined) {
					vm.title = '';
				} else {
					vm.title = vm.title
						.replace('[USERNAME]', '<span class="name">' + vm.user.user_display_name + '</span>')
						.replace('[MOOD_TEXT]',
							vm.user.mood.id ?
							(vm.user.mood.text + ' ' +
								(vm.user.mood.id == 2 ? '<i class="ci-mood-happy"></i>' :
									vm.user.mood.id == 3 ? '<i class="ci-mood-sad"></i>' : '')
							) : '')
				}
			}

			function setState(state) {
				vm.state = state;
				if (vm.image_download == null) {
					downloadImage();
				}
				setTimeout(function () {
					$(window).trigger("resize.card-tab")
				}, 1);
			}

			function setLayer(type, data, index) {
				vm.layer.type = type;
				vm.layer.data = data;
				vm.layer.index = type == 1 ? index : 0;
				if(type==2){
					loadWith(function () {});
				}
			}

			function openDrawer() {
				vm.comment = new cardCommentFactory(card.post_id,card.enable_comment,'detail');
				cardDetailDrawer.open(this, function () {
					vm.comment = new cardCommentFactory(card.post_id,card.enable_comment,null);
				});
			}

			function changePermission() {
				timelineConnector.cardPermissionUpdate(card.post_id,vm.permission.data.id)
				.then(function(data){
					modalFactory.message(data.message);
				},function(response){
					
				});
			}

			function setSubscribe() {
				if(vm.subscribe){
					timelineConnector.cardUnsubscribe(card.post_id).then(function(data){
						vm.subscribe = false;
						modalFactory.message(data.message);
					},function(){
						
					})
				}else{
					timelineConnector.cardSubscribe(card.post_id).then(function(data){
						vm.subscribe = true;
						modalFactory.message(data.message);
					},function(){
						
					})
				}
			}

			function loadWith(callback) {
				timelineConnector.withGet(card.post_id).then(function(data){
						vm.with.list = [];
						if (data.error == false) {
							angular.forEach(data.content.data, function (value, key) {
								vm.with.list.push({
									id: value.user_id,
									user_name: value.username,
									user_display_name: value.user_display_name,
									avatar: {
										background: value.user_avatar_detail.background_avatar,
										full_body: value.user_avatar_detail.avatar,
										face: '',
										cropped: value.user_avatar_cropped.avatar
									},
								})
							});
							if (callback) {
								callback(data);
							}
						}else{
							
						}
				},function(response){
					
				});
			}

			function editCaption() {
				cardCaptionDrawer.open(
					'ADD',
					vm.caption, vm.parallax,
					function (data) {
						if (vm.caption != data.caption) {	timelineConnector.captionUpdate(card.post_id,data.caption,false)
							.then(function(data2){
								if (data2.error == false) {
									vm.caption = data.caption;
								}
								modalFactory.message(data2.message);
							},function(response){
							
						});
						}
					});
			}

			function editWith() {
				var old_data = vm.with.list;
				loadWith(function () {
					cardWithDrawer.open(
						'EDIT',
						vm.with.list,
						function (data,edited) {
							if (edited) {
								saveWith(data.withs);
							}
							if(data.withs.length==0){
								vm.with.type=-1;
							}else{
								vm.with.type=0;
							}
						}
					);
				});
			}

			function saveWith(_list) {
				var list = [];
				angular.forEach(_list, function (value, key) {
					list.push({
						id: value.id,
						username: value.user_name
					});
				});
				timelineConnector.withUpdate(card.post_id,list).then(function(data){
						if (data.error == false) {
							vm.with.list = _list;
							vm.with.count=_list.length;
							modalFactory.message(data.message);
						} else {
							modalFactory.message(data.message);
						}
				},function(response){
					
				});
			}

			function deletePrompt() {
				var me = this;
				timelineConnector.cardDelete(card.post_id).then(function(data){
					_super.deleteCard(me);
					modalFactory.message(data.message);
				},function(response){
					
				})
			}

			function downloadImage() {
				vm.is_loading = true;
				timelineConnector.cardGenerateImage(card.post_id)
					.then(function(data){
					if(data.error==false){
						vm.image_download = data.content.card_media_id;
						vm.image_preview = data.content.preview_media_id;
						vm.link.pinterest = vm.link.pinterest.replace('[IMAGE_PINTEREST]',vm.image_download);
						setTimeout(function () {
							$(window).trigger("resize.card-tab")
						}, 1);
						vm.is_loading=false;
						preloadImage();
					}
				},function(response){});
			}

			function askWith() {
				if(card.post_id==1){modalFactory.message('Asking disabled');return;}
				if(vm.user.id==vm.login.id)return;
				modalFactory.confirm(
					$filter('translate')('$ask') + vm.user.user_display_name + $filter('translate')('$ask.with'),
					function (data) {
						if (data.result) {
							timelineConnector.cardAsk(card.post_id,'ask_with')
								.then(function(data){},function(response){});
						}
					}
				);
			}

			function askPlace() {
				if(card.post_id==1){modalFactory.message('Asking disabled');return;}
				if(vm.user.id==vm.login.id)return;
				modalFactory.confirm(
					$filter('translate')('$ask') + vm.user.user_display_name + $filter('translate')('$ask.place'),
					function (data) {
						if (data.result) {
							timelineConnector.cardAsk(card.post_id,'ask_place')
								.then(function(data){},function(response){});
						}
					}
				);
			}
		}

		return factory;
	}
	function Card(){
		var card = this;
		
		angular.extend(card,{
			id:0,
			created_at:0,
			code:'',
			item:{
				type:-1, // -1->empty, 0->filled
				list:[]
			},
			with:{
				type:-1, // -1->asking, 0->filled, 1->secret, 2->alone
				length:0,
				list:[]
			},
			place:{
				type:-1, // -1->asking
				data:null
			}
		});
	}
	function User(){
		var user = this;
		
		angular.extend(user,{
			id:0,
			created_at:0,
			name:'',
			display_name:'',
			avatar:{
				'background':'',
				'full':'',
				'face':'',
				'cropped':''
			},
			status:{
				self:true,
				follow:false,
				friend:{
					add:false,
					add_status:false,
					approve:false
				},
				
			}
		});
	}
	function Place(){
		var place = null;
		angular.extend(place,{
			id:0,
			name:'',
			address:'',
			latitude:0,
			longitude:0,
			image:{
				thumbnail:'',
				detail:''
			}
		});
	}
})();