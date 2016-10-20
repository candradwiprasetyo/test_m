(function () {
	'use strict';
	angular
		.module('app')
		.controller('TimelineController', TimelineController);
		
	TimelineController.$inject = ['CiayoService','modalFactory','postFactory','timelineFactory'];
	function TimelineController(CiayoService,modalFactory,postFactory,timelineFactory,$scope) {
		var vm = this;
		angular.extend(vm,{
			//FACTORY
			post:postFactory,
			timeline:timelineFactory,
			//POST
			setStatePost:setStatePost,
			//TIMELINE
			loadCard:loadCard,
			newPostLoad:newPostLoad
		});
		init();
		function init(){
			postFactory.init();
			vm.timeline.type='timeline';
			vm.timeline.init();
		}
		function setStatePost(value){
			var scrollPos = 0;
			if(value=='open'){
				scrollPos = $(window).scrollTop();
				$("html, body").css({"height": $(window).height(), "overflow": "hidden"});
				$(".cm").addClass("-locked")
				vm.post.init();
				vm.post.setState('post');
				$('.cm-timeline').css('visibility','hidden');
			} 
			else
			{
				if(value=='save'){
					if(savePost()==false){return;}
					timelineFactory.loading_count.push({});
				}
				$(".cm").removeClass("-locked")
				vm.post.setState('none')
				$("html, body").removeAttr("style");
				$(window).scrollTop(scrollPos);
				$('.cm-timeline').css('visibility','visible');
			}
		}
		function savePost(){
			return vm.post.save(function(data){
				if(data){
					timelineFactory.loading_count.pop();
					vm.timeline.insert(data);
				}
			})
		}
		function loadCard(){
			timelineFactory.getCardList();
		}
		function newPostLoad(){
			$('body').animate({'scrollTop':125});
			vm.timeline.newPostLoad();
		}
	}
})();