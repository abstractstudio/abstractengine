requestAnimationFrame = (w.requestAnimationFrame ||
                         w.webkitRequestAnimationFrame ||
                         w.msRequestAnimationFrame ||
                         w.mozRequestAnimationFrame);

function Engine(canvas) {
    
    /* Graphical components. */
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    
    /* Input. */
    this.keys = {};
    
    /* Resources and sprites. */
    this.resources = {};
    this.sprites = {};
    
    /* Timing. */
    this.time = Date.now();

    /* Engine monitor. */
    this.fpsLimit = 100;
    this.fpsInterval = 1000 / this.fpsLimit;
    this.fpsFrames = 0;
    this.fpsSeconds = 0;
    
    /* Set up the engine and its components. */
    this.setup = function() {
        
        
        
    }
    
    /* Load resources. */
    this.load = function() {
        
        
        
    }
    
    /* Update the engine and components. */
    this.update = function(delta) {
        
        
        
    }
    
    
    /* Render the canvas. */
    this.render = function() {
        
        
        
    }
    
    /* Start the engine. */
    this.start = function() {
        
        
        
    }
    
    
}