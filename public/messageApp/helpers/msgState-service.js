/**
 * Created by kristian on 11/05/15.
 */
;(function(){
	'use strict';
	angular.module('messageApp')
		.factory('msgstate', ['$rootScope', 'localStorageService', function($rootScope, localStorageService){
			var self = this,
				offline = false,
				messageBuffer = [],
				name = "Anonymous";

			//Public functions
			self.init = init;
			self.goOffline = goOffline;
			self.goOnline = goOnline;
			self.saveMessage = saveMessage;
			self.getSavedMessages = getSavedMessages;
			self.goOnline = goOnline;
			self.isOffline = isOffline;
			self.setName = setName;
			self.getName  = getName;
			self.clearSavedMessage  = clearSavedMessage;
			//End public functions

			//Private functions
			function init(){
				var ss = getStoredState();

				if(ss){
					name = ss.name || "Anonymous";
					messageBuffer = ss.messageBuffer || [];
					offline = ss.offline || false;
				}
			}

			function goOffline(){
				offline = true;
				storeState();
				return offline;
			}

			function goOnline(){
				offline = false;
				$rootScope.$broadcast('online');
				storeState();
				return offline;
			}

			function saveMessage(message){
				messageBuffer.push(message);
				storeState();
			}

			function getSavedMessages(){
				return messageBuffer;
			}

			function clearSavedMessage(){
				messageBuffer = [];
				storeState();
			}

			function isOffline(){
				return offline;
			}

			function storeState(){
				var state = {
					name: name,
					messageBuffer: messageBuffer,
					offline: offline
				};

				localStorageService.set("state", state);
			}

			function getStoredState(){
				return localStorageService.get("state");
			}

			function getName(){
				return name;
			}

			function setName(username){
				name = username;
				storeState();
			}
			//End private functions

			return self;
		}]);
})();