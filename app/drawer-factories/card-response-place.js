(function () {
	'use strict';

	angular
		.module('app')
		.factory('cardResponsePlace', cardResponsePlace);
	cardResponsePlace.$inject = ['$rootScope','$filter','modalFactory', 'drawerFactory','cardFactory','cardPlaceDrawer','timelineConnector'];

	function cardResponsePlace($rootScope,$filter,modalFactory,drawerFactory,cardFactory,cardPlaceDrawer,timelineConnector) {
		var factory = {
			open:open,
			back:back,
			save:save,
			callback:angular.noop(),
			card:null,
			activity:null,
			response:response
		};
		function open(post_code,from_name,caption,callback){
			factory.callback=callback;
			factory.from_name = from_name;
//			factory.card=new cardFactory();
			factory.back_text=$filter('translate')('$back');
			drawerFactory.title=$filter('translate')('$response.to.question');
			drawerFactory.drawer_class='-card-ask';
			drawerFactory.template = DRAWER_VIEW+'card-response-place.html';
			load(post_code);
		}
		function load(post_code){
			var c = {
				data: {
					"post_code": post_code,
				}
			}
			timelineConnector.cardGet(post_code).then(function(data){
						var data = data.content;
						if(data.place_detail.place_status.value!=-1){modalFactory.message('Kamu sudah pernah respons');return;}
						//user_info
						factory.user={};
						factory.id = data.post_id;
						factory.created_at = data.created_at;
						factory.user.id = data.user_id;
						factory.user.username = data.username;
						factory.user.user_display_name = data.user_display_name;
						//mood_id
						factory.user.mood={};
						if (data.activity_detail.mood) {
							factory.user.mood.id = data.activity_detail.mood.id;
							factory.user.mood.text = data.activity_detail.mood.text;
						}
						factory.image_preview = data.activity_detail.preview;
						factory.created_at = data.created_at;
						factory.title = data.activity_detail.activity_title;
						factory.caption = data.activity_detail.caption;
						if (factory.title == undefined) {
							factory.title = '';
						} else {
							factory.title = factory.title
								.replace('[USERNAME]', '<span class="name">' + factory.user.user_display_name + '</span>')
								.replace('[MOOD_TEXT]',
								factory.user.mood.id ?
									(factory.user.mood.text + ' ' +
										(factory.user.mood.id == 2 ? '<i class="ci-mood-happy"></i>' :
											factory.user.mood.id == 3 ? '<i class="ci-mood-sad"></i>' : '')
									) : '');
						}
						
						
						drawerFactory.data = factory;
						$rootScope.$broadcast('drawer.open',{});
					
			},function(response){
				
			});
		}
		function response(value){
			if(value==0){//tag
					cardPlaceDrawer.open(
						'EDIT',
						null,
						function (data) {
							if (null != data.place) {
								savePlace(data.place);
							}
						}
					);
			}else
			if(value==1 || value==2){//secret
				timelineConnector.cardAsk(factory.id,'response_place',value)
				.then(function(data){
					drawerFactory.setState();
				},function(response){});
			}
		}
		function savePlace(place) {
			timelineConnector.placeUpdate(factory.id,place.id)
				.then(function(data){
					if(data.error==false){
						timelineConnector.cardResponse(factory.id,'response_place',0)
						.then(function(data){
							drawerFactory.setState();
						},function(response){});
					}else{
						modalFactory.message(data.message);
					}
					drawerFactory.setState();
				},function(response){});
			}
		function back(){
			drawerFactory.setState();
		}
		function save(){
			drawerFactory.setState();
		}
		return factory;
	}
})();