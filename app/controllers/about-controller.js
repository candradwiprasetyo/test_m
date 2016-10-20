(function() {
'use strict';

	angular
		.module('app')
		.controller('AboutController', AboutController);

	AboutController.$inject = ['CiayoService','$cookieStore'];
	function AboutController(CiayoService, $cookieStore) {
		var vm = this;

		vm.getPage = getPage;
		vm.closePanel = closePanel;

		function getPage(id) {
			$(".cm").addClass("-locked")
			$(".cm-panel.-privacy-policy").addClass("-open")
			vm.page = null;
			var lang_id = $cookieStore.get('language');
			var c = {
				data: {
					page_id: id,
					language_id: lang_id
				}
			};
			CiayoService.Api('page/detail', c, function(response){
				if(response.status == 200){
					vm.page = response.data.c.data.content;
				} else {
					alert('error');
				}
			});
		}

		function closePanel() {
			$(".cm").removeClass("-locked");
			$(".cm-panel.-privacy-policy").removeClass("-open");
		}
	}
})();