(function() {
'use strict';

	angular
		.module('app')
		.controller('AchievementSearchController', AchievementSearchController);

	AchievementSearchController.$inject = ['AchievementService'];
	function AchievementSearchController(AchievementService) {
		var vm = this;
		
		vm.achievement = [];
		vm.all = [];
		vm.onProgress = [];
		vm.completed = [];
		vm.detail = {};

		vm.orderType = 'name';
		vm.orderBy = 'asc';

		vm.getData = getData;
		vm.search = search;
		vm.changeOrder = changeOrder;
		vm.getDetail = getDetail;
		vm.closeDetail = closeDetail;

		function getData(url) {
			var data = {
				orderType: vm.orderBy,
				orderBy: vm.orderBy,
				limit: 10,
				offset: 0,
				search: vm.keyword
			};
			AchievementService.getData(
				url,
				data,
				function(data){
					if(data.error){
						alert(data.message);
					} else {
						var arr = data.content.data;
						switch(url){
							case 'badge':
								vm.badge = arr;
							break;
							case 'achievement/all':
								vm.all = arr;
							break;
							case 'achievement/progress':
								vm.onProgress = arr;
							break;
							case 'achievement/completed':
								vm.completed = arr;
							break;
						}
					}
				}
			);
		}

		function search() {
			if(vm.keyword){
				vm.getData('achievement/all');
			} else {
				alert('isi dulu keywrodnya');
			}
		}

		function changeOrder(type, by) {
			vm.orderType = type;
			vm.orderBy = by;
			console.log(type, by);
		}

		function getDetail(id) {
			var elem = angular.element('.cm-panel.cm-achievement');
			elem.addClass('-open');
			AchievementService.getDetail(id, function(data){
				if(data.error){
					alert(data.message);
				} else {
					vm.detail = data.content;
					console.log(vm.detail);
				}
			});
		}

		function closeDetail() {
			var elem = angular.element('.cm-panel.cm-achievement');
			elem.removeClass('-open');
			vm.detail = {};
		}
	}
})();