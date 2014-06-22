app.service('socket', ['$rootScope', 'notificationService', 'historyHttp', function($rootScope, notificationService, historyHttp){
	this.executionQueue = [];
	this.updateQueue = function(id, status){
		var element = this.executionQueue.find(function(item){
			return (item.id == id);
		});
		if (element != null)
			element.crawlStatus = status;
	};
	this.removeQueue = function(id) {
		var element = this.executionQueue.find(function(item){
			return (item.id == id);
		});
		if (element != null)
			this.executionQueue.splice(this.executionQueue.indexOf(element), 1);
	};
	this.socket = null;
	this.connectSocket = function(){
		var loc = window.location, host;
		if (loc.protocol === "https:") {
			host = "wss:";
		} else {
			host = "ws:";
		}
		host += "//" + loc.host;
		host += loc.pathname + "socket";

		try {
			var service = this;
			this.socket = new WebSocket(host);
			
			this.socket.onmessage = function(msg){
				if (msg.data.indexOf('log-') == 0)
					$('#logPanel').append('<p>'+msg.data.slice(4)+'</p>');
				if (msg.data.indexOf('queue-') == 0) {
					var record = JSON.parse(msg.data.slice(6));
					record.plugins = [];
					service.executionQueue.push(record);
				}
				if (msg.data.indexOf('init-') == 0)
					service.updateQueue(msg.data.slice(5), "initializing");
				if (msg.data.indexOf('run-') == 0)
					service.updateQueue(msg.data.slice(4), "running");
				if (msg.data.indexOf('fail-') == 0) {
					service.updateQueue(msg.data.slice(5), "failure");
					setTimeout(function(){service.removeQueue(msg.data.slice(5));}, 5000);
				}
				if (msg.data.indexOf('success-') == 0) {
					service.updateQueue(msg.data.slice(8), "success");
					setTimeout(function(){service.removeQueue(msg.data.slice(8));}, 5000);
				}
				if (msg.data.indexOf('message-') == 0) {
					var positivity = 0;
					if (msg.data.indexOf('success-') == 8) {
						positivity = 1;
						notificationService.notify(msg.data.slice(16), positivity);
					} else if (msg.data.indexOf('error-') == 8) {
						positivity = -1;
						notificationService.notify(msg.data.slice(14), positivity);
					} else {
						notificationService.notify(msg.data.slice(8), positivity);
					}
				}
			};
			this.socket.onclose = function(){
				service.connectSocket();
			};
		}catch(exception){
			 alert('Error'+exception);
		}
	};
}]);

app.service('configHttp', ['$http', 'notificationService', function($http, notificationService){
	this.getConfigurations = function(){
		var request = $http({
		    url: '/rest/configurations',
		    method: 'GET'
		});
		return request.then(function(result){
			return result.data;
		}, function(error){
			return [];
		});
	};
	this.getConfiguration = function(configId){
		var request = $http({
			url: '/rest/configurations/' + configId,
		    method: 'GET'
		});
		return request.then(function(result){
			return result.data;
		}, function(error){
			return {};
		});
	};
	this.getNewConfiguration = function(){
		var request = $http({
		    url: '/rest/configurations/new',
		    method: 'GET',
		});
		return request.then(function(result){
			return result.data;
		}, function(error){
			return {};
		})
	};
	this.postConfiguration = function(config){
		var request = $http({
			method: 'POST',
			url: '/rest/configurations',
			data: JSON.stringify(config, this.cleanJSON)
		});
		request.then(function(result){
			notificationService.notify("Configuration Saved", 1);
		}, function(error){
			notificationService.notify("Error Saving Configuration", -1);
		})
	};
	this.updateConfiguration = function(config, configId){
		var request = $http({
			url: '/rest/configurations/awefasefas',
		    method: 'PUT',
		    data: JSON.stringify(config, this.cleanJSON)
		});
		request.then(function(result){
			notificationService.notify("Configuration Saved", 1);
		}, function(error){
			notificationService.notify("Error Saving Configuration", -1);
		})
	};
	this.deleteConfiguration = function(configId){
		var request = $http({
			method: 'DELETE',
			url: '/rest/configurations/' + configId
		});
		request.then(function(result){
			notificationService.notify("Configuration Deleted", 1);
		}, function(error){
			notificationService.notify("Error Deleting Configuration", -1);
		})
	};
	this.cleanJSON = function(key, value){
		if(value == null){
			return 0;
		}
		return value;
	}
}]);

