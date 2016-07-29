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
    
<<<<<<< HEAD
    /* Engine loops. */
    this.showDisplay = true;
    this.updateLimit = 60;
    this.updateInterval = 1000 / this.updateLimit;
    this.updateTime = 0;
    this.renderLimit = 100;
    this.renderInterval = 1000 / this.renderLimit;
    this.renderTime = 0;
    this.renderTimes = new Array(100);
            
    /* Set up the engine and its components. */
    this.setup = function() {
        
        /* Self reference. */
        var that = this;
        
        /* Keydown listener updates the keyboard. */
        document.addEventListener("keydown", function(e) {
            if (that.keyboard[e.keyCode] === undefined) that.keyboard[e.keyCode] = KEY.PRESSED;
            if (KEY.DEFAULT.indexOf(e.keyCode) > -1) e.preventDefault();  
        });
        
        /* Keyup listener. */
        document.addEventListener("keyup", function(e) {
            delete that.keyboard[e.keyCode];
        });
        
        /* Mouse position. */
        document.addEventListener("mousemove", function(e) {
            that.mouse.x = e.clientX;
            that.mouse.y = e.clientY;
        });

        /* DEMO CODE: Load some nice jams. 
        var that = this;
        this.manager.queue("song", RESOURCE.AUDIO, "assets/aesthic.m4a");
        this.manager.load(function() { 
            var song = that.manager.$("song");
            song.volume = 0.1; 
            song.play(); 
        });
        /* END DEMO CODE */
		
		/* Particle Demo */
		this.particleSystem = new ParticleSystem(400, 0);
        this.particleSystem.properties.posVar = new Vector(800, 0);
		this.particleSystem.properties.life = 15000;
		this.particleSystem.properties.lifeVar = 100;
		this.particleSystem.properties.angle = 90;
		this.particleSystem.properties.angleVar = 4;
		this.particleSystem.properties.speed = 0.175;
		this.particleSystem.properties.speedVar = 0.0025;
		this.particleSystem.properties.startRadius = 2.0;
        this.particleSystem.properties.startRadiusVar = 1.0;
       // this.particleSystem.properties.endRadius = 0.01;
       // this.particleSystem.properties.endRadiusVar = 0.0;
		this.particleSystem.properties.startColor = [238, 233, 233, 255];
        //this.particleSystem.properties.startColorVar = [50, 0, 0, 0];
       // this.particleSystem.properties.endColor = [255, 0, 0, 255];
		
		this.particleSystem.totalParticles = 10000;
		this.particleSystem.emissionRate = 1.5;
		
		this.particleSystem.init();
		/* END Particle Demo */
		
    }
    
    /* Update the engine and components. */
    this.update = function(delta) {
        /* Update the sprites. */
        for (var name in this.entities) {
            if (this.entities[name].autoupdate) this.entities[name].update(delta);
        }
        
        /* Change keys from pressed to down. */
        for (var key in this.keyboard) if (this.keyboard[key] == KEY.PRESSED) this.keyboard[key] = KEY.DOWN;
		
        /* Particle demo */
		this.particleSystem.update(delta);
=======
    /** Setup the engine. */
    this.setup = function() {}
    
    /** Default auto update loop. */
    this.update = function(delta) { 
        
        /* Update input. */
        this.input.update(delta);
        
>>>>>>> development
    }
    
    /** Default auto render loop. */
    this.render = function(delta) {
        
        /* Clear the canvas. */
<<<<<<< HEAD
		this.context.fillStyle = "black";
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
=======
        //this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = "white";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
>>>>>>> development
        
        /* Run the display. */
        if (this.display.visible) this.display();
        
        /* Particle demo */
		this.particleSystem.render(this.context);
    }
    
    /* Background update function. */
    this._update = function() { 
        
        /* Get the delta. */
        var delta = Date.now() - this._update.time;
        this._update.time = Date.now();
        
        /* Call the update. */
        this.update(delta);
        
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
        
        /* Start loops. */
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
