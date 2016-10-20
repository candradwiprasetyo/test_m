(function () {
	'use strict';
	angular
		.module('app')
		.controller('NotificationController', NotificationController);
		
	NotificationController.$inject = ['CiayoService','modalFactory','notificationFactory', '$scope'];
	function NotificationController(CiayoService,modalFactory,notificationFactory, $scope) {
		var vm = this;
		angular.extend(vm,{
			notification:notificationFactory
		});

		function init(){
			vm.notification.mark_all_notification();
			vm.notification.getNotificationList(true);
			vm.notification.notification_start = false;
			vm.notification.load_more = false;
			vm.notification.init();
			
		}

		init();
	}
})();