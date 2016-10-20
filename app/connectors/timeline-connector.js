(function () {
	'use strict';

	angular
		.module('app')
		.factory('timelineConnector', timelineConnector);
	timelineConnector.$inject = ['CiayoService','$q','modalFactory'];

	function timelineConnector(CiayoService,$q,modalFactory) {
		var factory ={
			//GLOBAL
			postAttributesGet:postAttributesGet,
			//TIMELINE
			timelineGet:timelineGet,
			//ACTIVITY
			activityGet:activityGet,
			activityDetail:activityDetail,
			//CARD
			cardGet:cardGet,
			cardCreate:cardCreate,
			cardDelete:cardDelete,
			cardAsk:cardAsk,
			cardResponse:cardResponse,
			cardGenerateImage:cardGenerateImage,
			captionUpdate:captionUpdate,
			//CARD-WITH
			withGet:withGet,
			withUpdate:withUpdate,
			//CARD-PLACE
			placeGet:placeGet,
			placeUpdate:placeUpdate,
			//CARD-REACTION
			reactionGet:reactionGet,
			reactionCreate:reactionCreate,
			//CARD-COMMENT
			commentGet:commentGet,
			commentCreate:commentCreate,
			commentUpdate:commentUpdate,
			commentDelete:commentDelete,
			commentLike:commentLike,
			//CARD-SHARING
			shareGet:shareGet,
			shareFbApi:shareFbApi,
			shareCreate:shareCreate,
			shareFbImageGet:shareFbImageGet,
			//CARD-OPTION
			cardSubscribe:cardSubscribe,
			cardUnsubscribe:cardUnsubscribe,
			cardPermissionUpdate:cardPermissionUpdate
		}
		return factory;
		
		//GLOBAL
		function postAttributesGet() {
			var data = {}
			return CiayoService.get('post/attributes', data).then(function (data) {
				if(data.error==true){
					modalFactory.message(data.message);
				}
				return data;
			},function(response){return response});
		}
		//TIMELINE
		function timelineGet(type,limit,offset,pointer_id,username,isrefresh){
			var url =
				(type=='profile'?'timeline/user':type=='trending'?'post/trending':'timeline');
			var data = {limit:limit,offset:offset,pointer_id:pointer_id};
			if(username!=undefined){
				data.username = username;
			}
			if(isrefresh==true){
				data.isrefresh=isrefresh;
			}
			return CiayoService.get(TIMELINE_API_SERVER + url, data,true).then(function (data) {
				if(data.error==true){
					modalFactory.message(data.message);
				}
				return data;
			},function(response){return response;});
		}
		//ACTIVITY
		function activityGet(keyword){
			var deferred = $q.defer();
			var data = {keyword:keyword,limit:20,offset:0}
			CiayoService.get('activity', data).then(function (data) {
				if(data.error==false){
					deferred.resolve(data);
				}else{
					modalFactory.message(data.message);
				}
				
			},function(response){
				deferred.reject(response);
			});
			return deferred.promise;
		}
		function activityDetail(activity_id){
			var deferred = $q.defer();
			var data = {activity_id:activity_id}
			CiayoService.get('activity/detail', data).then(function (data) {
				deferred.resolve(data);
			},function(response){
				deferred.reject(response);
			});
			return deferred.promise;
		}
		//CARD
		function cardGet(post_code){
			var deferred = $q.defer();
			var data = {post_code:post_code}
			CiayoService.get('post/detail', data).then(function (data) {
				if(data.error==false){
					deferred.resolve(data);
				}else{
					modalFactory.message(data.message);
				}
				
			},function(response){
				deferred.reject(response);
			});
			return deferred.promise;
		}
		function cardCreate(activity_id, mood_id, place_id, post_category, caption, bubble, items, with_users){
			var deferred = $q.defer();
			var data = {activity_id:activity_id,mood_id:mood_id,place_id:place_id,post_category:post_category,caption:caption,bubble:bubble,items:items,with_users:with_users}
			CiayoService.get('post/create', data).then(function (data) {
				if(data.error==false){
					deferred.resolve(data);
				}else{
					modalFactory.message(data.message);
				}
			},function(response){
				deferred.reject(response);
			});
			return deferred.promise;
		}
		function cardDelete(post_id){
			var deferred = $q.defer();
			var data = {post_id:post_id}
			CiayoService.get('post/delete', data).then(function (data) {
				if(data.error==false){
					deferred.resolve(data);
				}else{
					modalFactory.message(data.message);
				}
				
			},function(response){
				deferred.reject(response);
			});
			return deferred.promise;
		}
		function cardAsk(post_id,type){
			var deferred = $q.defer();
			var data = {post_id:post_id,type:type}
			CiayoService.get('post/ask', data).then(function (data) {
				modalFactory.message(data.message);
				deferred.resolve(data);
			},function(response){
				deferred.reject(response);
			});
			return deferred.promise;
		}
		function cardResponse(post_id,type,value){
			var deferred = $q.defer();
			var data = {post_id:post_id,type:type,value:value}
			CiayoService.get('post/response', data).then(function (data) {
				modalFactory.message(data.message);
				deferred.resolve(data);
			},function(response){
				deferred.reject(response);
			});
			return deferred.promise;
		}
		function cardGenerateImage(post_id){
			var deferred = $q.defer();
			var data = {post_id:post_id}
			CiayoService.get('post/create/images', data).then(function (data) {
				deferred.resolve(data);
			},function(response){
				deferred.reject(response);
			});
			return deferred.promise;
		}
		function captionUpdate(post_id,post_caption,bubble){
			var deferred = $q.defer();
			var data = {post_id:post_id,post_caption:post_caption,bubble:bubble}
			CiayoService.get('post/caption', data).then(function (data) {
				deferred.resolve(data);
			},function(response){
				deferred.reject(response);
			});
			return deferred.promise;
		}
		//CARD ITEM
		//CARD-WITH
		function withGet(post_id){
			var deferred = $q.defer();
			var data = {post_id:post_id}
			CiayoService.get('post/with/detail', data).then(function (data) {
				deferred.resolve(data);
			},function(response){
				deferred.reject(response);
			});
			return deferred.promise;
		}
		function withUpdate(post_id,with_users){
			var deferred = $q.defer();
			var data = {post_id:post_id,with_users:with_users}
			CiayoService.get('post/with', data).then(function (data) {
				deferred.resolve(data);
			},function(response){
				deferred.reject(response);
			});
			return deferred.promise;
		}
		//CARD-PLACE
		function placeGet(keyword){
			var deferred = $q.defer();
			var data = {keyword:keyword}
			CiayoService.get('place', data).then(function (data) {
				if(data.error==false){
					deferred.resolve(data);
				}else{
					modalFactory.message(data.message);
				}
				
			},function(response){
				deferred.reject(response);
			});
			return deferred.promise;
		}
		function placeUpdate(post_id,place_id){
			var deferred = $q.defer();
			var data = {post_id:post_id,place_id:place_id}
			CiayoService.get('post/place', data).then(function (data) {
				deferred.resolve(data);
			},function(response){
				deferred.reject(response);
			});
			return deferred.promise;
		}
		//CARD-REACTION
		function reactionCreate(post_id,emotion){
			var deferred = $q.defer();
			var data = {post_id:post_id,emotion:emotion};
			CiayoService.get('post/emotion', data).then(function (data) {
				if(data.error==false){
					deferred.resolve(data);
				}else{
					modalFactory.message(data.message);
				}
				
			},function(response){
				deferred.reject(response);
			});
			return deferred.promise;
		}
		function reactionGet(post_id){
			var deferred = $q.defer();
			var data = {post_id:post_id};
			CiayoService.get('post/emotion/detail', data).then(function (data) {
				if(data.error==false){
					deferred.resolve(data);
				}else{
					modalFactory.message(data.message);
				}
				
			},function(response){
				deferred.reject(response);
			});
			return deferred.promise;
		}
		//CARD-COMMENT
		function commentGet(post_id,parent_id,offset,limit){
			var deferred = $q.defer();
			var data = {post_id:post_id,parent_id:parent_id,offset:offset,limit:limit}
			CiayoService.get('post/comment/list', data).then(function (data) {
				deferred.resolve(data);
			},function(response){
				deferred.reject(response);
			});
			return deferred.promise;
		}
		function commentCreate(post_id,content,parent_id){
			var deferred = $q.defer();
			var data = {post_id:post_id,content:content,parent_id:parent_id}
			CiayoService.get('post/comment', data).then(function (data) {
				deferred.resolve(data);
			},function(response){
				deferred.reject(response);
			});
			return deferred.promise;
		}
		function commentUpdate(comment_id,content){
			var deferred = $q.defer();
			var data = {comment_id:comment_id,content:content};
			CiayoService.get('post/comment/edit', data).then(function (data) {
				deferred.resolve(data);
			},function(response){
				deferred.reject(response);
			});
			return deferred.promise;
		}
		function commentDelete(comment_id){
			var deferred = $q.defer();
			var data = {comment_id:comment_id};
			CiayoService.get('post/comment/delete', data).then(function (data) {
				deferred.resolve(data);
			},function(response){
				deferred.reject(response);
			});
			return deferred.promise;
		}
		function commentLike(comment_id,value){
			var deferred = $q.defer();
			var data = {comment_id:comment_id,value:value};
			CiayoService.get('post/comment/like', data).then(function (data) {
				deferred.resolve(data);
			},function(response){
				deferred.reject(response);
			});
			return deferred.promise;
		}
		//CARD-SHARING
		function shareGet(post_id){
			var deferred = $q.defer();
			var data = {post_id:post_id};
			CiayoService.get('sosmed/share/list', data).then(function (data) {
				if(data.error==false){
					deferred.resolve(data);
				}else{
//					modalFactory.message(data.message);
				}
				
			},function(response){
				deferred.reject(response);
			});
			return deferred.promise;
		}
		function shareFbApi(uid,access_token,post_id) {
			var data = {uid:uid,access_token:access_token,post_id:post_id};
			return CiayoService.get('facebook/share/post', data).then(function (data) {
				if(data.error==true){
					modalFactory.message(data.message);
				}
				return data;
			},function(response){return response});
		}
		function shareCreate(post_id,to){
			var target=null;
				if(to=='facebook'){
					target=0;
				}else
				if(to=='pinterest'){
					target=2;
				}else
				if(to=='twitter'){
					target=1;
				}else{
					return;
				}
			var deferred = $q.defer();
			var data = {post_id:post_id,message:to,target:target};
			CiayoService.get('sosmed/share/save', data).then(function (data) {
				deferred.resolve(data);
			},function(response){
				deferred.reject(response);
			});
			return deferred.promise;
		}
		function shareFbImageGet(post_id){
			var deferred = $q.defer();
			var data = {post_id:post_id}
			CiayoService.get('post/create/sharefb', data).then(function (data) {
				deferred.resolve(data);
			},function(response){
				deferred.reject(response);
			});
			return deferred.promise;
		}
		
		//CARD-OPTION
		function cardSubscribe(post_id){
			var deferred = $q.defer();
			var data = {post_id:post_id}
			CiayoService.get('post/subscribe', data).then(function (data) {
				if(data.error==false){
					deferred.resolve(data);
				}else{
					modalFactory.message(data.message);
				}
				
			},function(response){
				deferred.reject(response);
			});
			return deferred.promise;
		}
		function cardUnsubscribe(post_id){
			var deferred = $q.defer();
			var data = {post_id:post_id}
			CiayoService.get('post/unsubscribe', data).then(function (data) {
				if(data.error==false){
					deferred.resolve(data);
				}else{
					modalFactory.message(data.message);
				}
				
			},function(response){
				deferred.reject(response);
			});
			return deferred.promise;
		}
		function cardPermissionUpdate(post_id,post_category){
			var deferred = $q.defer();
			var data = {post_id:post_id,'post_category':post_category};
			CiayoService.get('post/permission', data).then(function (data) {
				if(data.error==false){
					deferred.resolve(data);
				}else{
					modalFactory.message(data.message);
				}
				
			},function(response){
				deferred.reject(response);
			});
			return deferred.promise;
		}
	}
})();
