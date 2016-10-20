(function() {
'use strict';

	angular
		.module('app')
		.controller('InventoryController', InventoryController);

	InventoryController.$inject = ['CiayoService','$rootScope'];
	function InventoryController(CiayoService, $rootScope) {
		var vm = this;

		$rootScope.$on('$stateChangeStart', function(){ 
			vm.initScroll = false;
			vm.isSortable = false;
		});


		vm.getCollection = getCollection;
		vm.deleteSticker = deleteSticker;

		vm.getEmoji = getEmoji;

		vm.getTransaction = getTransaction;
		vm.searchHistory = searchHistory;
		vm.clearHistory = clearHistory;

		vm.initScroll = false;
		vm.sortable = sortable;
		vm.disSortable = disSortable;

		vm.previewSticker = previewSticker;

		var el, foo;

		function getCollection() {
			$('.cm-inventory-item').remove();

			var c = {
				data: {
					offset: '0',
					limit: '18'
				}
			};

			vm.collection = [];
			vm.noData = null;
			CiayoService.Api('user/sticker', c, function(response){
				var data = response.data.c.data.content;
				vm.collection = data.sticker_collection;

				if(vm.collection.length){
					vm.noData = null;
				} else {
					vm.noData = 'No Data';
				}
			});
		}
		
		vm.getCollection();

		function deleteSticker(id, ind) {
			var c = {
				data: {
					sticker_collection_id: id
				}
			};

			CiayoService.Api('user/sticker/delete', c, function(response){
				vm.collection.splice(ind, 1);
				alert(response.data.c.data.message);
			});
		}

		function getEmoji() {
			var c = {
				data: {
					offset: '0',
					limit: '18'
				}
			};

			vm.collection = [];
			vm.noData = null;
			CiayoService.Api('user/emoji', c, function(response){
				var data = response.data.c.data.content;
				vm.emoji = data.emoji_collection;

				if(vm.collection.length){
					vm.noData = null;
				} else {
					vm.noData = 'No Data';
				}
			});
		}

		vm.getEmoji();

		function getTransaction() {
			vm.transaction = [];
			vm.noDatas = null;
			var today = new Date();
			var date_to = vm.endDate?vm.endDate:today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
			today.setDate(today.getDate()-7);
			var date_from = vm.startDate?vm.startDate:today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

			var c = {
				data: {
					date_from: date_from,
					date_to: date_to,
					offset: '0',
					limit: '18'
				}
			};

			vm.transaction = [];
			CiayoService.Api('user/order/history', c, function(response){
				var data = response.data.c.data.content;
				vm.transaction = data.list_order_history;
				if(vm.transaction.length == 0){
					vm.noDatas = true;
				}
			});
		}

		vm.getTransaction();

		function sortable() {
			if(!vm.initScroll){
				el = document.getElementById('sort');
				foo = Sortable.create(el, {
					animation: 150, 
					disabled: true, 
					onEnd: function (evt) {
						$('#sort .cm-inventory-item').each(function(e){
							if(evt.item.id === $(this).attr('id')){
								var order = parseInt($(this).prev().attr('data-order')) + 1;
								if(!order) {
									order = parseInt($(this).next().attr('data-order')) - 1;
								}
								changeOrder(order, evt.item.id);
							}
						});
					}
				});
				vm.initScroll = true;
			}
			vm.isSortable = true; var state = foo.option("disabled");
			foo.option("disabled", !state);
		}

		function disSortable() {
			vm.isSortable = false;
			vm.initScroll = false;
			var state = foo.option("disabled");
			foo.option("disabled", !state);
			getCollection();
		}

		function changeOrder(pos, id) {
			var c = {
				data: {
					sticker_collection_id: id,
					order: pos
				}
			}
			CiayoService.Api('ciayoproducts/priority', c, function(response){
			});
		}

		function searchHistory() {
			vm.startDate = angular.element('#startDateHidden').val();
			vm.endDate = angular.element('#endDateHidden').val();
			if(vm.startDate && vm.endDate){
				getTransaction();
			} else {
				alert('tanggal nya di isi dulu');
			}
		}

		function clearHistory() {
			vm.startDate = null;
			vm.endDate = null;
			angular.element('#startDateHidden').val('');
			angular.element('#endDateHidden').val('');
			angular.element('#startDate').val('');
			angular.element('#endDate').val('');

			vm.getTransaction();
		}

		function previewSticker(id) {
			vm.item_detail_load = false;
			$('.loader-wrp').show();
			$(".-sticker-detail").addClass("-open");
			var c = {
				data: {
					collection_id: id
				}
			};
			CiayoService.Api('user/sticker/collection/detail', c, function(response){
				var ok = false;
				var data = null;
				if(response.status==200) {
					data = response.data.c.data;
					var title=[];
					if(data.error == false) {
						ok = true;
					}
				}
				if(ok) {
					vm.itemDetail = response.data.c.data.content.sticker_collection;
					vm.item_detail_load = true;
				}
			});
		}

		vm.closePreview = closePreview;
		function closePreview() {
			$(".-sticker-detail").removeClass("-open");
		}
	}
})();