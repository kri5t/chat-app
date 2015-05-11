/**
 * Created by kristian on 10/05/15.
 */
;(function(){
	'use strict';

	angular.module('messageApp')
		.factory('broadcast', ['$rootScope', function ($rootScope) {
			var self = this;
			var socket = io();
			broadcastReceivedMessage();
			//Public functions:
			self.sendMessage = sendMessage;
			//End public functions

			//Private functions:
			function broadcastReceivedMessage(){
				socket.on('message', function(msg){
					$rootScope.$broadcast('message-received', msg);
				});
			}

			function sendMessage(msg){
				socket.emit('message', msg);
			}
			//End private functions

			return self;
		}]);
})();