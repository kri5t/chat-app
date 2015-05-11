/**
 * Created by kristian on 11/05/15.
 */
;(function(){
	'use strict';
	angular.module('messageApp')
		.directive('resizeHeight', ['$document', '$window', function($document, $window){
			return {
				link: function(scope, elem, attr){
					function calculateHeight(){
						var headerHeight = $document[0].getElementsByTagName("header")[0].offsetHeight;
						var footerHeight = $document[0].getElementsByTagName("footer")[0].offsetHeight;
						var windowHeight = $window.innerHeight;
						var containerHeight = windowHeight - headerHeight - footerHeight;
						return containerHeight;
					}

					function setHeight(){
						elem[0].style.height = calculateHeight() + "px";
					}

					$window.onresize = _.debounce(setHeight, 150);

					setHeight();
				}
			};
		}]);
})();