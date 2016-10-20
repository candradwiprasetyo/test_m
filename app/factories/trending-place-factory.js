(function () {
	'use strict';

	angular
		.module('app')
		.factory('trendingPlaceFactory', trendingPlaceFactory);
	trendingPlaceFactory.$inject = ['$rootScope','modalFactory', 'CiayoService', '$state'];

	function trendingPlaceFactory($rootScope,modalFactory, CiayoService, $state) {
		var factory = {
			trending_place_list:[],
			getTrendingPlaceList:getTrendingPlaceList,
			trending_place_start:false
		};

		function getTrendingPlaceList(start){
				
					factory.trending_place_start = false;
					factory.trending_place_list=[];

					var offset = 0;
					var limit = 20;

					var ok = false;
					var c = {
						data: {
							"limit": limit,
							"offset": offset
						}
					}
					CiayoService.Api('place/trending', c, function(response) {
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
							factory.count = 1;
							angular.forEach(tmp,function(value,key){
								value.trending_place_number = factory.count;
								if((value.trending_place_number+'').length==1){
									value.trending_place_number = "0"+value.trending_place_number;
								}
								factory.trending_place_list.push(value);
								
								factory.count++;
							});

							factory.trending_place_start = true;

						}else{
							//...
						}
					});
				
		}
		

		return factory;
	}
})();