var app = angular.module('crawljaxApp', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('config',
			{
				url: '/configurations',
				controller: 'ConfigIndexController',
				templateUrl: 'partials/config.html'
			})
		.state('configNew',
			{
				url: '/configurations/new',
				controller: 'ConfigNewController',
				templateUrl: 'partials/configNew.html'
			})
		.state('configNew.copy',
			{
				url: '/:copy',
				controller: 'ConfigNewController',
				templateUrl: 'partials/configNew.html'
			})	
		.state('configDetail',
			{
				url: '/configurations/:configId',
				templateUrl: 'partials/configView/configDetail.html',
				controller: 'ConfigController'
			})
		.state('configDetail.main',
			{
				url: '^/configurations/:configId/',
				templateUrl: 'partials/configView/configDetail.main.html'
			})
		.state('configDetail.rules',
			{
				url: '^/configurations/:configId/rules',
				templateUrl: 'partials/configView/configDetail.rules.html'
			})
		.state('configDetail.assertions',
			{
				url: '^/configurations/:configId/assertions',
				templateUrl: 'partials/configView/configDetail.assertions.html'
			})
		.state('configDetail.plugins',
			{
				url: '^/configurations/:configId/plugins',
				templateUrl: 'partials/configView/configDetail.plugins.html'
			})
		.state('plugins',
			{
				url: '/plugins',
				controller: 'PluginsController',
				templateUrl: 'partials/plugins.html',
			})
		.state('history',
			{
		    	url: '/history',
				controller: 'HistoryIndexController',
    			templateUrl: 'partials/history.html',

			})
		.state('history.filter',
			{
				url: '/filter/:filter',
				controller: 'HistoryIndexController',
				templateUrl: 'partials/history.html'
			})
		.state('crawl', 
			{
				url: '/history/:crawlId',
				templateUrl: 'partials/crawlView/crawl.html'
			})
		.state('crawl.log',
			{
				url: '^/history/:crawlId/log',
				templateUrl: 'partials/crawlView/crawl.log.html'
			})
		.state('crawl.pluginOutput',
			{
				url: '^/history/:crawlId/plugin/:pluginId',
				templateUrl: 'partials/crawlView/crawl.pluginOutput.html'
			});
	$urlRouterProvider
		.otherwise('/configurations');
}]);

