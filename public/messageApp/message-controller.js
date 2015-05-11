/**
 * Created by kristian on 10/05/15.
 */
;(function(){
	'use strict';
	angular.module('messageApp')
		.controller('messageController', ['$scope', '$document', 'broadcast', 'routes', function($scope, $document, broadcast, routes){
			var self = this;
			self.messages = [];
			self.message = "";
			self.messageBuffer = [];
			self.offline = false;
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
					self.messages[data.stamp] = data;
					$scope.$apply();
					$scope.$broadcast('scroll-to-bottom');
				});
			}

			function scrollToBottomOfMessages(){
			}

			function sendMessage(){
				broadcast.sendMessage(self.message);
				self.message = "";
			}
			//End private functions
		}]);
})();