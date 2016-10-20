(function () {
	'use strict';

	angular
		.module('app')
		.factory('modalFactory', modalFactory);
	modalFactory.$inject = ['$rootScope', 'CiayoService', 'listService', 'AchievementService'];

	function modalFactory($rootScope, CiayoService, listService, AchievementService) {
		//achievement, card detail, modal
		var factory = {
			data:null,
			modal_class:'',
			isOpen:'',
			template:'',
			title:'',
			callback:angular.noop(),
			setState:setState,
			message: message,
			confirm:confirm,
			log: log,
			popup_achievement:popup_achievement
		};
		/**
		Show alert
		*/
		function message(message) {
			factory.data={};
			factory.data.message=message;
			factory.modal_class='';
			factory.template=DIRECTIVES_VIEW+'modal-message.html';
			
			$rootScope.$broadcast('modal.open',{});
		}
		function confirm(message,callback){
			factory.data={};
			factory.data.message=message;
			factory.modal_class='cm-modal -dialog';
			factory.template = DIRECTIVES_VIEW+'modal-confirm.html';
			factory.tFnc = function(){callback({result:true})};
			factory.fFnc = function(){callback({result:false})};
			$rootScope.$broadcast('modal.open',{})
		}

		

		function setState(value){
			if(value){
				$("html, body").css({"overflow": "hidden"});
				factory.isOpen='-open';
			}else{
				$("html, body").removeAttr("style");
				factory.isOpen='';
				factory.template='';
				factory.title='';
				factory.data=null;
				factory.modal_class='';
			}
		}
		
		/**
		 * Show log (ONLY DEVELOPER)
		 * Note : in production set environment DEVELOPMENT to false
		 */
		function log(message, type) {
			if (DEVELOPMENT)
				switch (type) {
					case 'warn': console.warn(message);
					break;
					case 'error': console.error(message);
					break;
					case 'info': console.info(message);
					break;
					case 'log': console.log(message);
					break;
					default: console.log(message);
					break;
				}
		}

		function popup_achievement(id){
			AchievementService.getDetail(id, function(data){
				console.log(data);
				factory.data={};
				factory.detail=data.content;
				factory.modal_class='cm-modal -dialog';
				factory.template = DIRECTIVES_VIEW+'modal-popup-achivement.html';
				//factory.tFnc = function(){callback({result:true})};
				//factory.fFnc = function(){callback({result:false})};
				$rootScope.$broadcast('modal.open',{})
			},function(response){
			 	console.log(response);
			 });
		}

		function popup_achievement_old(id){
			AchievementService.getDetail(id, function(data){
				//console.log(response);
				var itemDetail=data.content;
				//var itemDetail.date_get = date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
				
				$rootScope.$broadcast(
					'modal.open',
					{
						'template':'app/directives/views/popup-achievement.html',
						'data':{
							itemDetail:itemDetail,
							shareFB:function(id_achievement,id){
								facebookFactory.getToken(function (data) {
									//alert(data.accessToken);
									access_token = data.accessToken;
									uid = data.uid;


									AchievementService.shareFB(access_token, uid, id_achievement,id, function (response) {
										var data = response.data.c.data;
										if(data.error==false){
											//closeDetail();
											message(data.message);
											//vm.isFB = false;
										}
									}, function () {

									});
								});
								//console.log(id_achievement+'_'+id);
							},
							useAsTitle: function(id){
								var updated_filter = [{"filter_id":520,"filter_value" : id}];
								SettingService.updateUserFilter(updated_filter, '2').then(function(data) {
									
									message(data.message);
								});

							}
						}
					}
				);
			 },function(response){
			 	console.log(response);
			 });
		}

		return factory;
	}
})();