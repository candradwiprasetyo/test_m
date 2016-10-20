(function() {
'use strict';

	angular
		.module('app')
		.controller('AchievementController', AchievementController);

	AchievementController.$inject = ['AchievementService','$state','facebookFactory','modalFactory', '$filter'];
	function AchievementController(AchievementService,$state,facebookFactory,modalFactory,$filter) {
		var vm = this;

		var offset = 0;
		var height = 600;

		vm.badge = [];
		vm.searchStatus = false;
		vm.loadingMore = false;

		vm.options = [
			{
				title: $filter('translate')('$ascending(a-z)'),
				type: 'name',
				by: 'asc'
			},
			{
				title: $filter('translate')('$descending(z-a)'),
				type: 'name',
				by: 'desc'
			},
			{
				title: $filter('translate')('$highest.to.lowest'),
				type: 'score',
				by: 'desc'
			},
			{
				title: $filter('translate')('$lowest.to.high'),
				type: 'score',
				by: 'asc'
			}
		];
		vm.option = vm.options[0];
		vm.orderType = 'name';
		vm.orderBy = 'asc';

		vm.getData = getData;
		vm.changeOrder = changeOrder;
		vm.getDetail = getDetail;
		vm.closeDetail = closeDetail;
		vm.search = search;

		vm.openShare = openShare;
		vm.closeShare = closeShare;$state

		vm.shareFB = shareFB;

		function getData(url, offset) {
			if(!offset){
				vm.achievement = [];
				offset = 0;
				height = 600;
			}
			vm.noData = null;
			var offset = offset?offset:0;
			var data = {
				orderType: vm.orderType,
				orderBy: vm.orderBy,
				limit: 10,
				offset: offset,
				search: vm.keyword
			};
			AchievementService.getData(
				url,
				data,
				function(data){
					if(data.error){
						alert(data.message);
					} else {
						if(url == 'badge'){
							vm.badge = data.content.data;
						} else {
							vm.achievement = vm.achievement.concat(data.content.data);
							if(vm.achievement.length == 0){
								vm.noData = 'No Data';
							} else {
								vm.noData = null;
							}
							$('#load-more').hide();
							vm.loadingMore = false;
						}
					}
				}
			);
		}

		vm.getData('badge');
		vm.getData('achievement/all');

		function changeOrder(type, by) {
			vm.orderType = type;
			vm.orderBy = by;
			if(vm.tabs == 1){
				vm.getData('achievement/progress');
			} else if(vm.tabs == 2){
				vm.getData('achievement/completed');
			} else {
				vm.getData('achievement/all');
			}
		}

		function getDetail(id) {
			angular.element('body').addClass('-locked');
			vm.detail = null;
			var elem = angular.element('.cm-panel.cm-achievement');
			elem.addClass('-open');
			elem.attr('style', 'height: '+$(document).height());
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
			angular.element('body').removeClass('-locked');
			var elem = angular.element('.cm-panel.cm-achievement');
			elem.removeClass('-open');
			vm.detail = {};
		}

		vm.setTitle = setTitle;
		function setTitle(title) {
			AchievementService.setTitle(title, function(response){
				modalFactory.message(response.message);
			});
		}

		function search() {
			if(vm.tabs == 1){
				vm.getData('achievement/progress');
			} else if(vm.tabs == 2){
				vm.getData('achievement/completed');
			} else {
				vm.getData('achievement/all');
			}
		}

		function openShare() {
			$('.-archievement-share').addClass('-open');
		}

		function closeShare() {
			$('.-archievement-share').removeClass('-open');
		}

		function shareFB(id_achievement, id) {
			var access_token = '';
			var uid = '';
			if(!vm.isFB){
				vm.isFB = true;
				facebookFactory.getToken(function (data) {
					access_token = data.accessToken;
					uid = data.uid;
					AchievementService.shareFB(access_token, uid, id_achievement,id, function(data){
						modalFactory.message(data.message);
						vm.isFB = false;
						vm.closeShare();
					});
				});
			}
		}

		function loadMore() {
			offset += 10;
			height += 600;
			if(vm.tabs == 1){
				vm.getData('achievement/progress', offset);
			} else if(vm.tabs == 2){
				vm.getData('achievement/completed', offset);
			} else {
				vm.getData('achievement/all', offset);
			}
		}

		$(window).scroll(function(e){
			var winTop = $(this).scrollTop();
			if(winTop > height && vm.loadingMore == false){
				vm.loadingMore = true;
				$('#load-more').show();
				loadMore();
			}
		})
	}
})();