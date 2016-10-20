(function () {
	'use strict';

	angular
		.module('app')
		.factory('cardParallaxFactory', cardParallaxFactory);
	cardParallaxFactory.$inject = ['$rootScope', 'modalFactory'];

	function cardParallaxFactory($rootScope, modalFactory) {
		var const_layer = [
			[10, 0.99],//0
			[0, 1],//1
			//[-50,1.06],//1
			[-200, 1.23],//2
			//[-300,1.33],//3
			[-400, 1.44],//3
			//[-500,1.56],//5
			[-600, 1.75]//4
		];
		function factory(activity_detail) {
			var me = this;
			angular.extend(me, {
				loaded: false,
				should_update: false,
				parallax_setting:false,
				layer_list: []
			});
			init();
			function init() {
				transform(activity_detail);
			}
			function transform(activity_detail) {
				var activity_layer = 0;
				me.loaded = false;
				me.layer_list = [];
				if(activity_detail.parallax_setting)
					me.parallax_setting = activity_detail.parallax_setting;
				//find activity_layer
				angular.forEach(activity_detail.image, function (image, key) {
					if (image.type == 'activity') { activity_layer = image.layer; }
				});
				//background
				angular.forEach(activity_detail.image, function (image, key) {
					if(image.type!='background')return;
					if (image.url && image.url != '') {
						me.layer_list.push({
							x: 0, y: 0,
							z: const_layer[image.layer][0],
							rotation: 0,
							scale: const_layer[image.layer][1],
							url: image.url
						});
					}
				});
				//back hair(activity +1)
				if (activity_detail.back_hair) {
					var obj = {
						z: const_layer[activity_layer][0] + 1,
						rotation: activity_detail.avatar_rotation,
						scale: const_layer[activity_layer][1] * activity_detail.avatar_size / 100,
						url: activity_detail.back_hair
					};
					obj.x = activity_detail.avatar_position.x * const_layer[activity_layer][1];
					obj.y = activity_detail.avatar_position.y * const_layer[activity_layer][1];
					me.layer_list.push(obj);
				}
				//activity
				angular.forEach(activity_detail.image, function (image, key) {
					if(image.type!='activity')return;
					if (image.url && image.url != '') {
						me.layer_list.push({
							x: 0, y: 0,
							z: const_layer[image.layer][0]+2,
							rotation: 0,
							scale: const_layer[image.layer][1],
							url: image.url
						});
					}
				});
				//head
				if (activity_detail.face) {
					var obj = {
						z: const_layer[activity_layer][0] + 3,
						rotation: activity_detail.avatar_rotation,
						scale: const_layer[activity_layer][1] * activity_detail.avatar_size / 100,
						url: activity_detail.face
					};
					obj.x = activity_detail.avatar_position.x * const_layer[activity_layer][1];
					obj.y = activity_detail.avatar_position.y * const_layer[activity_layer][1];
					me.layer_list.push(obj);
				}
				//foreground
				angular.forEach(activity_detail.image, function (image, key) {
					if(image.type!='foreground')return;
					if (image.url && image.url != '') {
						me.layer_list.push({
							x: 0, y: 0,
							z: const_layer[image.layer][0]+4,
							rotation: 0,
							scale: const_layer[image.layer][1],
							url: image.url
						});
					}
				});
				//bubble
				imageLoader(me.layer_list, function () {
					me.loaded = true;
					me.should_update = true;
					$rootScope.$apply();
				})
			}

		}
		function imageLoader(image_list, callback) {
			var ready = false;
			var image_count = 0;
			angular.forEach(image_list, function (value, key) {
				var img = new Image();
				img.src = value.url;
				img.onload = updateCount;
			});
			function updateCount() {
				image_count++;
				if (image_count >= image_list.length) {
					callback();
				}
			}
		}
		return factory;
	}
})();
