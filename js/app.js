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

			})
		.state('configDetail.main',
			{
				url: '^/configurations/:configId/',
				controller: 'ConfigController',
				templateUrl: 'partials/configView/configDetail.main.html'
			})
		.state('configDetail.rules',
			{
				url: '^/configurations/:configId/rules',
				controller: 'ConfigController',
				templateUrl: 'partials/configView/configDetail.rules.html'
			})
		.state('configDetail.assertions',
			{
				url: '^/configurations/:configId/assertions',
				controller: 'ConfigController',
				templateUrl: 'partials/configView/configDetail.assertions.html'
			})
		.state('configDetail.plugins',
			{
				url: '^/configurations/:configId/plugins',
				controller: 'ConfigController',
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
		.state('history.crawl', 
			{
				url: '/:crawlId'
			});
	$urlRouterProvider
		.otherwise('/configurations');
}]);

app.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams){
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
	
	$rootScope.configurations = [{name: 'asdf', id: 'asdf2', url: "http://www.google.ca", lastCrawl: 20, lastDuration: 3000},
	{name: 'asdf', id: 'asdf', url: 'fdsa2', lastDuration: 212510}];
	$rootScope.plugins = [{id:"dummy-plugin",name:"Dummy Plugin",description:"Intended for testing purposes only. Does not contain any implementation classes.",
							jarFile:"E:\\crawljax-web-3.5.1\\plugins\\dummy-plugin.jar",crawljaxVersions:["3.4-SNAPSHOT"],
							parameters:[{id:"test_textbox",displayName:"Test Textbox",type:"textbox",options:{},"value":null},
										{id:"test_checkbox",displayName:"Test Checkbox",type:"checkbox",options:{},"value":null},
										{id:"test_select",displayName:"Test Select",type:"select",options:{"Option 1":"1","Option 2":"2","Option 3":"3"},"value":null}]}];
	$rootScope.crawlRecords = [];
	
	$rootScope.$on('$stateChangeSuccess', function(event, toState, fromState){
		var sideNav = angular.element("#sideNav").scope();
		switch(toState.name){
			case 'config':
				sideNav.links = [{icon: 'icon-pencil', target: 'configNew', text: 'New Configuration'}];
				break;
			case 'configDetail.main':
			case 'configDetail.rules':
			case 'configDetail.assertions':
			case 'configDetail.plugins':
				sideNav.links = [{icon: 'icon-play', target: 'run', action: true, text: 'Run Configuration'},
								{icon: 'icon-ok', target: 'save', action: true, text: 'Save Configuration'},
								{icon: 'icon-book', target: 'history.filter({filter: $stateParams.configId})', text: 'Crawl History'},
								{icon: 'icon-pencil', target: 'configNew.copy({copy: $stateParams.configId})', text: 'New Copy'},
								{icon: 'icon-remove', target: 'delete', action: true, text: 'Delete Configuration'}];
				break;
			case 'configNew':
			case 'configNew.copy':
				sideNav.links = [{icon: 'icon-ok', target: 'save', action: true, text: 'Save Configuration'}];
				break;
			case 'history.filter':
				sideNav.links = [{icon: 'icon-book', target: 'history', text: 'All Crawl Records'}];
				break;
			default:
				sideNav.links = [];
				break;
		}
	});
}])