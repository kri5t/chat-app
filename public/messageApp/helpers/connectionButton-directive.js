/**
 * Created by kristian on 11/05/15.
 */
;(function(){
	'use strict';
	angular.module('messageApp')
		.directive('connectionButton', function(){
			return {
				restrict: 'A',
				scope:{},
				template: '<button ng-hide="connectionCtrl.offline" ng-click="connectionCtrl.goOffline()" class="btn btn-danger btn-sm">Go offline</button>' +
						  '<button ng-show="connectionCtrl.offline" ng-click="connectionCtrl.goOnline()" class="btn btn-success btn-sm">Go online</button>',
				controllerAs: 'connectionCtrl',
				controller: ['msgstate', '$scope', function(msgstate, $scope){
					var self = this;
					self.offline = msgstate.isOffline();

					//Public functions
					self.goOffline = goOffline;
					self.goOnline = goOnline;
					//End public functions

					function goOffline(){
						self.offline = msgstate.goOffline();
					}

					function goOnline(){
						self.offline = msgstate.goOnline();
					}

					return self;
				}]
			};
		});
})();