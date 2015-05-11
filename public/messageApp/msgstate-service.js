/**
 * Created by kristian on 11/05/15.
 */
;(function(){
	'use strict';
	angular.module('messageApp')
		.factory('msgstate', function(){
			var self = this;
			self.offline = false;

			//Public functions
			self.goOffline = goOffline;
			self.goOnline = goOnline;
			//End public functions

			//Private functions
			function goOffline(){
				self.offline = true;
				return self.offline;
			}

			function goOnline(){
				self.offline = false;
				return self.offline;
			}
			//End private functions

			return self;
		});
})();