+function(){
	"use strict";
	angular
		.module("CiayoFriendConnection", [])
		.directive("cFriendConnection", cFriendConnection)
	;
	function cFriendConnection(){
		return {
			restrict: "E",
			scope: {'user':'=','type':'='},
			replace:true,
			templateUrl: DIRECTIVES_VIEW+'friend-connection.html'
		}
	}
}();