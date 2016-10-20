+function(){
	"use strict";
	angular
		.module("CiayoCard", [])
		.directive('cCard',cCard)
		.directive("cCardParallax", cCardParallax)
	;
	cCard.$inject=['modalFactory'];
	cCardParallax.$inject=['modalFactory'];
	function cCard(modalFactory){
		return {
			restrict: "E",
			scope: {'card':'=','index':'='},
			replace:true,
			templateUrl: function(elem,attr){
				return DIRECTIVES_VIEW+'card.html'
			},
			link:function(scope,element,attrs,controller,transcludeFn){
				scope.type = attrs.type;
				setTimeout(function(){$(window).trigger("resize.card-tab")},1);
			}
		}
	}
	function cCardParallax(modalFactory){
		return {
			restrict: "E",
			scope: {'parallax':'='},
			replace:true,
			template: '<div style="position:absolute;width:100%"></div>',
			link:function(scope, element, attrs, controller, transcludeFn){
				scope.$watch(
					'parallax.should_update',
					function (newValue, oldValue, scope) {
						ReactDOM.render(
							React.createElement(cCardParallaxComponent, {'parallax':scope.parallax}),
							element[0]
						);
					}
				);

			}
		}
	}
	
}();