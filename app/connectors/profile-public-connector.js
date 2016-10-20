(function () {
	'use strict';

	angular
		.module('app')
		.factory('profilePublicConnector', profilePublicConnector);
	profilePublicConnector.$inject = ['CiayoService','$q','modalFactory'];

	function profilePublicConnector(CiayoService,$q,modalFactory) {
		var factory ={
			getTimeline:getTimeline,
			userBasicInfo:userBasicInfo,
			listChoiceAchievement:listChoiceAchievement
		}
		return factory;
		
		//TIMELINE
		function getTimeline(type,limit,offset,pointer_id){
			var deferred = $q.defer();
			var url = type=='profile'?'timeline/user':type=='trending'?'post/trending':'timeline'
			var data = {limit:limit,offset:offset,pointer_id:pointer_id}
			CiayoService.get(TIMELINE_API_SERVER + url, data,true).then(function (data) {
				if(data.error==false){
					deferred.resolve(data);
				}else{
					modalFactory.message(data.message);
				}
				
			},function(){
				deferred.reject(response);
			});
			return deferred.promise;
		}

		function userBasicInfo(username){
			var deferred = $q.defer();
			var url = 'public/users/info';
			var data = {username:username}
			CiayoService.get(API_SERVER + url, data,true).then(function (data) {
				deferred.resolve(data);
			},function(){
				deferred.reject(response);
			});
			return deferred.promise;
		}

		function listChoiceAchievement(username, type){
			var deferred = $q.defer();
			var url = 'public/users/achievement/choice';
			var data = {username:username, type:type}
			CiayoService.get(API_SERVER + url, data,true).then(function (data) {
				deferred.resolve(data);
			},function(){
				deferred.reject(response);
			});
			return deferred.promise;
		}

		
		
	}
})();
