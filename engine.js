/* Determine the graphics request call. */
requestAnimationFrame = (window.requestAnimationFrame ||
                         window.webkitRequestAnimationFrame ||
                         window.msRequestAnimationFrame ||
                         window.mozRequestAnimationFrame ||
                         window.oRequestAnimationFrame);
                         
/* Key states. */
var KEY_PRESSED = 1;
var KEY_DOWN = 2;

/* Prevent default actions. By default, stops the arrow keys from moving window. */
var PREVENT_DEFAULT = [37, 39, 38, 40]

/* Example resource map. */
// var LOAD = {"name": "path/to/resource"};

/* The main engine class. */
function Engine(canvas) {
    
    /* Graphical components. */
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    
    /* Input. */
    this.keys = {};
    
    /* Resources and sprites. */
    this.resources = {};
    this.sprites = [];
    
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
            if (this.keys[e.keyCode] == KEY_PRESSED) this.keys[e.keyCode] = KEY_DOWN;
            else this.keys[e.keyCode] = KEY_PRESSED;
            
            /* Prevent default actions. */
            if (PREVENT_DEFAULT.indexOf(e.keyCode) > -1) e.preventDefault();
            
        });
        
        /* Keyup listener. */
        document.addEventListener("keyup", function(e) {
        
            /* Remove the key from the object. */
            delete this.keys[e.keyCode];
        
        });
        
        /* Style the canvas. */
        this.context.font = "20px Verdana";

    }
    
    /* Load resources. */
    this.load = function(map) {
        
        /* Load each resource. */
        for (var name in map) {
        
        	/* Set the value in the resource map. */
        	this.resources[key] = false;
        	
        	/* Create the image. */
        	var image = new Image();
        	image.name = name;
        	image.engine = this;
        	image.onload = function() { this.engine.resources[this.name] = this; }
			image.src = map[name];
			
        }
        
    }
    
    /* Update the engine and components. */
    this.update = function(delta) {

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
        this.load();
        this.setup();
        setInterval(this._update.bind(this), this.updateInterval);
        this._render();
        
    }
    
}