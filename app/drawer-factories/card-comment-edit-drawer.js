//-card-comment-edit
(function () {
	'use strict';

	angular
		.module('app')
		.factory('cardCommentEditDrawer', cardCommentEditDrawer);
	cardCommentEditDrawer.$inject = ['$rootScope', 'CiayoService', 'drawerFactory', '$filter'];

	function cardCommentEditDrawer($rootScope, CiayoService, drawerFactory, $filter) {
		var scrollPos = 0;
		var factory = {
			open:open,
			back:back,
			save:save,
			callback:angular.noop(),
			old_message:null,
			message:'',
			card:null
		};
		function open(message,card,callback){
			factory.callback=callback;
			factory.card = card;
			factory.old_message=factory.message=message;
			factory.back_text=$filter('translate')('$back');
			factory.save_text=$filter('translate')('$save');
			drawerFactory.title=$filter('translate')('$edit.comment');
			drawerFactory.drawer_class='-card-comment-edit';
			drawerFactory.template = DRAWER_VIEW+'card-comment-edit.html';
			drawerFactory.data = factory;
			$rootScope.$broadcast('drawer.open',{});
			scrollPos = $(window).scrollTop();
			$("html, body").css({"height": $(window).height(), "overflow": "hidden"});
		}
		function unlock(){
			$("html, body").removeAttr("style");
			$(window).scrollTop(scrollPos)
		}
		function back(){
			drawerFactory.setState();
			var data={'message':factory.old_message};
			factory.callback(data);
			unlock();
		}
		function save(){
			drawerFactory.setState();
			var data={'message':factory.message}
			factory.callback(data);
			unlock();
		}
		return factory;
	}
})();