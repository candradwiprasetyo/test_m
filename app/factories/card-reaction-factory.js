(function () {
	'use strict';

	angular
		.module('app')
		.factory('cardReactionFactory', cardReactionFactory);
	cardReactionFactory.$inject = ['$rootScope', 'modalFactory', 'CiayoService', 'cardReactionDrawer','timelineConnector'];

	function cardReactionFactory($rootScope, modalFactory, CiayoService, cardReactionDrawer,timelineConnector) {
		function factory(post_id) {
			var reaction = this;
			angular.extend(reaction, {
				setOpen: setOpen,
				react: react,
				openModal: openModal,
				setIndex: setIndex
			});
			init();
			function init() {
				angular.extend(reaction, {
					isOpen: false,
					animate: 0,
					count: 0,
					most_react: 0,
					text: '',
					user_react: 0,
					list: {},
					index: 0
				});
				load();
			}
			function load() {
				timelineConnector.reactionGet(post_id).then(function(data){
					var data = data.content;
					transform(data);
					setTimeout(function () { $(window).trigger("resize.card-tab"); }, 1);
				},function(response){
					
				});
			}
			function transform(data) {
				reaction.most_react = data.rate_detail.detail.most ? data.rate_detail.detail.most.rate : 0;
				reaction.text = data.rate_detail.detail.text || '';
				reaction.user_react = data.rate_detail.user_react ? data.rate_detail.user_react.rate : 0;
				reaction.count = 0;
				angular.forEach(data.rate_count, function (value, key) {
					var user_list = [];
					angular.forEach(value.users, function (value2, key2) {
						user_list.push({
							id: value2.id,
							username: value2.username,
							user_display_name: value2.display_name,
							avatar: {
								background: value2.avatar.background_avatar,
								full_body: value2.avatar.avatar,
								face: '',
								cropped: value2.avatar.avatar_crop
							},
						});
					});
					reaction.list[key.split('_').pop()] = { count: value.count, user_list: user_list };
					reaction.count += user_list.length;
				});
			}
			function setOpen(value) {
				if (value == undefined) value = false;
				reaction.isOpen = value;
			}
			function react(value, $event) {
				if(post_id==1){modalFactory.message('Reaction disabled');return;}
				if (reaction.animate != 0) { return; }
				var _col = angular.element($event.currentTarget);
				var _reaction = _col.find('div._reaction');
				reaction.animate = value;
				angular.element(_reaction).on('animationiteration webkitAnimationIteration', function () {
					reaction.animate = 0;
					reaction.setOpen(false);
					angular.element(_reaction).off('animationiteration webkitAnimationIteration');
					$rootScope.$apply(function () { });
				});
				timelineConnector.reactionCreate(post_id,value).then(function(data){
						load();
				},function(response){
					
				});
			}
			function openModal() {
				if (reaction.count > 0) {
					cardReactionDrawer.open(reaction);
				}
			}
			function setIndex(index) {
				reaction.index = index;
			}
		};
		return factory;
	}
})();