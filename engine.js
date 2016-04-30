/* Determine the graphics request call. */
requestAnimationFrame = (window.requestAnimationFrame ||
                         window.webkitRequestAnimationFrame ||
                         window.msRequestAnimationFrame ||
                         window.mozRequestAnimationFrame ||
                         window.oRequestAnimationFrame);
                         
/* Key states. */
var KEY = {
	PRESSED: 1, DOWN: 2,
	W: 87, A: 65, S: 83, D: 68,
	UP: 38, LEFT: 37, DOWN: 40, RIGHT: 39,
	ESCAPE: 27,
};

/* Input. */
var keys = {};
var mouse = {};

/* Prevent default actions. By default, stops the arrow keys from moving window. */
var PREVENT_DEFAULT = [37, 39, 38, 40]

/* Example resource map. */
// var LOAD = {"name": "path/to/resource"};

/* The main engine class. */
function Engine(canvas) {
    
    /* Graphical components. */
    this.canvas = canvas;
    if (canvas) this.context = canvas.getContext("2d");
    
    /* Resources and sprites. */
    this.imagesLoaded = false;
    this.images = {};
	this.soundsLoaded = false;
	this.sounds = {};
	
    this.sprites = {};
    
    /* Engine loops. */
    this.showFPS = false;
    this.updateLimit = 60;
    this.updateInterval = 1000 / this.updateLimit;
    this.updateTime = 0;
    this.renderLimit = 100;
    this.renderInterval = 1000 / this.renderLimit;
    this.renderTime = 0;
            
    /* Set up the engine and its components. */
    this.setup = function() {
        /* Keydown listener. */
        document.addEventListener("keydown", function(e) {
			        
            /* If the key is not in the list, set it to be down, otherwise pressed. */
            if (keys[e.keyCode] == undefined) keys[e.keyCode] = KEY.PRESSED;
            
            /* Prevent default actions. */
            if (PREVENT_DEFAULT.indexOf(e.keyCode) > -1) e.preventDefault();
            
        });
        
        /* Keyup listener. */
        document.addEventListener("keyup", function(e) {
        
            /* Remove the key from the object. */
            delete keys[e.keyCode];
        
        });
        
        /* Mouse position. */
        document.addEventListener("mousemove", function(e) {
            
            /* Get the position */
            mouse.x = event.clientX;
            mouse.y = event.clientY;
            
        });
        
        /* Style the canvas. */
        this.context.font = "20px Verdana";
    }
    
    /* Load images. */
    this.loadImages = function(map) {
        /* Load each resource. */
        for (var name in map) {
        	/* Set the value in the resource map. */
        	this.images[name] = false;
        	
        	/* Create the image. */
        	var image = new Image();
        	image.name = name;
        	image.engine = this;
        	image.onload = function() { 
        		this.engine.images[this.name] = this; 
				if (this.name in this.engine.sprites) this.engine.sprites[this.name].spriteImage = this;
        		for (var name in this.engine.images) if (this.engine.images[name] === false) return;
        		this.engine.imagesLoaded = true;
        	}
        	
        	/* Set image source. */
			image.src = map[name];
			
        }
        
    }
	
	/* Load sounds. */
	this.loadSounds = function(map) {
		for (var name in map) {
        	/* Set the value in the resource map. */
        	this.sounds[name] = false;
        	
        	/* Create the sound. */
        	var sound = new Audio();
			//sound.loop = false;
			sound.name = name;
        	sound.engine = this;
        	sound.canplaythrough = function() { 
        		this.engine.sounds[this.name] = this;
        		for (var name in this.engine.sounds) if (this.engine.sounds[name] === false) return;
        		this.engine.soundsLoaded = true;
        	}
        	
        	/* Set sound source. */
			sound.src = map[name];
			this.sounds[name] = sound;
        }
	}
    
    /* Update the engine and components. */
    this.update = function(delta) {
        /* Update the sprites. */
        for (var name in this.sprites) {
            this.sprites[name].update(delta);
        }
		
		/* Change keys. */
		for (var key in keys) if (keys[key] == KEY.PRESSED) keys[key] = KEY.DOWN;

    }
    
    /* Render the canvas. */
    this.render = function(delta) {
        
        /* Clear the canvas. */
        this.context.fillStyle = "white";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
     
        /* Draw frames per second. */
        if (this.showFPS) {
            this.context.fillStyle = "black";
            this.context.textAlign = "left";
            this.context.textBaseline = "hanging";
            this.context.fillText(Math.round(1000 / delta) + " fps", 10, 8);
        }
		
        /* Draw the sprites. */
        for (var name in this.sprites) {
            this.sprites[name].render(this.context);
        }
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
        }
        
    }
    
    /* Start the engine. */
    this.start = function() {
        
        /* Load, setup and go! */
        this.setup();
        setInterval(this._update.bind(this), this.updateInterval);
        this._render();
        
    }
    
}