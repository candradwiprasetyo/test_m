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
		.controller('ProfilePublicController', ProfilePublicController);

	ProfilePublicController.$inject = ['profilePublicFactory','modalFactory', 'CiayoService', 'timelineFactory'];
	function ProfilePublicController(profilePublicFactory, modalFactory, CiayoService, timelineFactory) {

		var vm = this;
		angular.extend(vm,{
			pr:profilePublicFactory,
			//timeline:timelineFactory,
			profile_url:"profile-public.html"
		});

		function init(){
			profilePublicFactory.state = 1;
			profilePublicFactory.email = null;
			profilePublicFactory.phone = null;
			profilePublicFactory.userBasicInfo();
			//profilePublicFactory.listPrefix();
			//profilePublicFactory.listChoiceBadge();
			// profilePublicFactory.listChoiceAchievement();
			// profilePublicFactory.listSocialMedia();
			// profilePublicFactory.select_tab = 1;
			// profilePublicFactory.getBanner();

			// vm.pr.state = 1;

			// vm.pr.user_list=[];
			// vm.pr.mutual_list=[];
			// vm.pr.count_friend_list = '';
			// vm.pr.count_mutual_list = '';

			// vm.pr.type='user';

			// vm.timeline.type='profile';
			// vm.timeline.init();
		}

		init();
	}
})();