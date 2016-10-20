(function() {
'use strict';

	angular
		.module('app')
		.controller('EditAvatar', EditAvatar);

	EditAvatar.$inject = ['CiayoService', 'AvatarService', '$state', '$cookieStore', '$rootScope'];
	function EditAvatar(CiayoService, AvatarService, $state, $cookieStore, $rootScope) {
		var vm = this;
		
		vm.errMsg = '';
		
		vm.mascot = [];
		vm.avatarBgColor = '#fff';
		vm.avatarInit = [];
		vm.avatarDefault = [];
		vm.avatarBackHair = '';
		vm.avatarBackground = {
			required: true,
			element_id: '0',
			element_name: 'Background',
			element_image_url: 'https://s3-ap-southeast-1.amazonaws.com/ciayo/avatar_elements/elemen-avatar_background-color.png',
			element_type: [
				{
					element_type_id: '00',
					element_type_name: 'Background Color',
					element_variation: [
						"#FCB64E",
						"#FFE081",
						"#BCDFBF",
						"#AEDCF6",
						"#A5CBEC",
						"#C5C9E6",
						"#F8C2D3",
						"#D8DFE2"
					]
				}
			]
		};

		vm.element = {};
		vm.elementVariation = [];
		vm.defaultElementColor = {};

		vm.selectElement = selectElement;
		vm.selectElementVariation = selectElementVariation;
		vm.changeBackground = changeBackground;
		vm.changeElement = changeElement;
		vm.changeElementColor = changeElementColor;
		vm.getFilterValue = getFilterValue;
		vm.removeElement = removeElement;

		vm.saveAvatar = saveAvatar;
		vm.cancelAvatar = cancelAvatar;

		getAvatar();

		function getAvatar() {
			vm.showLoading = true;
			AvatarService.getAvatarInit(vm.gender, function(data){
				if(data.error) {
					alert('error men');
				} else {
					// vm.avatarBackground = data.content.background;
					vm.avatarInit = data.content.data;
					//vm.element = vm.avatarInit[1];
					//selectElementVariation(vm.element.element_type[0]);
					vm.showLoading = false;

					AvatarService.getAvatarDefault(vm.gender, function(data){
						if(data.error){
							alert('gagal defult avatar men');
						} else {
							vm.avatarBgColor = data.content.color;
							vm.avatarDefault = data.content.data;
							for(var i = 0; i < vm.avatarDefault.length; i++){
								if(vm.avatarDefault[i].image_back != ''){
									vm.avatarBackHair = vm.avatarDefault[i].image_back;
								}
								vm.defaultElementColor["element_"+vm.avatarDefault[i].filter_id] = getIndexColor(vm.avatarDefault[i].filter_id, vm.avatarDefault[i].color_id);
							}

							vm.selectElement(vm.avatarInit[1]);
						}

						// init scroll
						initScroll();
					});
				}
			});
		}

		function saveAvatar() {
			var bg = {
				data: {
					color_code: vm.avatarBgColor
				}
			};
			var ava = {
				data: {
					updated_filter: [
						{
							filter_id: 16,
							filter_value: getFilterValue('16')
						},
						{
							filter_id: 9,
							filter_value: getFilterValue('9')
						},
						{
							filter_id: 14,
							filter_value: getFilterValue('14')
						},
						{
							filter_id: 15,
							filter_value: getFilterValue('15')
						},
						{
							filter_id: 11,
							filter_value: getFilterValue('11')
						},
						{
							filter_id: 12,
							filter_value: getFilterValue('12')
						},
						{
							filter_id: 13,
							filter_value: getFilterValue('13')
						},
						{
							filter_id: 10,
							filter_value: getFilterValue('10')
						},
						{
							filter_id: 23,
							filter_value: getFilterValue('23')
						}
					],
					type: 3
				}
			}
			vm.showLoading = true;
			AvatarService.setAvatar(bg, ava, function(data){
				if(data.error){
					alert(data.message);
				} else {
					AvatarService.getAvatarUser(function(data){
						if(data.error){
							alert(data.message);
						} else {
							vm.showLoading = false;
							vm.avaUserImg = data.content.avatar;
							vm.avaUserBg = data.content.background_avatar;
							$rootScope.backState = 'avatar';
							$('body').removeClass('-locked');
							$state.transitionTo('profile');
						}
					});
				}
			});
		}

		function cancelAvatar() {
			$rootScope.backState = 'avatar';
			$('body').removeClass('-locked');
			$state.transitionTo('profile');
		}

		// Avatar Editor Function
		function selectElement(element) {
			vm.element = element;
			if(vm.element.element_id == 0){
				selectElementVariation(element.element_type[0]);
			} else if(vm.element.element_id == 23){
				selectElementVariation(element.element_type[2]);
			} else {
				for(var i = 0; i < vm.avatarDefault.length; i++){
					if(vm.avatarDefault[i].filter_id == element.element_id){
						for(var j = 0; j < element.element_type.length; j++){
							var element_id = vm.getElementId()?vm.getElementId():vm.avatarDefault[i].element_type_id;
							if(element_id == element.element_type[j].element_type_id){
								selectElementVariation(element.element_type[j]);
							}
						}
					}
				}
			}

			initScroll();
		}

		function selectElementVariation(type, change) {
			vm.selectedElementId = type.element_type_id;
			vm.typeIndex = 0;
			vm.elementVariation = type.element_variation;
			if(change){
				vm.changeElement(vm.elementVariation[0], vm.element.element_id);
			}
		}

		function changeBackground(color) {
			vm.avatarBgColor = color;
		}

		function changeElement(variant, id) {
			var img = variant.assets[vm.defaultElementColor['element_'+id]].asset_image_url;
			if(id == 10){
				vm.avatarBackHair = variant.assets[vm.defaultElementColor['element_'+id]].asset_image_back;
			}

			var elem = angular.element('#layer_'+id);
			elem.attr('element-id', vm.selectedElementId);
			elem.attr('variant-id', variant.variant_id);
			elem.attr('filter-value', variant.assets[vm.defaultElementColor['element_'+id]].asset_id);
			elem.css('background-image', 'url('+img+')');

			var skin_color = vm.element.skin_color;
			if(skin_color){
				changeAllSkin(variant.assets[vm.defaultElementColor['element_'+id]].asset_color_id);
			}
		}

		function changeElementColor(id, index) {
			vm.defaultElementColor['element_'+vm.element.element_id] = index;
			var elem = angular.element('#layer_'+vm.element.element_id);
			var url = '';
			var filter_value = '';
			var element_id = elem.attr('element-id');
			var variant_id = elem.attr('variant-id');
			var element_type = vm.element.element_type;
			var skin_color = vm.element.skin_color;
			for(var i = 0; i < element_type.length; i++){
				if(element_id == element_type[i].element_type_id){
					for(var j = 0; j < element_type[i].element_variation.length; j++){
						if(variant_id == element_type[i].element_variation[j].variant_id){
							for(var k = 0; k < element_type[i].element_variation[j].assets.length; k++){
								if(id == element_type[i].element_variation[j].assets[k].asset_color_id){
									if(vm.element.element_id == 10){
										vm.avatarBackHair = element_type[i].element_variation[j].assets[k].asset_image_back;
									}
									url = element_type[i].element_variation[j].assets[k].asset_image_url;
									filter_value = element_type[i].element_variation[j].assets[k].asset_id;
								}
							}
						}
					}
				}
			}

			elem.attr('filter-value', filter_value);
			elem.css('background-image', 'url('+url+')');

			if(skin_color){
				changeAllSkin(id);
			}
		}

		function changeAllSkin(id) {
			// change body
			var elem = angular.element('#layer_16');
			var assets = vm.avatarInit[0].element_type[0].element_variation[0].assets;
			var url = '';
			var filter_value = '';
			for(var i = 0; i < assets.length; i++){
				if(assets[i].asset_color_id == id){
					url = assets[i].asset_image_url;
					filter_value = assets[i].asset_id;
				}
			}
			elem.css('background-image', 'url('+url+')');
			elem.attr('filter-value', filter_value);

			// change face
			var elem = angular.element('#layer_9');
			for(var i = 0; i < vm.avatarInit.length; i++){
				if(elem.attr('filter-id') == vm.avatarInit[i].element_id){
					var element_type = vm.avatarInit[i].element_type;
				}
			}
			var url = '';
			var filter_value = elem.attr('filter-value');
			var element_id = elem.attr('element-id');
			var variant_id = elem.attr('variant-id');
			if(filter_value != id) {
				for(var i = 0; i < element_type.length; i++){
					if(element_id == element_type[i].element_type_id){
						var variant = element_type[i].element_variation;
						for(var j = 0; j < variant.length; j++){
							if(variant_id == variant[j].variant_id){
								var assets = variant[j].assets;
								for(var k = 0; k < assets.length; k++){
									if(id == assets[k].asset_color_id){
										url = assets[k].asset_image_url;
										filter_value = assets[k].asset_id;
									}
								}
							}
						}
					}
				}
				elem.css('background-image', 'url('+url+')');
				elem.attr('filter-value', filter_value);
			}

			// change nose
			var elem = angular.element('#layer_13');
			for(var i = 0; i < vm.avatarInit.length; i++){
				if(elem.attr('filter-id') == vm.avatarInit[i].element_id){
					var element_type = vm.avatarInit[i].element_type;
				}
			}
			var url = '';
			var filter_value = elem.attr('filter-value');
			var element_id = elem.attr('element-id');
			var variant_id = elem.attr('variant-id');
			if(filter_value != id) {
				for(var i = 0; i < element_type.length; i++){
					if(element_id == element_type[i].element_type_id){
						var variant = element_type[i].element_variation;
						for(var j = 0; j < variant.length; j++){
							if(variant_id == variant[j].variant_id){
								var assets = variant[j].assets;
								for(var k = 0; k < assets.length; k++){
									if(id == assets[k].asset_color_id){
										url = assets[k].asset_image_url;
										filter_value = assets[k].asset_id;
									}
								}
							}
						}
					}
				}
				elem.css('background-image', 'url('+url+')');
				elem.attr('filter-value', filter_value);
			}
		}

		function getFilterValue(id) {
			var elem = angular.element('#layer_'+id);
			var val = elem.attr('filter-value');
			return val;
		}

		vm.getElementId = getElementId;
		function getElementId() {
			var elem = angular.element('#layer_'+vm.element.element_id);
			var val = elem.attr('element-id');
			return val;
		}

		vm.getVariantId = getVariantId;
		function getVariantId() {
			var elem = angular.element('#layer_'+vm.element.element_id);
			var val = elem.attr('variant-id') || 'huhu';
			return val;
		}

		function removeElement(id) {
			var elem = angular.element('#layer_'+id);
			elem.css('background-image', 'url()');
			elem.attr('filter-value', '');
			if(id == 10){
				vm.avatarBackHair = '';
			}
		}

		function getIndexColor(element, color) {
			var idn = 0;
			for(var i = 0; i < vm.avatarInit.length; i++){
				if(vm.avatarInit[i].element_id == element){
					for(var j = 0; j < vm.avatarInit[i].color_variant.length; j++){
						if(vm.avatarInit[i].color_variant[j].color_id == color){
							idn = j;
						}
					}
				}
			}

			return idn;
		}

		function initScroll() {
			// control color
			var nextColor = $('._color-control.-next');
			var prevColor = $('._color-control.-prev');
			var viewportColor = $('._color-viewport');
			var pos = 0;
			// next
			nextColor.on('click', function(e){
				e.preventDefault();
				if(pos <= 103){
					pos+=40;
					viewportColor.animate({
						scrollTop: pos
					},250);
				}
			});
			// prev
			prevColor.on('click', function(e){
				e.preventDefault();
				if(pos > 0) {
					pos-=80;
					viewportColor.animate({
						scrollTop: pos
					},250);
				}
			});
			// avatar color
			var nextType = $('._type-control.-next');
			var prevType = $('._type-control.-prev');
			var viewportType = $('._type-viewport');
			var pos = 0;
			// next
			nextType.on('click', function(e){
				if(pos <= (viewportType.children().length*85)){
					pos+=55;
					viewportType.animate({
						scrollLeft: pos
					},100);
				}
			});
			// prev
			prevType.on('click', function(e){
				e.preventDefault();
				if(pos > 0) {
					pos-=55;
					viewportType.animate({
						scrollLeft: pos
					},100);
				}
			});
		}
	}
})();