(function () {
	'use strict';

	angular
		.module('app')
		.factory('cardWithDrawer', cardWithDrawer);
	cardWithDrawer.$inject = ['$rootScope', 'CiayoService', 'drawerFactory','$filter'];

	function cardWithDrawer($rootScope, CiayoService, drawerFactory,$filter) {
		var factory = {
			open:open,
			back:back,
			save:save,
			callback:angular.noop(),
			old_withs:null,
			withs:null,
			search:'',
			list:[],
			isEmpty:false,
			deleteSearch:deleteSearch,
			selectWith:selectWith,
			searchWith:searchWith,
			deleteWith:deleteWith,
			isExist:isExist
		};
		function open(type,withs,callback){
			factory.callback=callback;
			factory.old_withs=withs.slice();
			factory.withs = withs.slice();
			factory.isEmpty=false;
			factory.back_text='back';
			factory.save_text='save';
			if(type=='ADD'){
				drawerFactory.title=$filter('translate')('$tag.people');
			}else{
				drawerFactory.title=$filter('translate')('$tag.people');
			}
			drawerFactory.drawer_class='-timeline-post-with';
			drawerFactory.template = DRAWER_VIEW+'card-with.html';
			drawerFactory.data = factory;
//			factory.old_withs=withs;
//			factory.withs=withs;
			factory.search='';
			factory.list=[];
			$rootScope.$broadcast('drawer.open',{});
		}
		function back(){
			drawerFactory.setState();
			var data={'withs':factory.old_withs};
			factory.callback(data,false);
		}
		function save(){
			drawerFactory.setState();
			var data={'withs':factory.withs}
			factory.callback(data,true);
		}
		//FUNCTION
		
		function deleteSearch(){
			factory.search='';
			factory.list=[];
			factory.isEmpty=false;
			factory.withs=[];
		}
		
		function searchWith(){
			factory.isEmpty=false;
			var keyword=factory.search,limit=20,offset=0;
			var ok = false;
			var c = {
				data: {
					"keyword": keyword,
					"limit": limit,
					"offset": offset
				}
			};
			CiayoService.Api('search/friend/name', c, function(response) {
				if(response.status==200){
					var data = response.data.c.data;
					if (data.error == false) {
						ok = true;
					}
				}
				if(ok){
					factory.list=[];
					var tmp = data.content.list_user;
					angular.forEach(tmp,function(value,key){
						factory.list.push({
							id:value.user_id,
							user_name:value.username,
							user_display_name:value.user_display_name,
							avatar: {
								background: value.user_avatar_detail.background_avatar,
								full_body: value.user_avatar_detail.avatar,
								face: '',
								cropped: value.user_avatar_cropped.avatar
							},
						})
					});
					factory.isEmpty = factory.list.length==0;
				}else{
					//...
				}
			});
		}
		function selectWith(_with){
			if(isExist(_with)){
				deleteWith(_with);
			}else{
				factory.withs.push(_with);
				factory.search='';
			}
			
			// factory.list=[];
			// factory.search=_with.with_name;
		}
		function deleteWith(_with){
			factory.withs.splice(factory.withs.indexOf(_with),1);
		}
		function isExist(_with){
			var _return = false;
			angular.forEach(factory.withs,function(value,key){
				if(value.id==_with.id){
					_return  = true;
				}
			})
			return _return;
		}
		return factory;
	}
})();