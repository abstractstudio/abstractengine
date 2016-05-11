/* Determine the graphics request call. */
locate("requestAnimationFrame");
                         
/* Key states. */
var KEY = {PRESSED: 1, DOWN: 2, DEFAULT: [37, 39, 38, 40, 32], 
           W: 87, A: 65, S: 83, D: 68, 
           UP: 38, LEFT: 37, DOWN: 40, RIGHT: 39, 
           C: 67, SPACE: 32,
           ESCAPE: 27};

/* The main engine class. */
function Engine(canvas) {
    
    /* Graphical components. */
    this.canvas = canvas;
    if (canvas) this.context = canvas.getContext("2d");
    
    /* Input. */
    this.keyboard = {};
    this.mouse = {x: 0, y: 0};
    
    /* Resources and sprites. */
    this.manager = new Manager();
    this.entities = {};
    
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
            that.mouse.x = event.clientX;
            that.mouse.y = event.clientY;
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
    }
    
    /* Render the canvas. */
    this.render = function(delta) {
        
        /* Clear the canvas. */
		this.context.fillStyle = "black";
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
		/* Draw data. */
		if (this.showDisplay) this.display();
		
        /* Draw the sprites. */
        for (var name in this.entities) if (this.entities[name].autorender) this.entities[name].render(this.context);
        
        /* Particle demo */
		this.particleSystem.render(this.context);
    }
    
    /* Call the update hook. */
    this._update = function() {
        
        /* Get the delta. */
        var delta = Date.now() - this.updateTime;
        this.updateTime = Date.now();
        
        /* Call the function. */
        this.update(delta);
        
    }
    
    /* Call the render hook. */
    this._render = function() {
        
        /* Request another animation frame. */
        requestAnimationFrame(this._render.bind(this));
    
        /* Get the delta. */
        var delta = Date.now() - this.renderTime;
        
        /* Call the function. */
        if (delta > this.renderInterval) {
            this.render(delta);
            this.renderTime = Date.now();
            this.renderTimes.unshift(delta);
            this.renderTimes.splice(-1);
        }
        
    }
    
    /* Start the engine. */
    this.start = function() {
        
        /* Load, setup and go! */
        this.setup();
        setInterval(this._update.bind(this), this.updateInterval);
        this._render();
        
    }
	
	/* Draw FPS. */
	this.display = function() {
		var fps = this.renderTimes.map(function(x) { return 1000/x; }).reduce(function(a, b) { return a+b; }, 0) / this.renderTimes.length;
		this.context.textAlign = "left";
		this.context.textBaseline = "hanging";
		this.context.fillText(Math.round(fps) + " fps", 10, 10);
	}
    
}