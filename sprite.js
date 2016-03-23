function Sprite(x, y) {
	/** Position. */
    this.pos = new Vector(x, y);
    
    /** Size. */
    this.width;
    this.height;
    
    /** Physics. */
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);
    
    /** Moves sprite by the specified amount in each direction. */
	this.translate = function(dx, dy) {
		this.pos.x += dx;
		this.pos.y += dy;
	}
	
	this.bbox = function() {
		return [this.pos.x, this.pos.y, this.width, this.height];
	}
	
	/** Returns whether this sprite touches another one. */
	this.touches = function(sprite) {
		return !(this.pos.x + this.width < sprite.pos.x || this.pos.x > sprite.pos.x + sprite.width || this.pos.y + this.height < sprite.pos.y || this.pos.y > sprite.pos.y + sprite.height);
	}
	
	/** Default update method. Moves the object based on acceleration and velocity. */
	this.update = function(delta) {
		//console.log(this.pos.toString());
	}
	
	this.render = function(context) {
		
	}
}