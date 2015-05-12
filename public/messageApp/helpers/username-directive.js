/**
 * Created by kristian on 12/05/15.
 */
;(function(){
	'use strict';
	angular.module('messageApp')
		.directive('username', ['msgstate', function(msgstate){
			return {
				restrict: 'A',
				template: '<span>typing as <input class="username" type="text" ng-model="msgCtrl.name"/></span>',
				controller: ['$scope', function($scope){
					$scope.$watch(function($scope){
						return $scope.msgCtrl.name;
					}, function() {
						msgstate.setName($scope.msgCtrl.name);
					});
				}]
			};
		}]);
})();