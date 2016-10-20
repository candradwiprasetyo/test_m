(function () {
	'use strict';

	angular
		.module('app')
		.factory('mutualFriendDrawer', mutualFriendDrawer);
	mutualFriendDrawer.$inject = ['$rootScope', 'CiayoService', 'drawerFactory','mutualFriendFactory'];

	function mutualFriendDrawer($rootScope, CiayoService, drawerFactory,mutualFriendFactory) {
		var factory = {
			open:open,
			back:back,
			callback:angular.noop(),
			mutualFriend:mutualFriendFactory,
			load_drawer:load_drawer
		};
		function open(user_id, username){
			factory.back_text='back';
			mutualFriendFactory.loader_drawer = true;

			load_drawer(user_id, username);
			drawerFactory.title='Mutual Friends';
			
			drawerFactory.drawer_class='-mutual-friend-drawer';
			drawerFactory.template = DRAWER_VIEW+'mutual-friend.html';
			drawerFactory.data = factory;
			$rootScope.$broadcast('drawer.open',{});
		}
		function back(){
			drawerFactory.setState();
		}

		function load_drawer(user_id, username){
			mutualFriendFactory.user_id=user_id;
			mutualFriendFactory.username=username;
			mutualFriendFactory.getMutualFriendList(true);
			
		}


		
		return factory;
	}
})();