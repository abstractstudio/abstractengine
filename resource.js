/** Resource management. */
var resource = {}

/* Constants. */
resource.IMAGE = "image";
resource.AUDIO = "audio";
resource.CREATED = 0;
resource.LOADING = 1;
resource.LOADED = 2;
resource.FAILED = 3;

/** The main resource class. Provides a wrapper for various external media sources. */
resource.Resource = function Resource(name, type, path) {
    
    /* Resource name. */
    this.name = name;
    
    /* Resource type defined in constants. */
    this.type = type;
    
    /* The path to the resource. */
    this.path = path;
    
    /* The status of the resource. */
    this.status = resource.CREATED;
    
    /* The content of the resource. */
    this.content = null;
    
    /* Load the resource. */
    this.load = function(hook) {
        
        /* Reference to self. */
        var that = this;
        
        /* Set status. */
        this.status = resource.LOADING;
        
        /* Load as an image. */
        if (this.type == resource.IMAGE) {
                        
            /* Create and set info. */
            this.content = new Image();
            this.content.onload = function() { that.status = resource.LOADED; hook(); }
            this.content.onerror = function() { that.status = resource.FAILED; hook(); }
            
            /* Run the image. */
            this.content.src = this.path;
            
        }
        
        /* Load as an audio. */
        else if (this.type == resource.AUDIO) {
            
            /* Create and set info. */
            this.content = new Audio();
            this.content.oncanplaythrough = function() { that.status = resource.LOADED; hook(); }
            this.content.onerror = function() { that.status = resource.FAILED; hook(); }
            
            /* Run the audio. */
            this.content.src = this.path;
            
        }
        
    }
    
}

/** The resource manager. */
resource.Manager = function Manager() {
    
    /* Keep track of resources to load. */
    this.jobs = [];
    this.map = {};
    this.status = resource.CREATED;
    
    /** Add a resource to the job list. */
    this.queue = function(name, path, type) {
    
        /* Add the jobs by name. */
        this.jobs.push(new resource.Resource(name, path, type));
    
    }
    
    /** Load all jobs. */
    this.load = function(hook) {
        
        /* Self reference. */
        var that = this;
        
        /* Iterate by name. */
        for (var i in this.jobs) {
            
            /* Get, set callback, load. */
            var job = this.jobs.shift();
            var callback = function() {
                
                /* Check if all jobs are done. */
                for (var j in that.jobs) {
                    if (that.jobs[j].status <= resource.LOADING) return;
                    that.status = Math.max(that.status, that.jobs[j].status);
                }
                
                /* Callback. */
                hook();
                
            }
            
            /* Load. */
            this.map[job.name] = job;
            job.load(callback);
            
        }
    
    }
    
    /** Get a resource. */
    this.get = this.$ = function(name) {
        
        /* Find the job and get the content. */
        if (name in this.map) return this.map[name].content;
        return undefined;
        
    }
    
}
