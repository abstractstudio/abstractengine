/** An animation for a sprite. */
function Animation(name, frames) {
    
    /* Main information. */
    this.name = name || "";
    this.playing = false;
    this.loop = true;
    
    /* Frame specific. */
    this.index = 0;
    this.indices = frames || [];
    this.speed = 0.02;
    this.start = 0;
    
    /** Starts this animation from the beginning. */
    this.play = function() {
        this.index = 0;
        this.start = Date.now();
        this.playing = true;
    }
    
    /** Gets the index of the current animation frame in the spritesheet. */
    this.frame = function() {
        return this.indices[this.index];
    }
    
    /** Moves the animation forward. */
    this.update = function() {
        
        /* Only change if playing. */
        if (this.playing) {
            
            /* Check if time to update. */
            var now = Date.now();
            if (now - this.start >= this.speed * 1000) {
                
                /* Set start time and increment index. */
                this.start = now;
                this.index++;
                
                /* Loop if should. */
                if (this.index >= this.indices.length) {
                    if (this.loop) this.index = 0;
                    else this.playing = false;
                }
                
            }
            
        }
        
    }
    
    
}