(function() {
	'use strict';

	angular
		.module('app')
		.directive('cavCarousel', function(){
			return {
				restrict: "A",
				scope: {},
				link: function(scope, elem, attr){
				 	$(document).ready(function(){
						var getCenterIndex = function(){
							return Math.ceil(($(elem).children().length / 2)-1);
						}
						
						setTimeout(function(){
							$(elem).flickity({
								cellAlign: 'center',
								initialIndex: getCenterIndex(),
								pageDots: false
							});
							$(elem).on('staticClick', function(event, pointer, cellElement, cellIndex){
								$(this).flickity('select', cellIndex)
								console.log(cellIndex)
							});
						},1);
					});
				}
			}
		})
		
		.directive('toggleZoom', function(){
			return {
				restrict: "A",
				link: function(scope, elem, attr){
					elem.on('click', function(e){
						e.preventDefault();
						if(elem.children().text() === 'zoom_in'){
							elem.parent().addClass('zoom-out');
							elem.children().text('zoom_out');
						} else{
							elem.parent().removeClass('zoom-out');
							elem.children().text('zoom_in');
						}
					});
				}
			}
		})
})();