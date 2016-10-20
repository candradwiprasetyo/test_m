(function () {
	'use strict';

	angular
		.module('app')
		.factory('cardCaptionDrawer', cardCaptionDrawer);
	cardCaptionDrawer.$inject = ['$rootScope', 'CiayoService', 'drawerFactory', '$filter'];

	function cardCaptionDrawer($rootScope, CiayoService, drawerFactory, $filter) {
		var factory = {
			open:open,
			back:back,
			save:save,
			callback:angular.noop(),
			old_caption:null,
			caption:'',
			activity:null,
			
		};
		function open(type,caption,parallax,callback){
			factory.callback=callback;
			factory.old_caption=factory.caption=caption;
			factory.parallax =parallax;
			factory.back_text=$filter('translate')('$back');
			factory.save_text=$filter('translate')('$save');
			if(type=='ADD'){
				drawerFactory.title=$filter('translate')('$add.a.caption');
			}else{
				drawerFactory.title=$filter('translate')('$edit.caption');
			}
			drawerFactory.drawer_class='-timeline-post-caption';
			drawerFactory.template = DRAWER_VIEW+'card-caption.html';
			drawerFactory.data = factory;
			$rootScope.$broadcast('drawer.open',{});
		}
		function back(){
			drawerFactory.setState();
			var data={'caption':factory.old_caption};
			factory.callback(data);
		}
		function save(){
			drawerFactory.setState();
			var data={'caption':factory.caption}
			factory.callback(data);
		}
		return factory;
	}
})();