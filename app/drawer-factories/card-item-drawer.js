(function () {
	'use strict';

	angular
		.module('app')
		.factory('cardItemDrawer', cardItemDrawer);
	cardItemDrawer.$inject = ['$rootScope','modalFactory','CiayoService', 'drawerFactory', '$filter'];

	function cardItemDrawer($rootScope,modalFactory, CiayoService, drawerFactory, $filter) {
		var factory = {
			open:open,
			back:back,
			save:save,
			callback:angular.noop(),
			onLoad:angular.noop(),
			old_items:null,
			items:null,
			search:'',
			list:[],
			index:0,
			max_item:4,
			isEdit:false,
			isEmpty:false,
			getInitData:getInitData,
			deleteSearch:deleteSearch,
			selectIndex:selectIndex,
			resetItem:resetItem,
			setEdit:setEdit,
			isSearch:isSearch,
			selectItem:selectItem,
			searchItem:searchItem,
			deleteItem:deleteItem
		};
		function onLoad(){
			setTimeout(function(){
				var scrollPos = 0;
				$(".-timeline-post-item ._search-input input").on({
					"focus": function(){
						// get last scroll position
						scrollPos = $(window).scrollTop();
						// add focus behaviour
						$(this).parent().addClass("-focus")
						// lock html & body
						$("html, body").css({"height": $(window).height(), "overflow": "hidden"});
					},
					"blur": function(){
						// remove focus behaviour
						$(this).parent().removeClass("-focus")
						// unlock html & body
						$("html, body").removeAttr("style");
						// restore last scroll position
						$(window).scrollTop(scrollPos)
					}
				})
			}, 0)
		}
		function open(type,items,index,callback){
			factory.callback=callback;
			factory.onLoad=onLoad;
			factory.old_items=items.slice();
			factory.items = items.slice();
			selectIndex(index);
			factory.back_text=$filter('translate')('$back');
			factory.save_text=$filter('translate')('$save');
			if(type=='ADD'){
				drawerFactory.title=$filter('translate')('$add.item');
			}else{
				drawerFactory.title=$filter('translate')('$edit.item');
			}
			drawerFactory.drawer_class='-timeline-post-item -topbar';
			drawerFactory.template = DRAWER_VIEW+'card-item.html';
			drawerFactory.data = factory;
//			factory.old_items=items;
//			factory.items=items;
			factory.search='';
			factory.list=[];
			$rootScope.$broadcast('drawer.open',{});
		}
		function back(){
			drawerFactory.setState();
			var data={'items':factory.old_items};
			factory.callback(data);
		}
		function save(){
			drawerFactory.setState();
			var data={'items':factory.items}
			factory.callback(data);
		}
		//FUNCTION
		function getInitData(){
			var _result = [];
			for(var i=0;i<factory.max_item;i++){
				_result.push(null);
			}
			return _result;
		}
		function deleteSearch(){
			factory.search='';
			factory.list=[];
			factory.isEmpty=false;
		}
		function selectIndex(index){
			factory.search='';
			factory.isEdit=false;
			factory.isEmpty=false;
			factory.list=[];
			factory.index = index;
			adjustHeight();
		}
		function resetItem(){
			factory.items=getInitData();
		}
		function setEdit(value){
			factory.isEdit=value;
		}
		function isSearch($index){
			return factory.items[$index]==undefined || factory.isEdit==true
		}
		
		function searchItem(){
			factory.isEmpty=false;
			var keyword=factory.search,item_category_id=null,limit=20,offset=0;
			var ok = false;
			var c = {
				data: {
					"keyword": keyword,
					"item_category_id": item_category_id,
					"limit": limit,
					"offset": offset
				}
			};
			CiayoService.Api('item', c, function(response) {
				if(response.status==200){
					var data = response.data.c.data;
					if (data.error == false) {
						ok = true;
					}
				}
				if(ok){
					var _tmp = [];
					var _list = [];
					angular.forEach(factory.items,function(value,key){
						if(value)
							_list.push(value.item_id);
					});
					angular.forEach(data.content.list_item,function(value,key){
						if(_list.indexOf(value.item_id)==-1){
							_tmp.push(value);
						}
					});
					factory.list=[];
					if(_tmp.length>0){
						factory.list=_tmp;
					}
					factory.isEmpty=_tmp.length==0;
					adjustHeight();
				}else{
					//...
				}
			});
		}
		function selectItem(item){
			factory.items[factory.index]=item;
			factory.list=[];
			factory.search=item.item_name;
			factory.search='';
			factory.isEdit=false;
			factory.isEmpty=false;
		}
		function deleteItem(){
			deleteSearch();
			factory.items[factory.index]=null;
		}
		function adjustHeight(){
			$(window).trigger("resize.post_item");
			setTimeout(function(){
					$('.cm-panel-global .cm-wrapper').css('min-height',$('.cm-panel-global .cm-wrapper ._pane.-open').outerHeight()+20)
				,1});
		}
		
		return factory;
	}
})();