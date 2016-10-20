if (typeof _ === 'undefined') {
	throw new Error("Model Loader requires lodash");
}
if (typeof angular === 'undefined') {
	throw new Error("Model Loader requires angular");
}
(function (window,_,angular) {
	'use strict';
	
	var Ciayo = function () {
		var ciayo = this;
		var model_list = {}
		_.extend(ciayo,{
			model:Model
		});
		function init(){
			clear();
		}
		function Model(name,obj){
			function register(){
				if(model_list[name]===undefined){
					model_list[name]=obj;
					return true;
				}
				throw new Error('Name has been used');
				return false;
			}
			function load(){
				if(model_list[name]!=undefined){
					return model_list[name];
				}
				throw new Error('Model not found')
			}
			return obj==undefined?load():register();
		}
		function clear(){
			model_list = {};
		}
		init();
	}
	
	window.ciayo = new Ciayo();
}(window,_,angular));