app.service('configAdd', [function(){
	this.addCondition = function(config){
		config.pageConditions.push({condition: 'url', expression: ''});
	};
	this.addFilter = function(config){
		config.comparators.push({type: 'attribute', expression: ''});
	};
	this.addFormField = function(config){
		config.formInputValues.push({name: '', value: ''});
	}
	this.addInvariant = function(config){
		config.invariants.push({condition: 'url', expression: ''});
	}
	this.addPlugin = function(config){
		config.plugins.push({});
	}
	this.deletePlugin = function(config, index){
		config.plugins.splice(index, 1);
	}
}]);

app.service('pluginHttp', ['$http', 'notificationService', function($http, notificationService){
	this.getPlugins = function(){
		var request = $http({
			method: 'GET',
			url: '/rest/plugins'
		});
		return request.then(function(result){
			return result.data;
		});
	};
	this.getPlugin = function(pluginId){
		var request = $http({
			method: 'GET',
			url: '/rest/plugins/' + pluginId
		});
		return request.then(function(result){
			return result.data;
		});
	};
	this.addPlugin = function(fileName, data, url) {
		var fd = new FormData();
		fd.append("name", fileName);
		if(data) {
			fd.append("file", data);
		} else if(url) {
			fd.append("url", url);
		}
		return $http({
			method: 'POST',
			url: '/rest/plugins',
			data: fd
		});
	};
	this.deletePlugin = function(pluginId){
		var request = $http({
		    url: '/rest/plugins/' + pluginId,
		    method: 'DELETE'
		});
		request.then(function(result){
			notificationService.notify("Plugin Deleted", 1);
		}, function(error){
			notificationService.notify("Error Deleting Plugin", -1);
		})
	};
}]);

app.service('historyHttp', ['$http', 'notificationService', function($http, notificationService){
	this.getHistory = function(active){
		var data = '';
		if(active) data = {active: true};
		var request = $http({
			method: 'GET',
			url: '/rest/history',
			data: data
		});
		return request.then(function(result){
			return result.data;
		});
	};
	this.getCrawl = function(crawlId){
		var request = $http({
			method: 'GET',
			url: '/rest/history/' + crawlId
		});
		return request.then(function(result){
			return result.data;
		});
	};
	this.addCrawl = function(config){
		return $http({
			method: 'POST',
			url: '/rest/history',
			data: {configurationId: config.id}
		});
	};
}]);

app.service('pluginAdd', ['pluginHttp', 'notificationService', function(pluginHttp, notificationService){
	this.addFile = function(){
		var file = angular.element("#pluginFile").get(0).files[0];
		if(!file){
			alert("Please select a file");
			return;
		}
		if(file.name.indexOf(".jar") === -1 || file.name.indexOf(".jar") !== file.name.length - 4) {
			alert("Please select a .jar file");
			return;
		}
		notificationService.notify("Uploading Plugin...", 0);
		var _this = this;
		var reader = new FileReader();
		reader.onload = function(e) {
			pluginHttp.addPlugin(file.name, e.target.result, undefined).then(function(result){
				notificationService.notify('Plugin Uploaded', 1);
			}, function(error){
				notificationService.notify('Error Uploading Plugin', -1);
				console.log(error);
			});
		}
		reader.readAsDataURL(file);
	};
	this.addURL = function(url) {
		console.log(url);
		if(url.length == 0) {
			alert("Please enter a url");
			return;
		}
		var name =  url.split("/").pop();
		notificationService.notify("Downloading Plugin...", 0);
		var _this = this;
		pluginHttp.addPlugin(name, undefined, url).then(function(result){
			notificationService.notify('Plugin Downloaded', 1);
		}, function(error){
			notificationService.notify('Error Downloading Plugin', -1);
		});
	}
}]);

app.service('restService', ['$rootScope', function($rootScope){
	this.rest = null;
	this.changeRest = function(newRest){
		this.rest = newRest;
		$rootScope.$broadcast('restChanged');
	};
}]);

app.service('notificationService', function(){
	this.notify = function(text, positivity) {
		var clazz = "info";
		if(positivity > 0) clazz = "success";
		if(positivity < 0) clazz = "error";
		$('#notification').removeClass().addClass("alert").addClass("alert-" + clazz).text(text);
		clearTimeout(this.messageTimeout);
		this.messageTimeout = setTimeout(function() {
			$('#notification').removeClass().addClass("alert").addClass("alert-mute");
		}, 3000);
  };
})
