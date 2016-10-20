(function () {
	'use strict';

	angular
		.module('app')
		.factory('postFactory', postFactory);
	postFactory.$inject = [
		'$rootScope','$filter','modalFactory', 'CiayoService','cardParallaxFactory',
		'cardCaptionDrawer','cardItemDrawer','cardWithDrawer','cardPlaceDrawer','timelineConnector'
	];

	function postFactory(
		$rootScope,$filter,modalFactory, CiayoService,cardParallaxFactory,
		cardCaptionDrawer,cardItemDrawer,cardWithDrawer,cardPlaceDrawer,timelineConnector
		) {
		var factory = {
			parallax_setting:false,
			allowedState : ['none','post','item','with','place','caption'],
			state:'',
			reset:reset,
			caption:'',
			activity: {
				search: '',
				data:null,
				parallax:null,
				list: [],
				isEmpty:false
			},
			mood:{
				data:null,
				list: []
			},
			permission:{
				data:null,
				list: []
			},
			items:[],
			withs:[],
			place:null,
			tmp:null,
			hide_parallax:false,
			//FUNCTION
			init:init,
			setState:setState,
			isPostActive:isPostActive,
			resetActivities:resetActivities,
			//API+FUNCTIONAL
//			postAttributes:postAttributes,
			searchActivity:searchActivity,
			selectActivity:selectActivity,
			selectMood:selectMood,
			setCaption:setCaption,
			setItem:setItem,
			setWith:setWith,
			setPlace:setPlace,
			save:save
		};
		
		function init(){
			reset();
			postAttributes(function(){
				getSettings(function(){
					reset();
				},function(){reset();});
			},function(){
				
			});
			
		}
		function setState(state){
			if(factory.allowedState.indexOf(state)!=-1){
				factory.state = state;
			}else{
				modalFactory.log('state '+state+' not found','error');
			}
		}
		function isPostActive(){
			var index = factory.allowedState.indexOf(factory.state);
			return !(index==-1 || index==0);
		}
		
		function reset(){
			factory.caption='';
			factory.activity.search='';
			factory.activity.data=null;
			factory.activity.parallax=null;
			resetActivities();
			factory.mood.data=factory.mood.list[0];
			factory.permission.data = factory.permission.list[0];
			angular.forEach(factory.permission.list,function(value,key){
				if(value.id==0)
					factory.permission.data = value;
			})
			factory.items=cardItemDrawer.getInitData();
			factory.withs=[];
			factory.place=null;
			factory.loadingActivity=false;
			factory.activity.isEmpty=false;
		}
		function resetActivities(){
			factory.activity.list=[];
		}
		//API+FUNCTIONAL
		function postAttributes(callback, errCallback) {
			if (factory.permission.list.length!=0 && factory.mood.list.length!=0) {
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
					factory.permission.list=[];
					factory.permission.list = data.content.post_category;
					angular.forEach(factory.permission.list, function (value, key) {
						value.icon = value.name.toLocaleLowerCase().replace(' ', '-');
					});
					factory.mood.list.list=[];
					factory.mood.list = data.content.post_moods;
					angular.forEach(factory.mood.list,function(value,key){
						value.icon = 
							value.name.toLowerCase()=='normal'?
							'ci-mood-normal':
							'ci-mood-'+value.name.toLocaleLowerCase().replace(' ','-');
					});
					callback();
				} else {
					errCallback(response);
				}
			});
		}
		function getSettings(callback, errCallback) {
			var c={
					data:{
					}
			};
			CiayoService.Api('settings', c, function(response) {
					if(response.status==200) {
						var data = response.data.c.data;
						if(data.error==false){
							factory.parallax_setting = data.content.list_setting.general_setting.card_setting.parallax_view;
							callback(response);
						}else{
							modalFactory(data.message);
						}
					} else {
							errCallback(response);
					}
			});
	}
		function searchActivity(from){
			var keyword=factory.activity.search;
			if(keyword=='' || factory.activity.data!=undefined){return;}
			factory.activity.list=[];
			factory.loadingActivity=true;
			
			factory.activity.isEmpty=false;
			timelineConnector.activityGet(keyword).then(function(data){
				if(data.content.list_activity.length==0 && from==undefined){
					factory.activity.isEmpty=true;
				}else{
					factory.activity.list=data.content.list_activity;
				}
				factory.loadingActivity=false;
			},function(){
				
			});
		}
		function selectActivity(activity){
			var ok=false;
			var search_data = activity;
			var c = {
				data: {
					"activity_id": search_data.activity_id
				}
			};
			factory.activity.search=search_data.activity_name;
			factory.activity.data={};
			factory.activity.loading=true;
			factory.activity.parallax=null;
			timelineConnector.activityDetail(search_data.activity_id).then(function(data){
				factory.activity.loading=false;
				if(data.error==false){
					factory.activity.data=data.content;
					factory.activity.data.parallax_setting=false;//factory.parallax_setting;
					if(factory.activity.data.avatar_url){
						factory.activity.data.face = factory.activity.data.avatar_url.normal;
					}
					factory.activity.data.caption_bubble=false;
					factory.activity.parallax = new cardParallaxFactory(factory.activity.data);
					
				}else{
					factory.activity.data=null;
					modalFactory.message(data.message);
				}
			},function(response){
				
			});
			factory.activity.list=[];
		}
		function selectMood(mood){
			var const_mood =['normal','happy','sad'];
			factory.mood.data=mood;
			if(factory.activity.data.avatar_url){
				factory.activity.data.face = factory.activity.data.avatar_url[const_mood[mood.mood_id-1].toLowerCase()];
				factory.activity.parallax = new cardParallaxFactory(factory.activity.data);
			}
			
		}
		function setCaption(){
			factory.hide_parallax=true;
			cardCaptionDrawer.open(
				'ADD',
				factory.caption,factory.activity.parallax,
				function(data){
					factory.caption = data.caption;
					factory.hide_parallax=false;
			});
		}
		function setItem(index){
			cardItemDrawer.open(
				'ADD',
				factory.items,
				index,
				function(data){
					factory.index = index;
					factory.items = data.items;
				}
			)
		}
		function setWith(){
			cardWithDrawer.open(
				'ADD',
				factory.withs,
				function(data){
					factory.withs = data.withs;
				}
			);
		}
		function setPlace(){
			cardPlaceDrawer.open(
				'ADD',
				factory.place,
				function(data){
					factory.place = data.place;
				}
			);
		}
		function save(callback){
			if(factory.activity.loading || factory.activity.data==undefined || factory.activity.data.activity_id==undefined){
				modalFactory.message('Please wait');
				return false;
			}
			var _items=[],_users=[];
			angular.forEach(factory.items,function(value,key){
				if(value){
					_items.push({'id':value.item_id,'type':value.item_type});
				}
			});
			angular.forEach(factory.withs,function(value,key){
				_users.push({'id':value.id,'username':value.user_name});
			});
			timelineConnector.cardCreate(
				factory.activity.data.activity_id,
				factory.mood.data.mood_id,
				factory.place?factory.place.id:null,
				factory.permission.data.id,
				factory.caption,
				false,
				_items,
				_users
			).then(function(data){
				callback(data.content);
				reset();
			},function(response){
				
			});
			return true;
		}
			
		return factory;
	}
})();