/**
 * Created by kristian on 10/05/15.
 */
;(function(){
	'use strict';
	angular.module('messageApp')
		.controller('messageController', ['$scope', '$document', 'broadcast', 'routes', 'msgstate', function($scope, $document, broadcast, routes, msgstate){
			var self = this;
			self.messages = [];
			self.message = "";
			self.messageBuffer = [];
			self.offline = false;
			self.lastSeenMessage = {};
			self.name = "kri5t";
			init();

			//Public functions
			self.sendMessage = sendMessage;
			//End public functions

			//Private functions
			function init(){
				routes.getMessages(function(result){
					self.messages = result.messages;
					_.forEach(self.messages, function(message){
						self.lastSeenMessage = message;
					});
				});

				$scope.$on('message-received', function (event, data) {
					if(msgstate.offline)
						return;

					self.messages[data.stamp] = data;
					$scope.$apply();
					$scope.$broadcast('scroll-to-bottom');
				});

				$scope.$on('online', function(event, data){
					getLostMessages();
					sendBuffer();
				});
			}

			function getMessage(){
				var date = moment();
				return {
					message: self.message,
					name: self.name,
					date: date.toDate(),
					stamp: date.format('YYYY-MM-DDTHH:mm:ss:SSS') + CryptoJS.SHA256(self.name+self.message)
				}
			}

			function sendMessage(){
				if(!self.message)
					return;

				var msgObj = getMessage();

				if(msgstate.offline)
					self.messageBuffer.push(msgObj);
				else
					broadcast.sendMessage(msgObj);

				self.messages[msgObj.stamp] = msgObj;
				self.message = "";
			}

			function sendBuffer(){
				_.forEach(self.messageBuffer, function(bufferedMessage){
					broadcast.sendMessage(bufferedMessage);
				});
			}

			function getLostMessages(){
				routes.getMessagesFrom({ date: self.lastSeenMessage.date }, function(result){
					_.forEach(result.messages, function(message){
						self.messages[message.stamp] = message;
					})
				});
			}
			//End private functions
			return self;
		}]);
})();