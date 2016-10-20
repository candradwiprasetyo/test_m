(function() {
	'use strict';

	angular
		.module('app')
		.factory('languageFactory', languageFactory);

	languageFactory.$inject = ['CiayoService', '$stateParams', '$filter', '$cookieStore', '$translate', 'modalFactory'];

	function languageFactory(CiayoService, $stateParams, $filter, $cookieStore, $translate, modalFactory) {
		var factory = {
			getLanguage:getLanguage,
			changeLanguage:changeLanguage
		}

		function getLanguage() {
			var c={data:{}};
            CiayoService.Api('language', c, function(response) {
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
					factory.current_language = data.content.language;
					modalFactory.log('language: '+factory.current_language,'info');
					var lang_code = ['','en', 'id'];
					$translate.use(lang_code[factory.current_language]);
					$cookieStore.put('language', factory.current_language);
				} else {

				}
            });
		}
		function changeLanguage(language_id, callback) {
			var c={
				data:{
					language_id: language_id
				}
			};
            CiayoService.Api('language', c, function(response) {
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
					factory.current_language = data.content.language;
					modalFactory.log('language: '+factory.current_language,'info');
					var lang_code = ['','en', 'id'];
					$translate.use(lang_code[factory.current_language]);
					$cookieStore.put('language', factory.current_language);
					callback(factory.current_language);
				} else {

				}
            });
		}
		return factory;
	}
})();