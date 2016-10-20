(function () {
	'use strict';

	angular
		.module('app')
		.factory('cardDetailDrawer', cardDetailDrawer);
		cardDetailDrawer.$inject = ['$rootScope','$filter', 'CiayoService', 'drawerFactory'];

	var scrollPos = 0;
	function cardDetailDrawer($rootScope,$filter, CiayoService, drawerFactory) {
		var factory = {
			open:open,
			back:back,
			save:save,
			callback:angular.noop(),
			onLoad:angular.noop(),
			card:null,
			
		};
		function onLoad(){
			setTimeout(function(){
				$(".-card-detail .cm-card-comment ._input").on({
					"focus": function(){
						$(this).parent().addClass("-focus")
					},
					"blur": function(){
						$(this).parent().removeClass("-focus")
					}
				})
			}, 0)
		}
		function open(card,callback){
			factory.callback=callback;
			factory.onLoad=onLoad;
			factory.card=card;
			factory.back_text=$filter('translate')('$back');
			drawerFactory.title='Card Detail';
			drawerFactory.drawer_class='-card-detail';
			drawerFactory.template = DRAWER_VIEW+'card-detail.html';
			drawerFactory.data = factory;
			$rootScope.$broadcast('drawer.open',{});
			scrollPos = $(window).scrollTop();
			$("html, body").css({"height": $(window).height(), "overflow": "hidden"});
		}
		function back(){
			drawerFactory.setState();
			var data={'caption':factory.old_caption};
			factory.callback(data);
			$("html, body").removeAttr("style");
			$(window).scrollTop(scrollPos)
		}
		function save(){
			drawerFactory.setState();
			var data={'caption':factory.caption}
			factory.callback(data);
			$("html, body").removeAttr("style");
			$(window).scrollTop(scrollPos)
		}
		return factory;
	}
})();