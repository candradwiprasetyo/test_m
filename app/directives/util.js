+function(){ "use strict";
	angular
		.module("CiayoUtil", [])
//		.directive('a', function() {
//		return {
//			restrict: 'E',
//			link: function(scope, elem, attrs) {
//				if(attrs.ngClick || attrs.href === '' || attrs.href === '#'){
//					elem.on('click', function(e){
////						e.preventDefault();
//					});
//				}
//			}
//		}
//	 })
	.directive('ngEnter',function() {
		return {
			link:function(scope,element,attrs) {
				element.bind("keypress", function(event) {
					if(event.which === 13) {
						scope.$apply(function() {
							scope.$eval(attrs.ngEnter);
						});
					event.preventDefault();
					}
				});
			}
		};
	})
	.directive("limitTo", ['$rootScope',function($rootScope) {
		return {
				scope:{'ngModel':'='},
				restrict: "A",
				link: function(scope, elem, attrs) {
						var limit = parseInt(attrs.limitTo);
						angular.element(elem).on("keypress", function(e) {
							var me=this;
								if(e.keyCode==8) return;
								if (this.value.length >= limit) e.preventDefault();
								$rootScope.$apply(function(){
									scope.ngModel = me.value.substring(0,limit);
								});
						}).on('paste',function(e){
							if (this.value.length >= limit) {
								e.preventDefault();
								var me = this;
								$rootScope.$apply(function(){
									scope.ngModel = me.value.substring(0,limit);
								});
							}
						});
				}
		}
	}])
	.filter('formatdate', function($filter,$cookieStore) {

		function timeConverter(UNIX_timestamp){
		  	 		var a = new Date(UNIX_timestamp);
				  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
				  var year = a.getFullYear();
				  var month = months[a.getMonth()];
				  var date = a.getDate();
				  var time = date + ' ' + month + ' ' + year;
				  return time;
		}

	function format_filter(date) {
		date = date * 1000;
		if (typeof date !== 'object') {
					date = new Date(date);
			}

			var seconds = Math.floor((new Date() - date) / 1000);
			//seconds = seconds + 240;

			var intervalType;
			var type = 'false';

			var interval = Math.floor(seconds / 31536000);
			if (interval >= 1) {
					intervalType = $filter('translate')('$year');
					type = 'true';
			} else {
					interval = Math.floor(seconds / 2592000);
					if (interval >= 1) {
							intervalType = $filter('translate')('$month');
							type = 'true';
					} else {
							interval = Math.floor(seconds / 86400);
							if (interval >= 1) {
									intervalType = $filter('translate')('$day');
							} else {
									interval = Math.floor(seconds / 3600);
									if (interval >= 1) {
											intervalType = $filter('translate')('$hour');
									} else {
											interval = Math.floor(seconds / 60);
											if (interval >= 1) {
													intervalType = $filter('translate')('$minute');
											} else {
													// interval = seconds;
													// intervalType = "second";
													interval = $filter('translate')('$just.now');
													intervalType = ''; 
													var typelang = 1; 
											}
									}
							}
					}
			}

			if(type=='false'){
				if(typelang==1){
					return interval;
				}else{
					if($cookieStore.get('language')==1){
						if (interval > 1 || interval === 0) {
							intervalType += 's';
						}
					}
					return interval + ' ' + intervalType + " "+$filter('translate')('$ago');
				}
			}else{
				return timeConverter(date);
			}
	}

	return format_filter;
	})
	.directive("contenteditable", function() {
  return {
    restrict: "A",
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

      element.bind("blur keyup change", function() {
        scope.$apply(read);
      });
    }
  };
})
	.directive('includeReplace', function () {
    return {
        require: 'ngInclude',
        restrict: 'A', /* optional */
        link: function (scope, el, attrs) {
            el.replaceWith(el.children());
        }
    };
})
	.directive('lazyLoad', function() {
		return {
			restrict: "A",
			link: function(scope, element, attrs) {
				var el = window;
				var el2 = 'body';
				if(attrs.lazyLoadElement){
					el = angular.element(attrs.lazyLoadElement)
					el2 = el;
				}
				angular.element(el).scroll(function(){
					var scroll_height = angular.element(el2).prop('scrollHeight');
					var scroll_top = angular.element(el2).scrollTop();
					var height = angular.element(el).height();
					if(scroll_height - (height + scroll_top) <=300){
						scope.$apply(attrs.lazyLoad);
					}
				});
				scope.$on('$destroy',function(){
					angular.element(window).off('scroll');
				})
			}
		};
	})
}();
