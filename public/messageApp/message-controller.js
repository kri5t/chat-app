/**
 * Created by kristian on 10/05/15.
 */
;(function(){
	'use strict';
	angular.module('messageApp')
		.controller('messageController', ['$scope', '$document', 'broadcast', 'routes', 'msgstate',
			function($scope, $document, broadcast, routes, msgstate){
				var self = this;
				self.messageObj = {};
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
					});
				}

				function getMessagesFromServer() {
					routes.getMessages(function(result){
						self.messageObj = result.messages;
						checkBuffer();
						messageObjToSortedArray(false);
					});
				}

				function setupReceiveMessages(){
					$scope.$on('message-received', function (event, data) {
						if(msgstate.isOffline())
							return;

						self.messageObj[data.stamp] = data;
						messageObjToSortedArray(false);
						$scope.$apply();
						$scope.$broadcast('scroll-to-bottom');
					});
				}

				function checkBuffer() {
					_.forEach(msgstate.getSavedMessages(), function(bufferedMessage){
						self.messageObj[bufferedMessage.stamp] = bufferedMessage;
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

					self.messageObj[msgObj.stamp] = msgObj;
					messageObjToSortedArray(true);
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
							self.messageObj[message.stamp] = message;
						});
						sendBuffer();
						messageObjToSortedArray(false);
					});
				}

				function messageObjToSortedArray(ownMessage){
					var messages = _.values(self.messageObj);
					var sortedMessages = _.sortBy(messages, function(message){
						return message.date;
					});
					if(!ownMessage)
						self.lastSeenMessage = sortedMessages[sortedMessages.length-1];

					self.messages = sortedMessages;
				}
				//End private functions
				return self;
			}]);
})();