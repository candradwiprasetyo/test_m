(function () {
	'use strict';

	angular
		.module('app')
		.factory('cardSharingFactory', cardSharingFactory);
	cardSharingFactory.$inject = ['$rootScope', 'modalFactory', 'facebookFactory','timelineConnector','$filter'];

	function cardSharingFactory($rootScope, modalFactory, facebookFactory,timelineConnector,$filter) {
		function factory(post_id,card) {
			var sharing = this;
			angular.extend(sharing, {
				is_sharing:false,
				shareFB: shareFB,
				share:share,
			});
			init();
			function init() {
				angular.extend(sharing, {
					count: 0,
					user_list: []
				});
				load();
			}
			function load() {
				timelineConnector.shareGet(post_id).then(function(data){
					var data = data.content;
					transform(data);
					sharing.is_sharing = false;
					setTimeout(function () { $(window).trigger("resize.card-tab"); }, 1);
				},function(response){
					
				});
			}
			function transform(data) {
				sharing.count = data.list_post_share.length;
				sharing.user_list = [];
				angular.forEach(data.list_post_share, function (value, key) {
					var data=
						{
							user : {
							id: value.user_id,
							username: value.user_name,
							user_display_name: value.user_display_name,
							avatar: {
								background: value.user_avatar.background_avatar,
								full_body: value.user_avatar.avatar,
								face: '',
								cropped: value.user_avatar.avatar_crop
							},
						},
						share: value.lists
						};
					sharing.user_list.push(data);
				});
			}
			function shareFB() {
				var access_token = '';
				var uid = '';
				if(sharing.is_sharing==true){return;}
				sharing.is_sharing = true;
//				timelineConnector.shareFbImageGet(post_id).then(function(data){
//					if(data.error==false){
//						FB.ui({
//							method: 'share',
//							display: 'iframe',
//							type: 'photo',
//							caption: data.content.caption,
//							redirect_uri: data.content.redirect_uri,
//							description: data.content.description,
//							name: data.content.name,
//							href: data.content.href,
//							picture: data.content.picture
//						}, function(response){
//							share('facebook')
//						});
//					}else{
//					}
//					sharing.is_sharing = false;
//				},function(response){
//					sharing.is_sharing = false;
//				});
				
				facebookFactory.getToken(function (data) {
					if(data==undefined || data.accessToken==undefined){
						modalFactory.message($filter('translate')('$fb.error'));
						sharing.is_sharing=false;
						return;
					}
					timelineConnector.shareFbApi(data.uid,data.accessToken,post_id)
					.then(function (response) {
						sharing.is_sharing=false;
						if (response.status == 200) {
							var data = response.data.c.data;
							if (data.error == false) {
								modalFactory.message(data.message);
								load();
							}
						} else {
							sharing.is_sharing=false;
						}
					})
				},function(response){
					
				});


			}
			function share(to){
				timelineConnector.shareCreate(post_id,to).then(function(data){
					if (data.error == false) {
						load();
						sharing.is_sharing = false;
					} else {
						errCallback(response);
						sharing.is_sharing = false;
					}
				},function(response){
					
				});
			}
		}
		return factory
	}
})();