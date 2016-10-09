goog.require("engine.EventInterface");
goog.provide("engine.Asset");
goog.provide("engine.AssetManager");

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
            this.content.isRenderable = true;
        } else if (this.type == AUDIO) {
            this.content = new Audio();
            this.content.oncanplaythrough = onload;
            this.content.onerror = onerror;
            this.content.isRenderable = false;
        } else if (this.type == ANIMATION) {
            this.content = new Animation();
            this.content.onload = onload;
            this.content.onerror = onerror;
            this.content.isRenderable = true;
        }
        
        this.content.name = this.name;
        this.content.type = this.type;
        for (var key in this.options)
            if (this.options.hasOwnProperty(key)) 
                this.content[key] = this.options[key];
        this.content.src = this.path;   
    }
    
}

class AssetManager extends EventInterface {
    
    constructor(engine) {
        super();
        this.engine = engine;
        this.engine.managers.assets = this;
        this.jobs = [];
        this.map = {};
        this.status = CREATED;
    }
    
    queue(name, type, path, options) {
        this.jobs.push(new Asset(name, type, path, options));    
    }
    
    load(listener) {
        var that = this;
        if (this.jobs.length == 0)
            listener();
        for (var i in this.jobs) {
            var job = this.jobs[i];
            var callback = () => {
                for (var j in this.jobs) {
                    if (this.jobs[j].status <= LOADING) return;
                    this.status = Math.max(this.status, this.jobs[j].status);
                }
                this.jobs = [];
                listener();
            }
            this.map[job.name] = job;
            job.load(callback);
        }
    }
    
    get(name) {
        if (name in this.map) return this.map[name].content;
        return undefined;   
    }
   
}
