(function() {
	'use strict';

	angular
		.module('app')
		.controller('SettingController', SettingController)
		.directive("limitTo", [function() {
		    return {
		        restrict: "A",
		        link: function(scope, elem, attrs) {
		            var limit = parseInt(attrs.limitTo);
		            angular.element(elem).on("keypress", function(e) {
		                if (this.value.length == limit) e.preventDefault();
		            });
		        }
		    }
		}])

	SettingController.$inject = ['settingFactory','modalFactory','CiayoService'];
	function SettingController(settingFactory, modalFactory, CiayoService) {

		var vm = this;
		angular.extend(vm,{
			st: new settingFactory()
		});

		function init(){
			//settingFactory.userBasicInfo();
			//settingFactory.generalSettings();
			//settingFactory.listPrefixPhone();
		}

		init();
	}
})();