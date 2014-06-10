app.controller('ConfigIndexController', function($scope){
	$scope.message = "ConfigController";
});

app.controller('ConfigController', function($scope){
	$scope.config = {id:"asdf",name:"asdf",url:"http://gdriv.es/derivclicker/game.html",browser:"FIREFOX",numBrowsers:1,bootBrowser:true,reloadWaitTime:500,eventWaitTime:500,maxDepth:2,maxState:0,maxDuration:60,clickOnce:true,randomFormInput:true,clickDefault:true,clickRules:[],pageConditions:[{condition:"notVisibleId",expression:"eafsdf"}],invariants:[{condition:"visibleText",expression:"we3frwer"}],comparators:[{type:"regex",expression:"wer"}],formInputValues:[{name:"werwt34",value:"w4tw34tw34t"}],lastCrawl:1400815057634,lastDuration:15102,lastModified:1402338468500,plugins:[{}]}
});

app.controller('ConfigNewController', function($scope){
	$scope.config = {url: "http://", browser: "FIREFOX", numBrowsers: 1, bootBrowser: true, maxDepth: 2, maxState: 0, maxDuration: 60, eventWaitTime: 500, reloadWaitTime: 500, clickOnce: true};
});

app.controller('PluginsController', function($scope){
	$scope.message = "PluginsController";
});
app.controller('HistoryIndexController', function($scope, $filter){
	$scope.message = "HistoryController";
	
	$scope.crawlRecords = [{"id":1,"configurationId":"asdf","configurationName":"asdf","createTime":null,"startTime":1400773888354,"duration":23882,"outputFolder":"out\\crawl-records\\1","crawlStatus":"success","plugins":{}}];
});

app.controller('SideNavController', function($scope){
	$scope.links = [];
});