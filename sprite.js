function Sprite(x, y) {
	/** Position. */
    var xPos = x;
    var yPos = y;
    
    /** Velocity. */
    var xVel = 0;
    var yVel = 0;
    
    /** Acceleration. */
    var xAcc = 0;
    var yAcc = 0;
    
    /** Size. */
    var width;
    var height;
    
    /** Moves sprite by the specified amount in each direction. */
	function translate(dx, dy) {
		this.posX += dx;
		this.posY += dy;
	}
	
	/** Returns whether this sprite touches another one. */
	function touches(sprite) {
		
	}
	
	/** Default update method. Moves the object based on acceleration and velocity. */
	function update() {
		this.xVel += xAcc;
		this.yVel += yAcc;
		this.xPos += xVel;
		this.yPos += yVel;
	}
}