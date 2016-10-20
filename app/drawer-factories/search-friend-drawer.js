(function () {
	'use strict';

	angular
		.module('app')
		.factory('searchFriendDrawer', searchFriendDrawer);
	searchFriendDrawer.$inject = ['$rootScope', 'CiayoService', 'drawerFactory','searchFriendFactory'];

	function searchFriendDrawer($rootScope, CiayoService, drawerFactory,searchFriendFactory) {
		var factory = {
			open:open,
			back:back,
			callback:angular.noop(),
			searchFriend:searchFriendFactory,
			load_drawer:load_drawer
		};
		function open(user_id){
			factory.back_text='back';
			searchFriendFactory.loader_drawer = true;
			searchFriendFactory.user_list=[];
			searchFriendFactory.count_friend_list='';
			
			load_drawer(user_id);
			searchFriendFactory.user_id=user_id;
			drawerFactory.title='Search Friends';
			
			drawerFactory.drawer_class='-search-friend-drawer';
			drawerFactory.template = DRAWER_VIEW+'search-friend.html';
			drawerFactory.data = factory;
			$rootScope.$broadcast('drawer.open',{});
		}
		function back(){
			drawerFactory.setState();
		}

		function load_drawer(user_id){
			searchFriendFactory.init();
			searchFriendFactory.user_id=user_id;
			searchFriendFactory.get_profile();
			
		}


		
		return factory;
	}
})();