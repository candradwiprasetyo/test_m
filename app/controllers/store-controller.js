(function() {
	'use strict';

	angular
		.module('app')
		.controller('StoreController', StoreController);

	StoreController.$inject = ['storeFactory','modalFactory','CiayoService', '$rootScope'];
	function StoreController(storeFactory, modalFactory, CiayoService, $rootScope) {

		var vm = this;
		angular.extend(vm,{
			st:storeFactory
		});

		function renderBanner(){
			setTimeout(function(){
				$(".cm-store-slide").owlCarousel({
					items: 1,
					nav: true,
					loop: true,
					autoplay: true,
					navText: ["<i class='ci-prev'></i>","<i class='ci-next'></i>"]
				});
			}, 500);
		}
		function init() {
			storeFactory.bannerHome( function(){renderBanner()} );
			storeFactory.loadList('popular', '1','0','0','5','0','');
			storeFactory.bannerPremium( function(){renderBanner()} );
			storeFactory.loadList('premium','0','1','0','5','0','');
			storeFactory.bannerContributor( function(){renderBanner()} );
			storeFactory.loadList('contributor','2','0','0','5','0','');
			storeFactory.bannerFree( function(){renderBanner()} );
			storeFactory.loadList('free','0','2','0','5','0','');
			storeFactory.loadList('all','0','0','0','5','0','');
			storeFactory.loadEmoji(0,5);
			storeFactory.loadBalance();
			storeFactory.menu=1;
		}

		vm.loadMoreAll = loadMoreAll;
		vm.offsetAll = 12;
		function loadMoreAll() {
			vm.offsetAll += 12;
			storeFactory.loadList('all','0','0',vm.offsetAll,'12','0','');
		}

		$rootScope.$on('$stateChangeSuccess', function(){ 
			renderBanner();
		});

		init();
	}
})();