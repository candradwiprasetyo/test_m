(function () {
	'use strict';

	angular
		.module('app')
		.factory('cardStickerFactory', cardStickerFactory);
	cardStickerFactory.$inject = ['$rootScope', 'CiayoService'];

	function cardStickerFactory($rootScope, CiayoService) {
		
		var factory = function(){
			var _factory = this;
			angular.extend(_factory,{
				isOpen:false,
				index:0,
				collectionIndex:0,
				emojiCollection:null,
				stickerCollection:null,
				setOpen:setOpen,
				setIndex:setIndex,
				setCollectionIndex:setCollectionIndex,
				getUserEmojiCollection:getUserEmojiCollection,
				getUserStickerCollection:getUserStickerCollection,
				getUserEmojiDetail:getUserEmojiDetail,
				getUserStickerDetail:getUserStickerDetail
			})
			
		
		
		function setOpen(value,index){
			_factory.isOpen = value;
			if(index>=0){
				setTimeout(function(){$('body').scrollTop($('#cm-card_'+index).offset().top+$('#cm-card_'+index).height()-$( window ).height())},0);
			}else
			if(index==-1){
				setTimeout(function(){$('.cm-panel-global .cm-panel-content').scrollTop($(this).height())},0);
			}
			
			if(value){
				getUserEmojiCollection(0,20,function(){
//					setIndex(0);
				},function(){
					
				});
				getUserStickerCollection(0,20,function(){
					setIndex(0);
				},function(){
					
				});
				
			}
		}
		function setIndex(value, id){
			_factory.index=value;
			setCollectionIndex(0);

			if(value==0){
				var objDiv = document.getElementById("cm-card_"+id);
				//objDiv.scrollTop = objDiv.scrollHeight;
			}

		}
		function setCollectionIndex(value){
			_factory.collectionIndex=value;
			if(_factory.index==0){
				if(_factory.stickerCollection.length>0)
					_factory.getUserStickerDetail(_factory.stickerCollection[_factory.collectionIndex]);
			}else{
				if(_factory.emojiCollection.length>0)
					_factory.getUserEmojiDetail(_factory.emojiCollection[_factory.collectionIndex])
			}
		}
		function getUserEmojiCollection(offset, limit,callback, errCallback) {
			if(_factory.emojiCollection!=null){
				callback();
				return;
			}
			var c={
				data:{
					offset:offset,
					limit:limit
				}
			};
			CiayoService.Api('user/emoji/collection', c, function(response) {
				var ok=false;
				if(response.status==200) {
					var data=response.data.c.data;
					if(data.error==false){
						ok=true;
					}
				}
				if(ok){
					_factory.emojiCollection=data.content.emoji_collection;
					callback();
				} else {
					errCallback(response);
				}
			});
		}
		function getUserStickerCollection(offset, limit,callback, errCallback) {
			if(_factory.stickerCollection!=null){
				callback();
				return;
			}
			var c={
				data:{
					offset:offset,
					limit:limit
				}
			};
			CiayoService.Api('user/sticker/collection', c, function(response) {
				var ok=false;
				if(response.status==200) {
					var data=response.data.c.data;
					if(data.error==false){
						ok=true;
					}
				}
				if(ok){
					_factory.stickerCollection=data.content.sticker_collection;
					callback();
				} else {
					errCallback(response);
				}
			});
		}
		function getUserEmojiDetail(collection) {
			var index = _factory.emojiCollection.indexOf(collection);
			var c={
				data:{
					collection_id:collection.id,
				}
			};
			CiayoService.Api('user/emoji/collection/detail', c, function(response) {
				var ok=false;
				if(response.status==200) {
					var data=response.data.c.data;
					if(data.error==false){
						ok=true;
					}
				}
				if(ok){
					_factory.emojiCollection[index].detail=data.content.emoji_collection;
				}else{
				}
			});
		}
		function getUserStickerDetail(collection) {
			var index = _factory.stickerCollection.indexOf(collection);
			var c={
				data:{
					collection_id:collection.id,
				}
			};
			CiayoService.Api('user/sticker/collection/detail', c, function(response) {
				var ok=false;
				if(response.status==200) {
					var data=response.data.c.data;
					if(data.error==false){
						ok=true;
					}
				}
				if(ok){
					_factory.stickerCollection[index].detail=data.content.sticker_collection;
				}else{
					
				}
			});
		}
		};
		return factory;
	}
})();