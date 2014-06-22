app.controller('ConfigIndexController', ['$rootScope', 'configs', function($rootScope, configs){
	$rootScope.configurations = configs;
}]);

app.controller('ConfigController', ['$scope', '$rootScope', '$state', 'configAdd', 'configHttp', 'pluginHttp', 'historyHttp', 'restService', 'config', function($scope, $rootScope, $state, configAdd, configHttp, pluginHttp, historyHttp, restService, config){
	$scope.config = config;
	
	restService.changeRest(function(link){
		switch(link.target){
			case 'run':
				historyHttp.addCrawl(config);
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
	
	$scope.configAdd = configAdd;
	$scope.setPlugin = function(plugin, configId){
		if(typeof configId != 'undefined'){
			pluginHttp.getPlugin(configId).then(function(data){
				var pluginHolder = data;
				
				for(var property in pluginHolder){
					plugin[property] = pluginHolder[property];
				}
			});
		}
		else{
			for(var property in plugin){
				plugin[property] = undefined;
			}
		}
	}
}]);

app.controller('ConfigPluginsController', ['$rootScope', 'plugins', function($rootScope, plugins){
	$rootScope.plugins = plugins;
}]);

app.controller('ConfigNewController', ['$scope', '$state', 'restService', 'config', function($scope, $state, restService, config){
	$scope.config = config;
	
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

app.controller('PluginsController', ['$scope', '$rootScope', 'pluginHttp', 'pluginAdd', 'restService', 'notificationService', 'plugins', function($scope, $rootScope, pluginHttp, pluginAdd, restService, notificationService, plugins){
	$scope.newPluginURL = '';
	$rootScope.plugins = plugins;
	
	if(!(window.File && window.FileReader && window.FileList && window.Blob)){
		alert('The File APIs are not fully supported in this browser.');
	}
	
	$scope.rest = function(link){
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
				pluginAdd.addFile();
				break;
			case 'add':
				pluginAdd.addURL($scope.newPluginURL);
				break;
			case 'delete':
				pluginHttp.deletePlugin(link.pluginId);
				break;
			default:
				break;
		}
	};
}]);

app.controller('HistoryIndexController', ['$rootScope', '$filter', 'crawlRecords', function($rootScope, $filter, crawlRecords){
	$rootScope.crawlRecords = crawlRecords;
}]);

app.controller('CrawlRecordController', ['$scope', '$rootScope', 'historyHttp', 'crawl', function($scope, $rootScope, historyHttp, crawl){
	$scope.crawl = crawl;
	
	angular.element("#sideNav").scope().configId = crawl.configurationId;
}]);

app.controller('CrawlRecordPluginController', ['$scope', '$rootScope', '$sce', function($scope, $rootScope, $sce){
	$scope.trustedUrl = $sce.trustAsResourceUrl('/output/crawl-records/' + $rootScope.$stateParams.crawlId + '/plugins/' + $rootScope.$stateParams.pluginId)
}]);

app.controller('BreadcrumbController', ['$scope', function($scope){
	$scope.links = [];
}]);

app.controller('SideNavController', ['$scope', '$rootScope', 'restService', function($scope, $rootScope, restService){
	$scope.links = [];
	$scope.$on('restChanged', function(){
		$scope.rest = restService.rest;
	})
}]);

app.controller('CrawlQueueController', ['$scope', 'socket', function($scope, socket){
	$scope.queue = socket.executionQueue;
}]);