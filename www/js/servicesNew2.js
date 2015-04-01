angular.module('todo.io.services', [])

.value('appConfigService',{"groupRootId":"0"})
.value('initDatas', 
	//初始化用数据，在APP第一次安装时使用
		{ groups : [
        { title: '所有任务', badge: 25, groupId: -1, display: true, edit:false},
        { title: '已完成', badge: 6, groupId: -2, display: false, edit:false},
        { title: '今天', badge: 2, groupId: -3, display: true, edit:false},
        { title: '隐私', badge: 5, groupId: 1, display: true, edit:true},
        { title: '购物', badge: 7, groupId: 2, display: true, edit:true},
        { title: '想看的电影', badge: 9, groupId: 3, display: true, edit:true},
        { title: '愿望', badge: 4, groupId: 4, display: true, edit:true},
        { title: '日程安排', badge: 0, groupId: 5, display: true, edit:true}
    ]}
)
.service('storageService', function ($q, localStorageService) {
		this.createUUID = function(){
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		        return v.toString(16);
		    });
			//参考http://www.cnblogs.com/snandy/p/3261754.html
		};
		this.get = function(id){
			return localStorageService.get(id);
		};
		this.post = function(obj){
			if(typeof obj.id == 'undefined')obj.id = this.createUUID();
			return localStorageService.set(obj.id, obj);
		};
		this.put = function(obj){
			//待实现
		};
		this.del = function(id){
			var result = localStorageService.remove(id);
			return result;
		};
		this.exists = function(id){
			return (typeof get(id) != 'undefined') ?  true : false;
		};
		this.find = function(id){
			//待实现
		}
})
.provider('dummyData', function() {
    var menus = [
        { title: '所有任务', badge: 25, groupId: -1, display: true, edit:false},
        { title: '已完成', badge: 6, groupId: -2, display: false, edit:false},
        { title: '今天', badge: 2, groupId: -3, display: true, edit:false},
        { title: '隐私', badge: 5, groupId: 1, display: true, edit:true},
        { title: '购物', badge: 7, groupId: 2, display: true, edit:true},
        { title: '想看的电影', badge: 9, groupId: 3, display: true, edit:true},
        { title: '愿望', badge: 4, groupId: 4, display: true, edit:true},
        { title: '日程安排', badge: 0, groupId: 5, display: true, edit:true}
    ];
    var todos = [
        { id: 1, type: 1, status: 1, groupId: 1, importance: 2, classname: 'checkbox-energized', title: '下午有个会！', date: '2014/01/01' },
        { id: 25, type: 1, status: 1, groupId: 3, importance: 0, classname: 'checkbox-stable', title: '《达芬奇密码》', date: '2014/08/25' }
    ];
    this.$get = function() {
        return {menus: menus, todos: todos};
    };
})
<<<<<<< HEAD
.service('MenuService', function ($q, dummyData, storageService, appConfigService, initDataService) {
	var groups = [];
	var groupRootId = appConfigService.groupRootId;
	
	this.initApp = function(){
		console.log('initApp!!');
		  groups =  initDataService.groups;
		  storageService.post(groupRootId, groups);
	  };
    this.findAll = function () {
    	var deferred = $q.defer();
    	//如果groups没有加载，则先从存储中加载
    	if(groups.length <= 0){
    		console.log('load data from localstorage...');
    		groups = storageService.get(groupRootId);
    	}
    	deferred.resolve(groups);
    	return deferred.promise;
    };
    this.findGroupName = function(groupId) {
    	var deferred = $q.defer();
        var results = groups.filter(function(element) {
            return groupId === element.id;
=======
.service('MenuService', function ($q, dummyData, localStorageService, appConfigService, initDatas) {
	var groups = [];
	var groupRootId = appConfigService.groupRootId;
	//storageService
	this.initApp = function(){
		  groups =  initDatas.groups;
		  //storageService.set(groupRootId, groups);
	  };
    this.findAll =  function (display) {
    	var deferred = $q.defer();
    	//如果groups没有加载，则先从存储中加载
    	if(groups.length <= 0)groups = storageService.get(groupRootId);
    	deferred.resolve(groups);
    	return deferred.promise;
    };
    this.findGroupName = function(groupId) {
        var deferred = $q.defer();
        var results = dummyData.menus.filter(function(element) {
            return parseInt(groupId) === element.groupId;
>>>>>>> branch 'master' of git@github.com:drlf/ToDo-ionic.git
        });
        deferred.resolve(results);
        return deferred.promise;
    }
})

.factory('TodoListService', function ($q, dummyData) {
    return {
        findByGroupId: function (groupId, status, sortKey) {
            var deferred = $q.defer();
            var results = dummyData.todos.filter(function(element) {
                if (groupId == -1) {
                    return parseInt(status) === element.status;
                }
                if (groupId == -2) {
                    return 2 === element.status;
                }
                if (groupId == -3) {
                    return Date.today().equals(Date.parse(element.date, "yyyy/MM/dd"))
                            && parseInt(status) === element.status;
                }
                return parseInt(groupId) === element.groupId 
                        && parseInt(status) === element.status;
            });
            var results = results.sort(function(a, b){
               switch ( sortKey ) {
                  case "date": 
                    return a.date > b.date;
                  case "title": 
                    return a.title > b.title;
                  case "importance": 
                    return parseInt(b.importance) - parseInt(a.importance);
                  default: 
                    return parseInt(a.id) - parseInt(b.id);
               }
            });
            deferred.resolve(results);
            return deferred.promise;
        },
        findByTitle: function (titleKey) {
            var deferred = $q.defer();
            var results = dummyData.todos.filter(function(element) {
                return element.title.indexOf(titleKey) == -1 ? false : true;
            });
            deferred.resolve(results);
            return deferred.promise;
        }
    }
})
