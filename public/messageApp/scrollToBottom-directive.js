/**
 * Created by kristian on 11/05/15.
 */
;(function(){
	'use strict';
	angular.module('messageApp')
		.directive('scrollToBottom', [function(){
			return {
				link: function(scope, elem, attr){
					function scrollToBottom(){
						elem[0].scrollTop = elem[0].scrollHeight;
					}

					scope.$on("scroll-to-bottom", function(){
						scrollToBottom();
					});
				}
			};
		}]);
})();