/* Determine the graphics request call. */
locate("requestAnimationFrame");
                         
/* Key states. */
var KEY = {PRESSED: 1, DOWN: 2, DEFAULT: [37, 39, 38, 40], 
           W: 87, A: 65, S: 83, D: 68, 
           UP: 38, LEFT: 37, DOWN: 40, RIGHT: 39, 
           C: 67,
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
    this.showFPS = true;
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
        
		/* Some static context stuff. */
        this.context.font = "20px Verdana";
		
    }
    
    /* Update the engine and components. */
    this.update = function(delta) {
        
        /* Update the sprites. */
        for (var name in this.entities) {
            if (this.entities[name].autoupdate) this.entities[name].update(delta);
        }
        
        /* Change keys from pressed to down. */
        for (var key in this.keyboard) if (this.keyboard[key] == KEY.PRESSED) this.keyboard[key] = KEY.DOWN;

    }
    
    /* Render the canvas. */
    this.render = function(delta, clear) {
        
        /* Clear the canvas. */
        if (clear !== false) {
            this.context.fillStyle = "white";
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        /* Draw frames per second. */
        if (this.showFPS) {
            var fps = this.renderTimes.map(function(x) { return 1000/x; }).reduce(function(a, b) { return a+b; }, 0) / this.renderTimes.length;
            this.context.fillStyle = "black";
            this.context.textAlign = "left";
            this.context.textBaseline = "hanging";
            this.context.fillText(Math.round(fps) + " fps", 10, 10);
        }
        
        /* Draw the sprites. */
        for (var name in this.entities) {
            if (this.entities[name].autorender) this.entities[name].render(this.context);
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
    
}