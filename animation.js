/* An animation for a sprite. */
function Animation(n, frames) {
    /** The name of this animation (for reference). */
    this.name = n || "";
    /** Whether the aimation is playing. */
    this.playing = false;
    /** Whether the animation loops back and replays when it finishes. */
    this.loop = true;
    
    /** The order of frames in this animation, specifed by index of the image in the spritesheet. */
	this.frameIndices = frames || [];
	/** The number of seconds that each frame lasts */
	this.speed = 0.02;
	
	/** The current animation frame. */
	this.frameIndex = 0;
	/** The time that the current frame started. */
	this.frameStartTime = 0;
	
	this.getCurrentFrame = function() {
	    return this.frameIndices[this.frameIndex];
	}
	
	this.update = function() {
	    if (this.playing) {
    	    var now = Date.now();
    	    if (now - this.frameStartTime >= this.speed * 1000) { // if the animation should be advanced
    	        this.frameStartTime = now;
    	        this.frameIndex++;
    	        
    	        if (this.frameIndex >= this.frameIndices.length) { // if we reached the end of the animation
    	            if (this.loop) this.frameIndex = 0;
    	            else this.playing = false;
    	        }
    	    }
	    }
	}
	
	
}