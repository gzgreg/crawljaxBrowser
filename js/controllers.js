app.controller('BreadcrumbController', ['$scope', function($scope){
	$scope.links = [];
}]);

app.controller('ConfigIndexController', ['$scope', 'configHttp', function($scope, configHttp){
	
}]);

app.controller('ConfigController', ['$scope', '$rootScope', '$state', 'configHttp', 'restService', function($scope, $rootScope, $state, configHttp, restService){
	configHttp.getConfiguration($rootScope.$stateParams.configId).then(function(data){
		$scope.config = data;
	});
	restService.changeRest(function(link){
		switch(link.target){
			case 'run':
				console.log('run');
				break;
			case 'save':
				if(validateForm('config_form')) configHttp.updateConfiguration($scope.config, $rootScope.$stateParams.configId);
				break;
			case 'delete':
				if(confirm('Are you sure you want to delete this configuration?')) configHttp.deleteConfiguration($rootScope.$stateParams.configId);
				$state.go('config');
				break;
			default:
				break;
		}
	});
}]);

app.controller('ConfigNewController', ['$scope', '$state', 'configHttp', 'restService', function($scope, $state, configHttp, restService){
	configHttp.getNewConfiguration().then(function(data){
		$scope.config = data;
	});
	restService.changeRest(function(link){
		switch(link.target){
			case 'save':
				if(validateForm('config_form')){
					configHttp.postConfiguration($scope.config);
					$state.go('configDetail.main', {configId: $scope.config.id})
				}
				break;
			default:
				break;
		}
	});
}]);

app.controller('PluginsController', ['$scope', '$rootScope', 'pluginHttp', 'restService', 'notificationService', function($scope, $rootScope, pluginHttp, restService, notificationService){
	restService.changeRest(function(link){
		switch(link.target){
			case 'refresh':
				notificationService.notify("Refreshing List...", 0);
				pluginHttp.getPlugins().then(function(data){
					$rootScope.plugins = data;
					notificationService.notify("List Refreshed", 1);
				}, function(data){
					notificationService.notify("Error Refreshing List", -1);
				});
				break;
			case 'upload':
				break;
			case 'add':
				break;
			case 'delete':
				break;
			
		}
	});
	$scope.newPluginUrl = '';
}]);
app.controller('HistoryIndexController', ['$scope', '$filter', function($scope, $filter){
	
}]);

app.controller('SideNavController', ['$scope', '$rootScope', 'restService', function($scope, $rootScope, restService){
	$scope.links = [];
	$scope.$on('restChanged', function(){
		$scope.rest = restService.rest;
	})
}]);