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
    
    /* Timing. */
    this.time = Date.now();

    /* Engine monitor. */
    this.fpsLimit = 60;
    this.fpsInterval = 1000 / this.fpsLimit;
    this.fpsVisible = true;
        
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
        	delete keys[e.keyCode];
        
        });
        
        /* Style the canvas. */
        this.context.font = "24px Arial";

    }
    
    /* Load resources. */
    this.load = function() {
        
        
        
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
     	if (this.fpsVisible) {
			this.context.fillStyle = "black";
			this.context.textAlign = "left";
			this.context.baseLine = "top";
			this.context.fillText(Math.round(1000 / delta), 10, 28);
		}
        
    }
    
    /* The main loop inner function of the engine. */
    this.main = function() {
        
        /* Request another frame. */
		requestAnimationFrame(this.main.bind(this));    
    
        /* Record timing. */
        var now = Date.now();
        var delta = now - this.time;
        
		/* Change the time. */
		this.time = Date.now();
        
        /* Allow if past frame limit. */
        if (delta > this.fpsInterval) {
        
        	/* Update and render. */
        	this.update(delta);
        	this.render(delta);
        
        }
    
    }
    
    /* Start the engine. */
    this.start = function() {
        
        this.setup();
        this.main();
        
    }
    
}