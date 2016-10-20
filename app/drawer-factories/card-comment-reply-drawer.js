//-card-comment-edit
(function () {
	'use strict';

	angular
		.module('app')
		.factory('cardCommentReplyDrawer', cardCommentReplyDrawer);
	cardCommentReplyDrawer.$inject = ['$rootScope', 'CiayoService', 'drawerFactory', '$filter'];

	function cardCommentReplyDrawer($rootScope, CiayoService, drawerFactory, $filter) {
		var scrollPos = 0;
		var factory = {
			open:open,
			back:back,
			save:save,
			callback:angular.noop(),
			onLoad:angular.noop(),
			old_message:null,
			message:'',
			card:null
		};
		function open(message,card,callback){
			factory.callback=callback;
			factory.onLoad=onLoad;
			factory.old_message=factory.message=message;
			factory.back_text=$filter('translate')('$back');
			factory.card = card;
			drawerFactory.title=$filter('translate')('$reply.comment');
			drawerFactory.drawer_class='-card-comment-reply';
			drawerFactory.template = DRAWER_VIEW+'card-comment-reply.html';
			drawerFactory.data = factory;
			$rootScope.$broadcast('drawer.open',{});
			scrollPos = $(window).scrollTop();
			$("html, body").css({"height": $(window).height(), "overflow": "hidden"});
		}
		function onLoad(){
			setTimeout(function(){
				$(".-card-comment-reply .cm-card-comment ._input").on({
					"focus": function(){
						$(this).parent().addClass("-focus")
					},
					"blur": function(){
						$(this).parent().removeClass("-focus")
					}
				})
			}, 0)
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