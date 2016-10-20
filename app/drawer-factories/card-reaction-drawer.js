(function () {
	'use strict';

	angular
		.module('app')
		.factory('cardReactionDrawer', cardReactionDrawer);
	cardReactionDrawer.$inject = ['$rootScope','$filter', 'CiayoService', 'drawerFactory'];

	function cardReactionDrawer($rootScope,$filter, CiayoService, drawerFactory) {
		var factory = {
			open:open,
			back:back,
			save:save,
			callback:angular.noop(),
			reaction:{},
			
		};
		function open(reaction,callback){
			factory.callback=callback;
			factory.reaction=reaction;
			factory.back_text=$filter('translate')('$back');
			drawerFactory.title='Cimotion';
			drawerFactory.drawer_class='-card-cimotion';
			drawerFactory.template = DRAWER_VIEW+'card-reaction.html';
			drawerFactory.data = factory;
			$rootScope.$broadcast('drawer.open',{});
		}
		function back(){
			drawerFactory.setState();
		}
		function save(){
			drawerFactory.setState()
		}
		return factory;
	}
})();