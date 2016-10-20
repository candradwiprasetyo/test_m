(function() {
	'use strict';	

	angular.module('app', [
		//Angular
		'ui.router','ngCookies','ngSanitize','pascalprecht.translate','angulartics','angulartics.google.analytics',
		//Kelompokkan module per kategori ya
		//DIRECTIVE GLOBAL
		'CiayoNavbar','CiayoModal','CiayoUtil', 'TrendingNavbar','CiayoDrawer',
		//DIRECTIVE PARTIAL
		'CiayoTimeline','CiayoCard', 'CiayoFriendConnection','btford.socket-io'
	])
	.config(config)
	.run(run);
	
	config.$inject = ['$stateProvider','$urlRouterProvider','$locationProvider','$translateProvider','$cookiesProvider'];
	function config($stateProvider, $urlRouterProvider, $locationProvider, $translateProvider, $cookiesProvider){
		if(!$cookiesProvider.defaults.expires){
			var date = new Date();
			date.setDate(date.getDate() + 7);
			$cookiesProvider.defaults.expires = date;
		}

		$locationProvider.html5Mode(!DEVELOPMENT);
		// Translate
		$translateProvider.translations('en', EN)
		$translateProvider.translations('id', ID)
		$translateProvider.useSanitizeValueStrategy('escapeParameters')
		$translateProvider.preferredLanguage('id');
		// Remove Hashtag
		// $locationProvider.html5Mode(true);
		// Default Route
		$urlRouterProvider.when('', '/', ['$state', function($state){
			$state.go('/');
		}]);
		// Redirect to 404
		$urlRouterProvider.otherwise("/404");
		// Set Routing
		$stateProvider
			.state('404', {
				url: '/404',
				template: '<h1 style="text-align: center">404 Page not Found</h1>'
			})
			.state('/', {
				url: '/',
				templateUrl: 'timeline.html',
				authenticate: true
			})
			.state('timeline', {
				url: '/timeline',
				templateUrl: 'timeline.html',
				controller: 'TimelineController',
				controllerAs: 'vm',
				authenticate: true
			})
			.state('detail-page', {
				url: '/detail-page/:post_code',
				templateUrl: 'detail-page.html',
				controller: 'DetailPageController',
				controllerAs: 'vm',
				authenticate: false
			})
			.state('welcome', {
				url: '/welcome',
				templateUrl: 'welcome.html',
				controller: 'WelcomeController',
				controllerAs: 'vm',
				authenticate: false
			})
			.state('popcon', {
				url: '/popcon',
				templateUrl: 'welcome.html',
				controller: 'WelcomeController',
				controllerAs: 'vm',
				authenticate: false
			})
			.state('forgot-password', {
				url: '/forgot-password',
				templateUrl: 'forgot-password.html',
				controller: 'WelcomeController',
				controllerAs: 'vm',
				authenticate: false
			})
			.state('forgot-password-success', {
				url: '/forgot-password',
				templateUrl: 'forgot-password-success.html',
				controller: 'WelcomeController',
				controllerAs: 'vm',
				authenticate: false
			})
			.state('reset-password', {
				url: '/reset-password/:token',
				templateUrl: 'reset-password.html',
				controller: 'WelcomeController',
				controllerAs: 'vm',
				authenticate: false
			})
			.state('create-avatar', {
				abstract: true,
				url: '/create-avatar',
				templateUrl: 'create-avatar.html',
				controller: 'CreateAvatarController',
				controllerAs: 'vm',
				authenticate: true
			})
			.state('create-avatar.gender', {
				url: '',
				templateUrl: 'wizzard-gender.html',
				authenticate: true
			})
			.state('create-avatar.name', {
				url: '',
				templateUrl: 'wizzard-hello.html',
				authenticate: true
			})
			.state('create-avatar.born', {
				url: '',
				templateUrl: 'wizzard-born.html',
				authenticate: true
			})
			.state('create-avatar.avatar', {
				url: '',
				templateUrl: 'wizzard-create-avatar.html',
				authenticate: true
			})
			.state('create-avatar.mascot', {
				url: '',
				templateUrl: 'wizzard-mascot.html',
				authenticate: true
			})
			.state('download-avatar', {
				url: '/download-avatar',
				templateUrl: 'download-avatar.html',
				controller: 'DownloadAvatarController',
				controllerAs: 'vm',
				authenticate: true
			})
			.state('sample',{
				url:'/sample',
				templateUrl:'sample.html',
				controller:'SampleController',
				controllerAs:'vm',
				authenticate: true
			})
			.state('search',{
				url:'/search',
				templateUrl:'search.html',
				controller:'SearchController',
				controllerAs:'vm',
				authenticate: true
			})
			.state('friend-request',{
				url:'/friend-request',
				templateUrl:'friend-request.html',
				controller:'FriendRequestController',
				controllerAs:'vm',
				authenticate: true
			})
			.state('friend-request-all',{
				url:'/friend-request-all',
				templateUrl:'friend-request-all.html',
				controller:'FriendRequestAllController',
				controllerAs:'vm',
				authenticate: true
			})
			.state('notification',{
				url:'/notification',
				templateUrl:'notification.html',
				controller:'NotificationController',
				controllerAs:'vm',
				authenticate: true
			})
			.state('menu',{
				url:'/menu',
				templateUrl:'menu.html',
				controller:'MenuController',
				controllerAs:'vm',
				authenticate: true
			})
			.state('trending',{
				url:'/trending',
				templateUrl:'trending.html',
				controller:'TrendingController',
				controllerAs:'vm',
				authenticate: true
			})
			.state('trending-people',{
				url:'/trending-people',
				templateUrl:'trending-people.html',
				controller:'TrendingPeopleController',
				controllerAs:'vm',
				authenticate: true
			})
			.state('trending-activity',{
				url:'/trending-activity',
				templateUrl:'trending-activity.html',
				controller:'TrendingActivityController',
				controllerAs:'vm',
				authenticate: true
			})
			.state('trending-place',{
				url:'/trending-place',
				templateUrl:'trending-place.html',
				controller:'TrendingPlaceController',
				controllerAs:'vm',
				authenticate: true
			})
			.state('edit-avatar',{
				url:'/edit-avatar',
				templateUrl:'edit-avatar.html',
				controller: 'EditAvatar',
				controllerAs:'vm',
				authenticate: true
			})
			.state('profile',{
				url:'/profile/:username',
				templateUrl:'profile.html',
				controller:'ProfileController',
				controllerAs:'vm',
				authenticate: true,
			})
			.state('profile-connection',{
				url:'/profile-connection/:username',
				templateUrl:'profile-connection.html',
				controller:'ProfileConnectionController',
				controllerAs:'vm',
				authenticate: true,
			})
			.state('achievement',{
				url:'/achievement',
				templateUrl:'achievement.html',
				controller:'AchievementController',
				controllerAs:'vm',
				authenticate: true,
			})
			.state('mutual-friend', {
				url: '/mutual-friend/',
				params: {
						user_id: null,
						username: null,
						hiddenParam: 'YES'
				},
				templateUrl: 'mutual-friend.html',
				controller: 'MutualFriendController',
				controllerAs: 'vm',
				authenticate: true
			})
			.state('store',{
				abstract: true,
				url:'/store',
				templateUrl:'store.html',
				controller: 'StoreController',
				controllerAs:'vm',
				authenticate: true
			})
			.state('store.home', {
				url: '',
				templateUrl: 'store.home.html',
				authenticate: true
			})
			.state('store.premium', {
				url: '/premium',
				templateUrl: 'store.premium.html',
				authenticate: true
			})
			.state('store.contributor', {
				url: '/contributor',
				templateUrl: 'store.contributor.html',
				authenticate: true
			})
			.state('store.free', {
				url: '/free',
				templateUrl: 'store.free.html',
				authenticate: true
			})
			.state('store.all', {
				url: '/all',
				templateUrl: 'store.all.html',
				authenticate: true
			})
			.state('store.emoji', {
				url: '/emoji',
				templateUrl: 'store.emoji.html',
				authenticate: true
			})
			.state('inventory',{
				abstract: true,
				url:'/inventory',
				templateUrl:'inventory.html',
				controller:'InventoryController',
				controllerAs:'vm',
				authenticate: true
			})
			.state('inventory.home', {
				url: '',
				templateUrl: 'inventory-home.html',
				authenticate: true
			})
			.state('inventory.sticker', {
				url: '/sticker',
				templateUrl: 'inventory-sticker.html',
				authenticate: true
			})
			.state('inventory.emoji', {
				url: '/emoji',
				templateUrl: 'inventory-emoji.html',
				authenticate: true
			})
			.state('inventory.history', {
				url: '/history',
				templateUrl: 'inventory-history.html',
				authenticate: true
			})
			.state('setting',{
				url:'/setting',
				templateUrl:'setting.html',
				controller: 'SettingController',
				controllerAs:'vm',
				authenticate: true
			})
			.state('about',{
				url:'/about',
				templateUrl:'about.html',
				controller: 'AboutController',
				controllerAs:'vm',
				authenticate: false
			})
			.state('delete-account', {
				url: '/account/:menu/:token',
				templateUrl: 'setting.html',
				controller: 'SettingController',
				controllerAs: 'vm',
				authenticate: true
			})
			.state('result-invite-gmail', {
				url: '/result-invite-gmail',
				templateUrl: 'result-invite-gmail.html',
				controllerAs: 'vm',
				authenticate: true
			})
			.state('invite-gmail', {
				url: '/invite-gmail',
				templateUrl: 'invite-gmail.html',
				controllerAs: 'vm',
				authenticate: true
			})
			.state('update', {
				url: '/update',
				templateUrl: 'update.html',
				controller: 'UpdateController',
				controllerAs: 'vm',
				authenticate: true
			})
			// .state('ciayo', {
			// 	url: '/:ciayo',
			// 	template: '<h1>404 Page not Found</h1>'
			// })
			// .state('profile-public', {
			// 	url: '/:username',
			// 	templateUrl: 'profile.html',
			// 	controller: 'ProfileController',
			// 	controllerAs: 'vm',
			// 	authenticate: true
			// })
			.state('profile-public', {
				url: '/:username',
				templateUrl: 'profile-template.html',
				controllerProvider: function (AuthService) {

					var ctrl = '';
					if (AuthService.IsAuth()) {
						ctrl = "ProfileController";
					} else {
						ctrl = "ProfilePublicController";
					}
					return ctrl;

				},
				controllerAs: 'vm',
				authenticate: false
			});
		;
	}

	run.$inject = ['$rootScope', '$state', '$cookieStore', 'AuthService', 'languageFactory'];
	function run($rootScope, $state, $cookieStore, AuthService, languageFactory) {
		// Validate Login & Authentication User
		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
			$("html, body").removeAttr("style");
			$(window).scrollTop(0);
			if(toParams.username == 'index.html'){
				window.location = '/';
			}
			if(toState.authenticate) {
				if(!AuthService.IsAuth()){
					$state.transitionTo('welcome');
					event.preventDefault();
				}

				if(!$cookieStore.get('profile') && !(toState.name == 'create-avatar.name' || toState.name == 'create-avatar.born' || toState.name == 'create-avatar.gender' || toState.name == 'create-avatar.avatar' || toState.name == 'create-avatar.download' || toState.name == 'create-avatar.mascot' || toState.name == 'download-avatar' || toState.name == 'welcome')){
					$state.transitionTo('create-avatar.name');
					event.preventDefault();
				}
			}
				languageFactory.getLanguage();
				// DI BAWAH INI NANTI DIATURNYA
				// if(!$cookieStore.get('profile') && !(toState.name == 'create-avatar' || toState.name == 'download-avatar' || toState.name == 'welcome')){
				// 	$state.transitionTo('create-avatar');
				// 	event.preventDefault();
				// }
			// }
		});
	}
})();