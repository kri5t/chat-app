/**
 * Created by kristian on 10/05/15.
 */
;(function(){
	'use strict';

	angular.module('messageApp')
		.filter('msgAppDate', function ($filter) {
			var angularDateFilter = $filter('date');
			return function (theDate) {
				return angularDateFilter(theDate, 'dd-MM-yy HH:mm:ss');
			};
		});
})();