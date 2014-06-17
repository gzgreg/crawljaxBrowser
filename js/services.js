app.service('configHttp', ['$http', 'notificationService', function($http, notificationService){
	this.getConfigurations = function(){
		var request = $http({
		    url: 'http://jsonstub.com/rest/configurations',
		    method: 'GET',
		    headers: {
				'JsonStub-User-Key': '83f57ff1-339a-45c1-af3a-c3142b7e19e5',
				'JsonStub-Project-Key': '2196e73e-210d-46a7-bf01-775535a4d294'
			}
		});
		return request.then(function(result){
			return result.data;
		}, function(error){
			return [];
		});
	};
	this.getConfiguration = function(configId){
		var request = $http({
			url: 'http://jsonstub.com/rest/configurations/' + configId,
		    method: 'GET',
		    headers: {
		        'JsonStub-User-Key': '83f57ff1-339a-45c1-af3a-c3142b7e19e5',
		        'JsonStub-Project-Key': '2196e73e-210d-46a7-bf01-775535a4d294'
		    }
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
			url: 'http://jsonstub.com/rest/configurations/awefasefas',
		    method: 'PUT',
		    data: JSON.stringify(config, this.cleanJSON),
		    headers: {
		        'JsonStub-User-Key': '83f57ff1-339a-45c1-af3a-c3142b7e19e5',
		        'JsonStub-Project-Key': '2196e73e-210d-46a7-bf01-775535a4d294'
			}
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
			url: '/rest/configurations' + configId
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

app.service('pluginHttp', ['$http', 'notificationService', function($http, notificationService){
	this.getPlugins = function(){
		var request = $http({
			method: 'GET',
			url: 'http://jsonstub.com/rest/plugins',
			headers: {
		        'JsonStub-User-Key': '83f57ff1-339a-45c1-af3a-c3142b7e19e5',
		        'JsonStub-Project-Key': '2196e73e-210d-46a7-bf01-775535a4d294'
		    }
		});
		return request.then(function(result){
			return result.data;
		});
	};
	this.addPlugin = function(fileName, data, url, callback) {
		var fd = new FormData();
		fd.append("name", fileName);
		if(data) {
			fd.append("file", data);
		} else if(url) {
			fd.append("url", url);
		}
		return $http({
			method: 'POST',
			url: 'http://jsonstub.com/rest/plugins',
			data: fd,
			headers: {
		        'JsonStub-User-Key': '83f57ff1-339a-45c1-af3a-c3142b7e19e5',
		        'JsonStub-Project-Key': '2196e73e-210d-46a7-bf01-775535a4d294'
		    }
		});
	};
	this.getNewConfiguration = function(){
		var request = $http({
		    url: 'http://jsonstub.com/rest/configurations/new',
		    method: 'GET',
		    headers: {
		        'JsonStub-User-Key': '83f57ff1-339a-45c1-af3a-c3142b7e19e5',
		        'JsonStub-Project-Key': '2196e73e-210d-46a7-bf01-775535a4d294'
		    }
		});
		return request.then(function(result){
			return result.data;
		})
	};
}]);

app.service('pluginAdd', ['pluginHttp', 'notificationService', function(pluginHttp, notificationService){
	this.addFile = function(){
		var file = angular.element("pluginFile").val();
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
			});
		}
		reader.readAsDataURL(file);
	};
	this.addURL = function() {
		var url = this.get("url");
		if(!url) {
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
