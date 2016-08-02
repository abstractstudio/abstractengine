'use strict';

const IMAGE = "image";
const AUDIO = "audio";
const ANIMATION = "animation";
const CREATED = 0;
const LOADING = 1;
const LOADED = 2;
const FAILED = 3;

class Asset {

    constructor(name, type, path, options) {
        this.name = name;
        this.type = type;
        this.path = path;
        this.options = options;
        this.status = CREATED;
        this.content = null;
    }
    
    load(listener) {
        this.status = LOADING;
        var onload = () => { this.status = LOADED; listener(); }
        var onerror = () => { this.status = FAILED; listener(); }
        
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

        for (var key in this.options)
            if (this.options.hasOwnProperty(key))
                this.content[key] = this.options[key];
            
        this.content.src = this.path;
                
    }
    
}

class AssetManager extends EventManager {
    
    constructor() {
        super();
        this.assetJobs = [];
        this.assetMap = {};
        this.assetStatus = CREATED;
    }
    
    queueAsset(name, type, path, options) {
        this.assetJobs.push(new Asset(name, type, path, options));    
    }
    
    loadAssets(listener) {
        var that = this;
        
        for (var i in this.assetJobs) {
            var assetJob = this.assetJobs[i];
            var callback = () => {
                for (var j in this.assetJobs) {
                    if (this.assetJobs[j].status <= LOADING) return;
                    this.status = Math.max(this.status, this.assetJobs[j].status);
                }
                this.assetJobs = [];
                listener();
            }
            
            this.assetMap[assetJob.name] = assetJob;
            assetJob.load(callback);
        }
        
    
    }
    
    getAsset(name) {
        if (name in this.assetMap) return this.assetMap[name].content;
        return undefined;   
    }
   
}