app.run(['$rootScope', '$state', '$stateParams', 'configHttp', function($rootScope, $state, $stateParams, configHttp){
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
	
	$rootScope.browsers = [{name: "Mozilla Firefox", value: "FIREFOX"}, {name: "Google Chrome", value: "CHROME"}, {name: "Internet Explorer", value: "INTERNET EXPLORER"}];
	
	$rootScope.clickConditions = [
		{name: "With Attribute (name=value):", value:"wAttribute"},
		{name: "With Text:", value:"wText"},
		{name: "Under XPath:", value:"wXPath"},
		{name: "When URL contains:", value:"url"},
		{name: "When URL does not contain:", value:"notUrl"},
		{name: "When Regex:", value:"regex"},
		{name: "When not Regex:", value:"notRegex"},
		{name: "When XPath:", value:"xPath"},
		{name: "When not XPath:", value:"notXPath"},
		{name: "When element is visible with id:", value:"visibleId"},
		{name: "When element is not visible with id:", value:"notVisibleId"},
		{name: "When element is visible with text:", value:"visibleText"},
		{name: "When element is not visible with text:", value:"notVisibleText"},
		{name: "When element is visible with tag:", value:"visibleTag"},
		{name: "When element is not visible with tag:", value:"notVisibleTag"},
		{name: "When Javascript is true:", value:"javascript"}];
		
	$rootScope.pageConditions = [
		 {name: "When URL contains:", value:"url"},
		 {name: "When URL does not contain:", value:"notUrl"},
		 {name: "When Regex:", value:"regex"},
		 {name: "When not Regex:", value:"notRegex"},
		 {name: "When XPath:", value:"xPath"},
		 {name: "When not XPath:", value:"notXPath"},
		 {name: "When element is visible with id:", value:"visibleId"},
		 {name: "When element is not visible with id:", value:"notVisibleId"},
		 {name: "When element is visible with text:", value:"visibleText"},
		 {name: "When element is not visible with text:", value:"notVisibleText"},
		 {name: "When element is visible with tag:", value:"visibleTag"},
		 {name: "When element is not visible with tag:", value:"notVisibleTag"},
		 {name: "When Javascript is true:", value:"javascript"}];
	
	$rootScope.comparators = [
		 {name: "Ignore Attribute:", value:"attribute"},
		 {name: "Ignore White Space", value:"simple"},
		 {name: "Ignore Dates", value:"date"},
		 {name: "Ignore Scripts", value:"script"},
		 {name: "Only observe plain DOM structure", value:"plain"},
		 {name: "Ignore Regex:", value:"regex"},
		 {name: "Ignore XPath:", value:"xPath"},
		 {name: "Ignore within Distance Edit Threshold:", value:"distance"}];
	
	configHttp.getConfigurations().then(function(data){
		$rootScope.configurations = data;
	});
	
	$rootScope.plugins = [{id:"dummy-plugin",name:"Dummy Plugin",description:"Intended for testing purposes only. Does not contain any implementation classes.",
							jarFile:"E:\\crawljax-web-3.5.1\\plugins\\dummy-plugin.jar",crawljaxVersions:["3.4-SNAPSHOT"],
							parameters:[{id:"test_textbox",displayName:"Test Textbox",type:"textbox",options:{},"value":null},
										{id:"test_checkbox",displayName:"Test Checkbox",type:"checkbox",options:{},"value":true},
										{id:"test_select",displayName:"Test Select",type:"select",options:{"Option 1":"1","Option 2":"2","Option 3":"3"},"value":null}]}];
	$rootScope.crawlRecords = [{"id":1,"configurationId":"asdf","configurationName":"asdf","createTime":null,"startTime":1400773888354,"duration":23882,"outputFolder":"out\\crawl-records\\1","crawlStatus":"success","plugins":{}}];
	
	$rootScope.$on('$stateChangeSuccess', function(event, toState, fromState){
		var sideNav = angular.element("#sideNav").scope();
		var breadcrumb = angular.element("#breadcrumb").scope();
		switch(toState.name){
			case 'config':
				sideNav.links = [{icon: 'icon-pencil', target: 'configNew', action: false, text: 'New Configuration'}];
				breadcrumb.links = [{text: 'Configurations'}];
				break;
			case 'configDetail.main':
			case 'configDetail.rules':
			case 'configDetail.assertions':
			case 'configDetail.plugins':
				sideNav.links = [{icon: 'icon-play', target: 'run', action: true, text: 'Run Configuration'},
								{icon: 'icon-ok', target: 'save', action: true, text: 'Save Configuration'},
								{icon: 'icon-book', target: 'history.filter({filter: $stateParams.configId})', action: false, text: 'Crawl History'},
								{icon: 'icon-pencil', target: 'configNew.copy({copy: $stateParams.configId})', action: false, text: 'New Copy'},
								{icon: 'icon-remove', target: 'delete', action: true, text: 'Delete Configuration'}];
				breadcrumb.links = [{text: 'Configurations', target: 'config'}, {text: $stateParams.configId}]
				break;
			case 'configNew':
			case 'configNew.copy':
				sideNav.links = [{icon: 'icon-ok', target: 'save', action: true, text: 'Save Configuration'}];
				breadcrumb.links = [{text: 'Configurations', target: 'config'}, {text: 'New'}];
				break;
			case 'plugins':
				breadcrumb.links = [{text: 'Plugins'}];
				break;
			case 'history':
				breadcrumb.links = [{text: 'History'}];
				break;
			case 'history.filter':
				sideNav.links = [{icon: 'icon-book', target: 'history', action: false, text: 'All Crawl Records'}];
				breadcrumb.links = [{text: 'History'}];
				break;
			case 'crawl.log':
			case 'crawl.pluginOutput':
				sideNav.links = [{icon: 'icon-wrench', target: 'configDetail.main({configId: {{crawl.configurationId}} })', action: false, text: 'Configuration'}]
				breadcrumb.links = [{text: 'History', target: 'history'}, {text: 'Crawl ' + $stateParams.crawlId}];
				break;
			default:
				sideNav.links = [];
				break;
		}
	});
}])