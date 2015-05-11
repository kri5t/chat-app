/**
 * Created by kristian on 10/05/15.
 */
;(function(){
	'use strict';

	angular.module('messageApp')
		.factory('routes', ['$resource', function ($resource) {
			return $resource('/:serverResource/:action/:id', {serverResource: "messages"}, {
				getMessages: {
					method: 'GET',
					params: {
						'action': ''
					}
				}
			});
		}]);
})();