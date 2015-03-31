angular.module('todo.io.services', [])
//constant('groupRootId', '0')
.value('appConfigService',{"groupRootId":"0"})
.provider('initDataService', function() {
	//初始化用数据，在APP第一次安装时使用
    var groups = [
        { title: '所有任务', id: 1, display: true, system: true},
        { title: '已完成', id: 2, display: false, system: true},
        { title: '今天', id: 3, display: true, system: true},
        { title: '愿望', id: 4, display: true},
        { title: '日程安排', id: 5, display: true}
    ];
    
})
.factory('storageService', function ($q, localStorageService) {
	return{
		createUUID: function(){
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		        return v.toString(16);
		    });
			//参考http://www.cnblogs.com/snandy/p/3261754.html
		},
		get: function(id){
			return localStorageService.get(id);
		},
		post: function(obj){
			if(typeof obj.id == 'undefined')obj.id = createUUID();
			return localStorageService.set(obj.id, obj);
		},
		put: function(obj){
			//待实现
		},
		del: function(id){
			var result = localStorageService.remove(id);
			return result;
		},
		exists: function(id){
			return (typeof get(id) != 'undefined') ?  true : false;
		},
		find: function(id){
			//待实现
		}
	}
})
.factory('MenuService', function ($q, storageService, appConfigService, initDataService) {
	var groups = [];
	var groupRootId = appConfigService.groupRootId;
  return {
	  initApp: function(){
		  groups =  initDataService.groups;
		  storageService.set(groupRootId, groups);
	  },
	  findAll: function () {
		  var deferred = $q.defer();
    	//如果groups没有加载，则先从存储中加载
    	if(groups.length <= 0)groups = storageService.get(groupRootId);
    	deferred.resolve(groups);
    	return deferred.promise;
    },
    findGroupName: function(groupId) {
    	//if(groups.length < 1)findAll(); //装载数据
    	var deferred = $q.defer();
        var results = groups.filter(function(element) {
            return groupId === element.id;
        });
        deferred.resolve(results);
        return deferred.promise;
    },
    exists: function(groupId){
    	
    	/*for(group in groups){
    		if(group.id == groupId)return true;
    	}*/
    	return false;
    },
    delGroup: function(id){
    	for(group in groups){
    		if(group.id == id)groups.remove(group);
    	};
    },
    postGroup: function(obj){
    	if(typeof (obj.id) == 'undefined')obj.id = storageService.createUUID();
    	else delGroup(obj.id); //找到该group并删除，如果没有则忽略
    	groups.push(obj);
		storageService.set(groupRootId, groups);
		return;
    },
    addGroup: function(obj){
    	console.log('[meuService]addGroup : ',obj);
    	postGroup(obj);
    }
    
  }
})

.factory('TodoListService', function ($q, dummyData) {
    return {
        findByGroupId: function (groupId, status, sortKey) {},
        findByTitle: function (titleKey) {
        }
    }
})