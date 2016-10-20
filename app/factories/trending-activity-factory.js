(function () {
	'use strict';

	angular
		.module('app')
		.factory('trendingActivityFactory', trendingActivityFactory);
	trendingActivityFactory.$inject = ['$rootScope','modalFactory', 'CiayoService', '$state', 'cardParallaxFactory'];

	function trendingActivityFactory($rootScope,modalFactory, CiayoService, $state, cardParallaxFactory) {
		var factory = {
			trending_activity_list:[],
			getTrendingActivityList:getTrendingActivityList,
			getTrendingActivityList_next:getTrendingActivityList_next,
			trending_activity_start: false,
			load_more:false,
			loading: true,
			isloading:false,
			
		};

		function getTrendingActivityList_next(){
			
				var offset = factory.trending_activity_list.length; 
				var limit = 3;

				var ok = false;
				var c = {
					data: {
						"limit": limit,
						"offset": offset
					}
				}
				CiayoService.Api('activity/trending', c, function(response) {
					if(response.status==200){
						var data = response.data.c.data;
						if (data.error == false) {
							ok = true;
						}
					}
					if(ok){

						//console.log(countFr);
						
						var tmp_next=(data.content.trending);
						console.log(tmp_next);

						if(tmp_next.length==0){
							factory.load_more = false;
						}else{
							factory.load_more = true;
						}		

					}else{
						//...
					}
				});
			
		}

		function getTrendingActivityList(start){
			if(!factory.loading && !factory.load_more){
				return;
			}
			if(!factory.isloading){
				factory.isloading = true;
				factory.loading = true;
				factory.trending_activity_start = false;
				factory.load_more = false;
				if(start){
					factory.trending_activity_list=[];
				}

				var offset = factory.trending_activity_list.length;
				var limit = 3;

				var ok = false;
				var c = {
					data: {
						"limit": limit,
						"offset": offset
					}
				}
				CiayoService.Api('activity/trending', c, function(response) {
					if(response.status==200){
						var data = response.data.c.data;
						if (data.error == false) {
							ok = true;
						}
					}
					if(ok){

						//console.log(countFr);
						
						var tmp=(data.content.trending);
						//console.log(tmp);
						if(start){
							factory.count = 1;
						}else{
							factory.count = (factory.count) ? factory.count : 1;
						}

						angular.forEach(tmp,function(value,key){
							value.trending_activity_number = factory.count;
							if((value.trending_activity_number+'').length==1){
								value.trending_activity_number = "0"+value.trending_activity_number;
							}

							tmp[key].activity_detail.face = (tmp[key].user_avatar) ? tmp[key].user_avatar.face: '';
							tmp[key].activity_detail.parallax_setting=true;
							value.parallax = new cardParallaxFactory(tmp[key].activity_detail);


							factory.trending_activity_list.push(value);
							
							factory.count++;
						});

						factory.isloading = false;
						factory.loading = false;

						if(offset >= 8){
							factory.load_more = false;
						}else{
							getTrendingActivityList_next();
						}

						factory.trending_activity_start = true;

					}else{
						//...
					}
				});
			}
		}
		

		return factory;
	}
})();