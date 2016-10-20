(function() {
	'use strict';

	angular
		.module('app')
		.factory('storeFactory', storeFactory);

	storeFactory.$inject = ['$cookieStore','$filter', '$rootScope', '$state', '$stateParams', 'modalFactory', 'CiayoService'];

	function storeFactory($cookieStore,$filter, $rootScope, $state, $stateParams, modalFactory, CiayoService) {
		var factory = {
			loadFeatures:loadFeatures,
			bannerHome:bannerHome,
			bannerPremium:bannerPremium,
			bannerContributor:bannerContributor,
			bannerFree:bannerFree,
			loadCategory:loadCategory,
			loadList:loadList,
			loadEmoji:loadEmoji,
			viewDetail:viewDetail,
			loadBalance:loadBalance,
			getAllSticker:getAllSticker,
			buySticker:buySticker,
			search:search,
			searchItem:searchItem,
			showAll:showAll,
			previewSticker:previewSticker,
			stickerClickOutside:stickerClickOutside,
			loadMore:loadMore,
			loadMoreFree:loadMoreFree,

			storeTab:storeTab,
			closeDetailDrawer:closeDetailDrawer,
			closeSeeAllDrawer:closeSeeAllDrawer,
			closeSearchDrawer:closeSearchDrawer,
			menu:1,
			goto_back:goto_back,
			list_is_loading :{},
			list_is_full:{}
		};

		function loadFeatures() {
			var c = {
				data: {
					offset: "0",
					limit: "3"
				}
			}
			CiayoService.Api('ciayoproducts/banner', c, function(response){
				var ok = false;
								var data = null;
				if(response.status==200) {
					data = response.data.c.data;
					modalFactory.log(data,'info');
					var title=[];
					if(data.error == false) {
						ok = true;
					}
				}
				if(ok) {
					modalFactory.log(data.message);
					factory.listFeatured = response.data.c.data.content.list_store_banner;
				} else {
					modalFactory.log(data.message);
				}
			});
		}

		function bannerHome(callback) {
			var c = {
				data: {
					page: 1,
					offset: 0,
					limit: 3
				}
			}
			CiayoService.Api('ciayoproducts/banner', c, function(response){
				var ok = false;
								var data = null;
				if(response.status==200) {
					data = response.data.c.data;
					modalFactory.log(data,'info');
					var title=[];
					if(data.error == false) {
						ok = true;
					}
				}
				if(ok) {
					if(!factory.listBannerHome) {
						modalFactory.log(data.message);
						factory.listBannerHome = response.data.c.data.content.list_store_banner;
						callback();
					}
				} else {
					modalFactory.log(data.message);
				}
			});
		}

		function bannerPremium(callback) {
			var c = {
				data: {
					page: 2,
					offset: 0,
					limit: 3
				}
			}
			CiayoService.Api('ciayoproducts/banner', c, function(response){
				var ok = false;
				var data = null;
				if(response.status==200) {
					data = response.data.c.data;
					modalFactory.log(data,'info');
					var title=[];
					if(data.error == false) {
						ok = true;
					}
				}
				if(ok) {
					modalFactory.log(data.message);
					factory.listBannerPremium = response.data.c.data.content.list_store_banner;
					callback();
				} else {
					modalFactory.log(data.message);
				}
			});
		}

		function bannerContributor(callback) {
			var c = {
				data: {
					page: 3,
					offset: 0,
					limit: 3
				}
			}
			CiayoService.Api('ciayoproducts/banner', c, function(response){
				var ok = false;
				var data = null;
				if(response.status==200) {
					data = response.data.c.data;
					modalFactory.log(data,'info');
					var title=[];
					if(data.error == false) {
						ok = true;
					}
				}
				if(ok) {
					modalFactory.log(data.message);
					factory.listBannerContributor = response.data.c.data.content.list_store_banner;
					callback();
				} else {
					modalFactory.log(data.message);
				}
			});
		}

		function bannerFree(callback) {
			var c = {
				data: {
					page: 4,
					offset: 0,
					limit: 3
				}
			}
			CiayoService.Api('ciayoproducts/banner', c, function(response){
				var ok = false;
								var data = null;
				if(response.status==200) {
					data = response.data.c.data;
					modalFactory.log(data,'info');
					var title=[];
					if(data.error == false) {
						ok = true;
					}
				}
				if(ok) {
					modalFactory.log(data.message);
					factory.listBannerFree = response.data.c.data.content.list_store_banner;
					callback();
				} else {
					modalFactory.log(data.message);
				}
			});
		}

		factory.listAll = [];
		function loadList(type,order, status, offset, limit, cat, keyword, load_more) {
			if(factory.list_is_loading[cat+'-'+order+'-'+status]==true ||
				 factory.full){
				return;
			}
			factory.list_is_loading[cat+'-'+order+'-'+status]=true;
			var c = {
				"category_id": cat,
				"keyword": keyword,
				"user": "",
				"order": order,
				"status": status,
				"offset": offset,
				"limit": limit
			};
			factory.isLoadingMore = true;
			CiayoService.Api('ciayoproducts/sticker', c, function(response){
				var ok = false;
				var data = null;
				if(response.status==200) {
					data = response.data.c.data;
					modalFactory.log(data,'info');
					var title=[];
					if(data.error == false) {
						ok = true;
					}
					if(!data.content.data.length){
						factory.noDataAll = true;
					}
				}
				if(ok) {
					factory.list_is_loading[cat+'-'+order+'-'+status]=false;
					modalFactory.log(data.message);
					var data = response.data.c.data.content.data;
					if(type=='popular') {
						if(load_more) {
							if(data.length) {
								factory.listPopular = factory.listPopular.concat(data);
								factory.listSeeAll = factory.listPopular;
							} else {
								factory.full = true;
								factory.load_more = false;
							}
						} else {
							factory.listPopular = data;
						}
						factory.popular_order = order;
						factory.popular_status = status;
						factory.popular_offset = offset;
						factory.popular_limit = limit;
						factory.popular_cat = cat;
					}
					if(type=='premium') {
						if(load_more) {
							if(data.length) {
								factory.listPremium = factory.listPremium.concat(data);
								factory.listSeeAll = factory.listPremium;
							} else {
								factory.full = true;
								factory.load_more = false;
							}
						} else {
							factory.listPremium = data;
						}
						factory.premium_order = order;
						factory.premium_status = status;
						factory.premium_offset = offset;
						factory.premium_limit = limit;
						factory.premium_cat = cat;
					}
					if(type=='contributor') {
						if(load_more) {
							if(data.length) {
								factory.listContributor = factory.listContributor.concat(data);
								factory.listSeeAll = factory.listContributor;
							} else {
								factory.full = true;
								factory.load_more = false;
							}
						} else {
							factory.listContributor = data;
						}
						factory.contributor_order = order;
						factory.contributor_status = status;
						factory.contributor_offset = offset;
						factory.contributor_limit = limit;
						factory.contributor_cat = cat;
					}
					if(type=='free') {
						if(load_more) {
							if(data.length) {
								factory.listFree = factory.listFree.concat(data);
								factory.listSeeAll = factory.listFree;
							} else {
								factory.full = true;
								factory.full_free = true;
								factory.load_more = false;
							}
						} else {
							factory.listFree = data;
						}
						factory.free_order = order;
						factory.free_status = status;
						factory.free_offset = offset;
						factory.free_limit = limit;
						factory.free_cat = cat;

					}
					if(type=='all') {
						if(load_more) {
							factory.listAll = factory.listAll.concat(data);
							factory.listSeeAll = factory.listAll;
						} else {
							factory.listAll = data;
						}
					}
					factory.isLoadingMore = false;
					factory.load_more = false;
				} else {
					modalFactory.log(data.message);
				}
			});

		}

		function loadMore() {
			factory.load_more = true;
			factory.offset = parseInt(factory.offset)+5;
			if(factory.type=='emoji') {
				loadEmoji(factory.offset, factory.limit, 'load_more');
			} else {
				loadList(factory.type, factory.order, factory.status, factory.offset, factory.limit, factory.cat, '', 'load_more');
			}
		}

		factory.offset_free = 0;

		function loadMoreFree() {
			factory.load_more = true;
			factory.offset_free = parseInt(factory.offset_free)+5;
			loadList('free','0','2',factory.offset_free,'5','0', '', 'load_more');
		}

		function loadCategory() {
			var c = {
				data: {
					offset: "0",
					limit: "3"
				}
			}
			CiayoService.Api('ciayoproducts/category', c, function(response){
				var ok = false;
				var data = null;
				if(response.status==200) {
					modalFactory.log('list category');
					data = response.data.c.data;
					modalFactory.log(data,'info');
					var title=[];
					if(data.error == false) {
						ok = true;
					}
				}
				if(ok) {
					modalFactory.log(data.message);
					factory.listCategory = response.data.c.data.content.list_category_ciayo_product;
				} else {
					modalFactory.log(data.message);
				}
			});
		}

		function loadListCategory() {
			if(type == 'premium'){
				var order1 = 0;
				var order2 = 1;
			} else {
				var order1 = 2;
				var order2 = 0;
			}

		}

		function loadEmoji(offset,limit,load_more) {
			var c = {
				data: {
					offset: offset,
					limit: limit
				}
			}
			CiayoService.Api('ciayoproducts/emoji', c, function(response){
				var ok = false;
				var data = null;
				if(response.status==200) {
					data = response.data.c.data;
					modalFactory.log(data,'info');
					var title=[];
					if(data.error == false) {
						ok = true;
					}
				}
				if(ok) {
					modalFactory.log('list emoji');
					modalFactory.log(data.message);
					var data = response.data.c.data.content.list_emoji;
					if(load_more) {
						if(data.length) {
							factory.listEmoji = factory.listEmoji.concat(data);
							factory.listSeeAll = factory.listEmoji;
						} else {
							factory.full = true;
						}
					} else {
						factory.listEmoji = data;
					}
					factory.emoji_offset = offset;
					factory.emoji_limit = limit;
					factory.load_more = false;
				} else {
					modalFactory.log(data.message);
				}
			});
		}

		function viewDetail(id, type) {
			//closeSearchDrawer();
			factory.type = type;
			factory.item_detail_load = false;
			$('.loader-wrp').show();
			$('body').addClass('-locked');
			$(".-sticker-detail").addClass("-open");
			var c = {
				data: {
					product_id: id
				}
			};
			if(type=='emoji') {
				CiayoService.Api('ciayoproducts/emoji/detail', c, function(response){
					var ok = false;
					var data = null;
					if(response.status==200) {
						data = response.data.c.data;
						modalFactory.log(data,'info');
						var title=[];
						if(data.error == false) {
							ok = true;
						}
					}
					if(ok) {
						modalFactory.log('view detail');
						modalFactory.log(data.message);
						factory.itemDetail = response.data.c.data.content;
						factory.item_detail_load = true;
					} else {
						modalFactory.log(data.message);
					}
				});
			} else {
				CiayoService.Api('ciayoproducts/sticker/detail', c, function(response){
					var ok = false;
									var data = null;
					if(response.status==200) {
						data = response.data.c.data;
						modalFactory.log(data,'info');
						var title=[];
						if(data.error == false) {
							ok = true;
						}
					}
					if(ok) {
						modalFactory.log('view detail');
						modalFactory.log(data.message);
						factory.itemDetail = response.data.c.data.content;
						factory.item_detail_load = true;
					} else {
						modalFactory.log(data.message);
					}
				});
			}
		}

		function closeDetailDrawer() {
			$(".-sticker-detail").removeClass("-open");
			$('body').removeClass('-locked');
		}

		function closeSearchDrawer() {
			$(".-sticker-search").removeClass("-open");
			$('body').removeClass('-locked');
			factory.listSearchItem=[];
		}

		function closeSeeAllDrawer() {
			$(".-sticker-all").removeClass("-open");
			$('body').removeClass('-locked');
			factory.listSeeAll=[];
		}

		function loadBalance() {
			var c = {
				data:{}
			};
			CiayoService.Api('user/coin/balance', c, function(response){
				modalFactory.log('caps');
				modalFactory.log(response.data.c.data.content);
				var data = response.data.c.data.content;
				factory.caps = data.cash;
				factory.cans = data.coin;
			});
		}

		function buySticker(){
			if(!factory.itemDetail.bought){
				var c = {
					data: {
						product_id: factory.itemDetail.product_id,
						price: factory.itemDetail.price_1,
						price_type: 'price_1'
					}
				};

				CiayoService.Api('ciayoproducts/buy', c, function(response){
					var ok = false;
									var data = null;
					if(response.status==200) {
						data = response.data.c.data;
						modalFactory.log(data,'info');
						var title=[];
						if(data.error == false) {
							ok = true;
						}
					}
					if(ok) {
						modalFactory.log(data.message);
						modalFactory.message(data.message);
						closeDetailDrawer();
						loadBalance();
					} else {
						modalFactory.log(data.message);
						modalFactory.message(data.message);
						closeDetailDrawer();
					}
				});
			}
		}

		function searchItem() {
			factory.item_search_load = false;
			$('.loader-wrp').show();
			$('body').addClass('-locked');
			if(factory.keyword) {
				search('0','0','0','18','0',factory.keyword);
			}
		}

		function search(order, status, offset, limit, cat, keyword){
			var c = {
				"category_id": cat,
				"keyword": keyword,
				"user": "",
				"order": order,
				"status": status,
				"offset": offset,
				"limit": limit
			};
			CiayoService.Api('ciayoproducts/sticker', c, function(response){
				var ok = false;
								var data = null;
				if(response.status==200) {
					data = response.data.c.data;
					modalFactory.log(data,'info');
					var title=[];
					if(data.error == false) {
						ok = true;
					}
				}
				if(ok) {
					modalFactory.log(data.message);
					factory.listSearchItem = response.data.c.data.content.data;
					factory.item_search_load = true;
					if(factory.listSearchItem.length>0){
						$(".-sticker-search").addClass("-open");
					}else{
						modalFactory.message($filter('translate')('$not.found'));
					}
				} else {
					modalFactory.log(data.message);
				}
			});
		}

		function getAllSticker(category_id, keyword, offset, limit){
			factory.item_all_load = false;
			var c = {
				"category_id": category_id,
				"keyword": keyword,
				"offset": offset,
				"limit": limit
			};
			CiayoService.Api('ciayoproducts/sticker', c, function(response){
				var ok = false;
								var data = null;
				if(response.status==200) {
					data = response.data.c.data;
					modalFactory.log('all sticker');
					modalFactory.log(data,'info');
					var title=[];
					if(data.error == false) {
						ok = true;
					}
				}
				if(ok) {
					modalFactory.log(data.message);
					factory.listAllItem = response.data.c.data.content.data;
					factory.item_all_load = true;
				} else {
					modalFactory.log(data.message);
				}
			});
		}

		function showAll(title,type) {
			factory.full = false;
			factory.offset = 0;
			factory.see_all_title = title;
			$(".-sticker-all").addClass("-open");
			$('body').addClass('-locked');
			if(type==1) {
				factory.listSeeAll = factory.listPopular;
				factory.type = 'popular';
				factory.order = factory.popular_order;
				factory.status = factory.popular_status;
				factory.offset = factory.popular_offset;
				factory.limit = factory.popular_limit;
				factory.cat = factory.popular_cat;
			}
			if(type==2) {
				factory.listSeeAll = factory.listPremium;
				factory.type = 'premium';
				factory.order = factory.premium_order;
				factory.status = factory.premium_status;
				factory.offset = factory.premium_offset;
				factory.limit = factory.premium_limit;
				factory.cat = factory.premium_cat;
			}
			if(type==3) {
				factory.listSeeAll = factory.listContributor;
				factory.type = 'contributor';
				factory.order = factory.contributor_order;
				factory.status = factory.contributor_status;
				factory.offset = factory.contributor_offset;
				factory.limit = factory.contributor_limit;
				factory.cat = factory.contributor_cat;
			}
			if(type==4) {
				factory.listSeeAll = factory.listFree;
				factory.type = 'free';
				factory.order = factory.free_order;
				factory.status = factory.free_status;
				factory.offset = factory.free_offset;
				factory.limit = factory.free_limit;
				factory.cat = factory.free_cat;
			}
			if(type==5) {
				factory.listSeeAll = factory.listAll;
				factory.type = 'all';
			}
			if(type==6) {
				factory.listSeeAll = factory.listEmoji;
				factory.type = 'emoji';
				factory.offset = factory.emoji_offset;
				factory.limit = factory.emoji_limit;
			}
		}

		function storeTab(id) {
			if(id==5) {
				getAllSticker(null, null, 20, 0);
			}
			factory.menu_open = id;
			factory.menu = id;
			var $inner = $(".store-inner-content");
			$inner.animate({
					left: "-"+(id-1)+"00%"
			},200);
		}

		factory.sticker = [];
		factory.toogle_sticker = [];
		function previewSticker($event,id) {
			if(factory.current_id!=id) {
				factory.toogle_sticker[factory.current_id] = false;
			}
			if(!factory.toogle_sticker[id]) {
				factory.toogle_sticker[id] = true;
				angular.element('.stickeritem').addClass('inactive');
				angular.element($event.target).removeClass('inactive');
				angular.element($event.target).addClass('active');
				factory.current_id = id;
			} else {
				factory.toogle_sticker[id] = false;
				angular.element('.stickeritem').removeClass('inactive');
				angular.element('.stickeritem').removeClass('active');
			}
			
		}

		function stickerClickOutside(){
			angular.element('.stickeritem').removeClass('inactive');
			angular.element('.stickeritem').removeClass('active');
		}

		function goto_back(){
			window.history.back();
		}

		return factory;
	}
})();