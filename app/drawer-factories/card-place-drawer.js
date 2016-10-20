(function () {
	'use strict';

	angular
		.module('app')
		.factory('cardPlaceDrawer', cardPlaceDrawer);
	cardPlaceDrawer.$inject = ['$rootScope','CiayoService', 'drawerFactory','modalFactory','$filter','timelineConnector'];

	function cardPlaceDrawer($rootScope,CiayoService, drawerFactory,modalFactory,$filter,timelineConnector) {
		var factory = {
			open:open,
			back:back,
			save:save,
			callback:angular.noop(),
			old_place:null,
			place:null,
			search:'',
			list:[],
			suggest:[],
			isEmpty:false,
			deleteSearch:deleteSearch,
			selectPlace:selectPlace,
			searchPlace:searchPlace,
			deletePlace:deletePlace
		};
		function open(type,place,callback){
			factory.callback=callback;
			factory.old_place=place;
			factory.place = place;
			factory.isEmpty=false;
			factory.back_text=$filter('translate')('$back');
			factory.save_text=$filter('translate')('$save');
			if(type=='ADD'){
				drawerFactory.title=$filter('translate')('$add.a.place');
			}else{
				drawerFactory.title=$filter('translate')('$edit.a.place');
			}
			drawerFactory.drawer_class='-timeline-post-place';
			drawerFactory.template = DRAWER_VIEW+'card-place.html';
			drawerFactory.data = factory;
			factory.old_place=place;
			factory.place=place;
			factory.search='';
			factory.list=[];
			getPosition();
			$rootScope.$broadcast('drawer.open',{});
		}
		function back(){
			drawerFactory.setState();
			var data={'place':factory.old_place};
			factory.callback(data);
		}
		function save(){
			drawerFactory.setState();
			var data={'place':factory.place}
			factory.callback(data);
		}
		//FUNCTION
		
		function deleteSearch(){
			factory.search='';
			factory.list=[];
			factory.isEmpty=false;
		}
		function getPosition(){
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(loadSuggest);
			} else {
					
			}
		}
		function loadSuggest(position){
			var ok=false;
			var c = {
				data: {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				}
			};
			CiayoService.Api('place/nearby', c, function(response) {
				if(response.status==200){
					var data = response.data.c.data;
					if (data.error == false) {
						ok = true;
					}
				}
				if(ok){
					factory.suggest=data.content.list_nearby_place;
				}else{
					//...
				}
			});
		}
		function searchPlace(){
			factory.isEmpty=false;
			timelineConnector.placeGet(factory.search).then(function(data){
				factory.isEmpty=data.content.data.length==0;
				factory.list=data.content.data;
			});
		}
		function selectPlace(_place){
			factory.place=_place;
			factory.deleteSearch();
			factory.isEmpty=false;
		}
		function deletePlace(){
			factory.place=null;
		}
		return factory;
	}
})();