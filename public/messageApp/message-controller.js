/**
 * Created by kristian on 10/05/15.
 */
;(function(){
	'use strict';
	angular.module('messageApp')
		.controller('messageController', ['$scope', '$document', 'broadcast', 'routes', 'msgstate',
			function($scope, $document, broadcast, routes, msgstate){
				var self = this;
				self.messages = [];
				self.message = "";
				self.offline = false;
				self.lastSeenMessage = {};
				self.name = "";
				init();

				//Public functions
				self.sendMessage = sendMessage;
				//End public functions

				//Private functions
				function init(){
					msgstate.init();
					self.name = msgstate.getName();
					getMessagesFromServer();
					setupReceiveMessages();

					$scope.$on('online', function(event, data){
						getLostMessages();
						sendBuffer();
					});
				}

				function getMessagesFromServer() {
					routes.getMessages(function(result){
						self.messages = result.messages;
						_.forEach(self.messages, function(message){
							self.lastSeenMessage = message;
						});
						checkBuffer();
					});
				}

				function setupReceiveMessages(){
					$scope.$on('message-received', function (event, data) {
						if(msgstate.isOffline())
							return;

						self.messages[data.stamp] = data;
						$scope.$apply();
						$scope.$broadcast('scroll-to-bottom');
					});
				}

				function checkBuffer() {
					_.forEach(msgstate.getSavedMessages(), function(bufferedMessage){
						self.messages[bufferedMessage.stamp] = bufferedMessage;
					});
				}

				function getMessage(){
					var date = moment();
					return {
						message: self.message,
						name: msgstate.getName(),
						date: date.toDate(),
						stamp: date.format('YYYY-MM-DDTHH:mm:ss:SSS') + CryptoJS.SHA256(msgstate.getName()+self.message)
					}
				}

				function sendMessage(){
					if(!self.message)
						return;

					var msgObj = getMessage();

					if(msgstate.isOffline())
						msgstate.saveMessage(msgObj);
					else
						broadcast.sendMessage(msgObj);

					self.messages[msgObj.stamp] = msgObj;
					self.message = "";
				}

				function sendBuffer(){
					_.forEach(msgstate.getSavedMessages(), function(bufferedMessage){
						broadcast.sendMessage(bufferedMessage);
					});
					msgstate.clearSavedMessage();
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