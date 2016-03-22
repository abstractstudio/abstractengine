function Sprite(x, y) {
	/** Position. */
    Vector pos = new Vector(x, y);
    
    /** Size. */
    var width;
    var height;
    
    /** Physics. */
    Vector velocity = new Vector(0, 0);
    Vector acceleration = new Vector(0, 0);
    
    /** Moves sprite by the specified amount in each direction. */
	function translate(dx, dy) {
		this.pos.x += dx;
		this.pos.y += dy;
	}
	
	/** Returns whether this sprite touches another one. */
	function touches(sprite) {
		return !(this.pos.x + this.width < sprite.pos.x || this.pos.x > sprite.pos.x + sprite.width || this.pos.y + this.height < sprite.pos.y || this.pos.y > sprite.pos.y + sprite.height);
	}
	
	/** Default update method. Moves the object based on acceleration and velocity. */
	function update(delta) {
		
	}
	
	function render(context) {
		
	}
}