define(["angular"], function(angular) {
	return {
		start: function(module) {
			if(module) {
				angular.bootstrap(document, [module]);
			} else {
				angular.bootstrap(document, ['webApp']);
			}
		}
	}
});