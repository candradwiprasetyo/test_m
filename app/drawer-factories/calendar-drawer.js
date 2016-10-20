(function () {
	'use strict';

	angular
		.module('app')
		.factory('calendarDrawer', calendarDrawer);
	calendarDrawer.$inject = ['$rootScope', 'CiayoService', 'drawerFactory' , '$filter'];

	function calendarDrawer($rootScope, CiayoService, drawerFactory, $filter) {
		var default_options={
			firstDay: 1,
			format: 'DD/MM/YYYY',
			bound: false
		};
		var factory = {
			open:open,
			back:back,
			save:save,
			callback:angular.noop(),
			old_date:null,
			date:'',
		};
		function open(type,date,options,callback){
			var _options = default_options;
			angular.extend(_options,options);
			factory.options=_options;
			factory.back_text=$filter('translate')('$back');
			factory.save_text=$filter('translate')('$save');
			date = moment(date).format(factory.options.format);
			factory.callback=callback;
			factory.old_date=factory.date=date;
			drawerFactory.title=$filter('translate')('$pick.a.date');
			drawerFactory.drawer_class='-timeline-post-date';
			drawerFactory.template = DRAWER_VIEW+'calendar.html';
			drawerFactory.data = factory;
			factory.old_date=date;
			factory.date=date;
			$rootScope.$broadcast('drawer.open',{});
		}
		function back(){
			drawerFactory.setState();
			var data={'date':factory.old_date};
			factory.callback(data);
		}
		function save(){
			drawerFactory.setState();
			var data={'date':factory.date}
			factory.callback(data);
		}
		return factory;
	}
})();