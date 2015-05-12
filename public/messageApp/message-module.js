/**
 * Created by kristian on 10/05/15.
 */
;(function(){
	'use strict';
	angular.module('messageApp', ['ngResource', 'LocalStorageModule'])
		.config(function (localStorageServiceProvider) {
			localStorageServiceProvider
				.setPrefix('msgApp');
		});
})();