/**
 * Created by kristian on 11/05/15.
 */
;(function(){
	'use strict';
	angular.module('messageApp')
	.directive('onFinishRender', function ($timeout) {
		return {
			restrict: 'A',
			link: function (scope, element, attr) {
				if (scope.$last === true) {
					$timeout(function () {
						scope.$emit('scroll-to-bottom');
					});
				}
			}
		}
	});
})();