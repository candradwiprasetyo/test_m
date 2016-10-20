(function() {
'use strict';

	angular
		.module('app')
		.service('AchievementService', AchievementService);

	AchievementService.$inject = ['CiayoService'];
	function AchievementService(CiayoService) {
		this.getData = getData;
		// this.getOnProgress = getOnProgress;
		// this.getCompleted = getCompleted;
		this.getDetail = getDetail;
		this.setTitle = setTitle;
		this.shareFB = shareFB;

		function getData(url, data, callback) {
			var c = {
				data: data
			}; 
			CiayoService.Api(url, c, function(response){
				callback(returnData(response));
			});
		}

		function getDetail(id, callback) {
			var c = {
				data: {
					"id_achievement": id
				}
			};

			CiayoService.Api('achievement/detail', c, function(response) {
				callback(returnData(response));
			});
		}

		function shareFB(token, uid, id_achievement, id, callback) {
			var c = {
				data: {
					'access_token': token,
					'uid':uid,
					'id_achievement':id_achievement,
					'id':id
				}
			};
			CiayoService.Api('facebook/share/achievement', c, function (response) {
				callback(returnData(response));
			});
		}

		function setTitle(title, callback) {
			var c = {
				data: {
					updated_filter: [
						{
							filter_id: 520,
							filter_value: title
						}
					],
					type: 2
				}
			}

			CiayoService.Api('users/filter/update',c,function(response){
				callback(returnData(response));
			});
		} 

		function returnData(response) {
			if(response.status == 200) {
				var data = response.data.c.data;
			} else {
				var data = {
					error: true,
					error_code: response.status,
					message: response.statusText
				};
			}
			return data;
		}
	}
})();