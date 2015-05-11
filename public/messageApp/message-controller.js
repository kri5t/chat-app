/**
 * Created by kristian on 10/05/15.
 */
;(function(){
	'use strict';
	angular.module('messageApp')
		.controller('messageController', ['$scope', 'broadcast', 'routes', function($scope, broadcast, routes){
			var self = this;
			self.messages = [];
			self.message = "";
			init();

			//Public functions
			self.sendMessage = sendMessage;
			//End public functions

			//Private functions
			function init(){
				routes.getMessages(function(result){
					self.messages = result.messages;
				});

				$scope.$on('message-received', function (event, data) {
					console.log("RECEIVED");
					console.log(data.stamp);
					self.messages[data.stamp] = data;
					console.log(self.messages);
				});
			}

			function sendMessage(){
				broadcast.sendMessage(self.message);
				self.message = "";
			}
			//End private functions
		}]);
})();