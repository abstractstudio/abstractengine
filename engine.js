

/** The main game engine. */
function Engine(canvas) {
    
    /** Entities. */
    this.entities = {};
    
    /** Managers. */
    this.entities.resources = this.resources = new resource.Manager(this);
    this.entities.callbacks = this.callbacks = new callback.Manager(this);
    this.entities.modifiers = this.modifiers = new modifier.Manager(this);
    this.entities.input = this.input = new input.Manager(this);
    
    /** Graphics. */
    this.canvas = canvas;
    this.context = canvas ? canvas.getContext("2d") : null;
    
    /** Setup the engine. */
    this.setup = function() {}
    
    /** Default auto update loop. */
    this.update = function(delta) { 
        
        /* Update the sprites. */
        for (var name in this.entities) {
            var entity = this.entities[name];
            if (entity.update && entity.update.auto === true) this.entities[name].update(delta);
        }
        
        /* Update input. */
        this.input.update(delta);
        
    }
    
    /** Default auto render loop. */
    this.render = function(delta) {
        
        /* Clear the canvas. */
        //this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = "white";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        /* Draw any sprites. */
        for (var name in this.entities) {
            var entity = this.entities[name];
            if (entity.render && entity.render.auto === true) this.entities[name].render(delta);
        }
        
        /* Run the display. */
        if (this.display.visible) this.display();
        
    }
    
    /* Background update function. */
    this._update = function() { 
        
        /* Get the delta. */
        var delta = Date.now() - this._update.time;
        this._update.time = Date.now();
        
        /* Call the update. */
        this.update();
        
    }
    
    /** Update timing. */
    this._update.limit = 60;
    this._update.interval = 1000 / this._update.limit;
    this._update.time = 0;
    
    /* Background render function. */
    this._render = function() {
        
        /* Request another animation frame. */
        requestAnimationFrame(this._render.bind(this));
        
        /* Get the delta. */
        var delta = Date.now() - this._render.time;
        this._render.time = Date.now();
        
        /* Call render. */
        this.render(delta);
        
        /* Track. */
        this._render.history.unshift(delta);
        this._render.history.splice(-1);
        
    }
    
    /** Render timing. */
    this._render.time = 0;
    this._render.history = new Array(100);
    
    /** Display engine statistics. */
    this.display = function() { 
        
        /* Draw the frames per second. */
        var fps = this._render.history.map(function(x) { return 1000/x; }).reduce(function(a, b) { return a+b; }, 0) / this._render.history.length;
        this.context.fillStyle = "black";
		this.context.textAlign = "left";
		this.context.textBaseline = "hanging";
        this.context.font = "16px Verdana";
		this.context.fillText(Math.round(fps) + " fps", 10, 10);
        
    }
    
    /** Display visibility. */
    this.display.visible = true;
    
    /** Start the engine. */
    this.start = function() {
        
        /* Load, setup, and go! */
        this.setup();
        setInterval(this._update.bind(this), this._update.interval);
        this._render();
        
        /* Only bind stop if started. */
        var that = this;
        document.addEventListener("beforeunload", function(e) { that.stop(); });
        
    }
    
    /** Stop the engine. */
    this.stop = function() {
        
        /* Tests and says goodbye. */
        alert("Goodbye!");
        
    }
    
}