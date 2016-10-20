(function (){
	window.ciayo.model('WelcomeModel',WelcomeModel)
	function WelcomeModel(){
		var welcomeModel = this;
		_.extend(welcomeModel,{
			data:{},
			login:login
		});
		_.extend(welcomeModel.data,{
			username : '',
			phone_number :'',
			password : ''
		});
		/**
		status code =
		1 = success
		11 = username empty
		12 = password empty
		*/
		
		function init(){
			clear();
		}
		function clear(){
			welcomeModel.data.username='';
			welcomeModel.data.phone_number = '';
			welcomeModel.data.password='';
		}
		function login(){
			var message = '';
			if(welcomeModel.data.username=='' || welcomeModel.data.username==undefined){
				return 11;
			}
			if(welcomeModel.data.password=='' || welcomeModel.data.password==undefined){
				return 21;
			}
			return 1;
		}
		init();
	}
})()