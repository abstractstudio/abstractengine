'use strict';

var IMAGE = "image";
var AUDIO = "audio";
var ANIMATION = "animation";
var CREATED = 0;
var LOADING = 1;
var LOADED = 2;
var FAILED = 3;

var Asset = function(name, type, path, options) {

    var that = this;
    
    this.name = name;
    this.type = type;
    this.path = path;
    this.options = options;
    this.status = CREATED;
    this.content = null;
    
    this.load = function(listener) {
        this.status = LOADING;
        var onload = function() { that.status = LOADED; listener(); }
        var onerror = function() { that.status = FAILED; listener(); }
        
        if (this.type == IMAGE) {
            this.content = new Image();
            this.content.onload = onload;
            this.content.onerror = onerror;
        } else if (this.type == AUDIO) {
            this.content = new Audio();
            this.content.oncanplaythrough = onload;
            this.content.onerror = onerror;
        } else if (this.type == ANIMATION) {
            this.content = new Animation();
            this.content.onload = onload;
            this.content.onerror = onerror;
        }

        for (var key in options)
            if (options.hasOwnProperty(key))
                this.content[key] = options[key];
            
        this.content.src = this.path;
                
    }
    
}

var asAssetManager = (function() {
        
    var assetJobs = [];
    var assetMap = {};
    var assetStatus = CREATED;
    
    var queueAsset = function(name, type, path, options) {
        this.assetJobs.push(new Asset(name, type, path, options));    
    }
    
    var loadAssets = function(listener) {
        var that = this;
        
        for (var i in this.assetJobs) {
            var assetJob = this.assetJobs[i];
            
            var callback = function() {
                for (var j in that.assetJobs) {
                    if (that.assetJobs[j].status <= LOADING) return;
                    that.status = Math.max(that.status, that.assetJobs[j].status);
                }
                that.assetJobs = [];
                listener();   
            }
            
            this.assetMap[assetJob.name] = assetJob;
            assetJob.load(callback);
        }
    
    }
    
    var getAsset = function(name) {
        if (name in this.assetMap) return this.assetMap[name].content;
        return undefined;   
    }
    
    return function() {
        this.assetJobs = assetJobs;
        this.assetMap = assetMap;
        this.assetStatus = assetStatus;
        this.queueAsset = queueAsset;
        this.loadAssets = loadAssets;
        this.getAsset = this.asset = getAsset;
        return this;
    }
    
})();