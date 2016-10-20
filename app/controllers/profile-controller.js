(function() {
	'use strict';

	angular
		.module('app')
		.directive("profileConnection", function(){
      		return {
      			restrict: "E",
      			scope: {},
				replace:true,
				templateUrl: 'profile-connection.html'
      		}
      	})
		.controller('ProfileController', ProfileController);

	ProfileController.$inject = ['profileFactory','modalFactory', 'CiayoService', 'timelineFactory', '$cookieStore'];
	function ProfileController(profileFactory, modalFactory, CiayoService, timelineFactory, $cookieStore) {

		var vm = this;
		angular.extend(vm,{
			pr:profileFactory,
			timeline:timelineFactory,
			profile_url:"profile.html"
		});

		function init(){
			profileFactory.reset();
			profileFactory.userBasicInfo();
			profileFactory.listTitle();
			profileFactory.listPrefix();
			profileFactory.listChoiceBadge();
			profileFactory.listChoiceAchievement();
			profileFactory.listSocialMedia();
			profileFactory.select_tab = 1;
			profileFactory.getBanner();
			profileFactory.language_id = parseInt($cookieStore.get('language'));

			vm.pr.state = 1;

			vm.pr.user_list=[];
			vm.pr.mutual_list=[];
			vm.pr.count_friend_list = '';
			vm.pr.count_mutual_list = '';

			vm.pr.type='user';
			//vm.pr.get_profile();

			vm.timeline.type='profile';
			vm.timeline.init();
		}

		init();
	}
})();