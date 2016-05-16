/** Resource constants. */
var RESOURCE = {
    IMAGE: "image",
    AUDIO: "audio",
    CREATED: 0,
    LOADING: 1,
    LOADED: 2,
    FAILED: 3,
}

/** The main resource class. Provides a wrapper for various external media sources. */
function Resource(name, type, path) {
    
    /* Main information. */
    this.name = name;
    this.type = type;
    this.path = path;
    this.status = RESOURCE.CREATED;
    this.content = null;
    
    /* Load the resource. */
    this.load = function(callback) {
        
        /* Reference to self. */
        var that = this;
        
        /* Set status. */
        this.status = RESOURCE.LOADING;
        
        /* Load as an image. */
        if (this.type == RESOURCE.IMAGE) {
                        
            /* Create and set info. */
            this.content = new Image();
            this.content.onload = function() { that.status = RESOURCE.LOADED; callback(); }
            this.content.onerror = function() { that.status = RESOURCE.FAILED; callback(); }
            
            /* Run the image. */
            this.content.src = this.path;
            
        }
        
        /* Load as an audio. */
        else if (this.type == RESOURCE.AUDIO) {
            
            /* Create and set info. */
            this.content = new Audio();
            this.content.oncanplaythrough = function() { that.status = RESOURCE.LOADED; callback(); }
            this.content.onerror = function() { that.status = RESOURCE.FAILED; callback(); }
            
            /* Run the audio. */
            this.content.src = this.path;
            
        }
        
    }
    
}

/** The resource manager. */
function Manager() {
    
    /* Keep track of resources to load. */
    this.jobs = {};
    this.status = RESOURCE.CREATED;
    
    /** Add a resource to the job list. */
    this.queue = function(name, path, type) {
    
        /* Add the jobs by name. */
        this.jobs[name] = new Resource(name, path, type);
    
    }
    
    /** Load all jobs. */
    this.load = function(callback) {
        
        /* Self reference. */
        var that = this;
        
        /* Iterate by name. */
        for (var name in this.jobs) {
            
            /* Get, set callback, load. */
            var job = this.jobs[name];
            var hook = function() {
                
                /* Check if all jobs are done. */
                for (var name in that.jobs) {
                    if (that.jobs[name].status <= RESOURCE.LOADING) return;
                    that.status = Math.max(that.status, that.jobs[name].status);
                    that.jobs[name].content.oncanplaythrough = function() {};
                    that.jobs[name].content.onerror = function() {};
                }
                
                /* Callback. */
                callback();
                
            }
            
            /* Load. */
            job.load(hook);            
        }
    
    }
    
    /** Get a resource. */
    this.get = this.$ = function(name) {
        
        /* Find the job and get the content. */
        if (this.jobs.hasOwnProperty(name)) return this.jobs[name].content;
        return undefined;
        
    }
    
}
