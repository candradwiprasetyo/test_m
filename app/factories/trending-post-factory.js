(function () {
	'use strict';

	angular
		.module('app')
		.factory('trendingPostFactory', trendingPostFactory);
	trendingPostFactory.$inject = ['$rootScope','modalFactory', 'CiayoService', 'cardFactory', '$cookieStore'];

	function trendingPostFactory($rootScope,modalFactory, CiayoService, cardFactory, $cookieStore) {
		var factory = {
			type:'',
			card_list:[],
			getCardList:getCardList,
			load_more:false,
			loading: false,
			isloading:false,
			clearSearch:clearSearch
		};

		//factory.load_more = false;
		function getUrlFromType(){
			if(factory.type=='trending'){
				return {url:TIMELINE_API_SERVER+'post/trending',force_url:true}
			}
		}
		function clearSearch(){
			factory.search_text = '';
			factory.card_list = [];
			factory.load_more = false;
		}

		function getCardList(start){

			if(!factory.isloading){
				factory.isloading = true;
				factory.loading = true;
				
				if(start){
					factory.card_list=[];
				}

				var offset = factory.card_list.length;
				var limit = 3;
				var offset = 3;

					if(offset<=9){

						if(offset >= 8){
			 				limit = 2;
			 			}
					timelineConnector.timelineGet('trending',limit,offset,null)
					.then(function(data){
							
							if(data.error == false){
								if(factory.type=='trending'){
									var tmp=(data.content.trending);
								}else{
									var tmp=(data.content.posts);
								}
								angular.forEach(tmp,function(value,key){
									
									value.frame = false;
									
									var card = new cardFactory(value);
									factory.card_list.push(card);

								});
								factory.isloading = false;
								if(offset<=9){
									factory.load_more=true;
								}else{
									factory.load_more=false;
								}
//								getCardListNext( false, limit, offset);
							}else{
								//...
							}
						}, true);
					}else{
						factory.isloading = false;
					}

				
			}
			
		}

		return factory;
	}
})();