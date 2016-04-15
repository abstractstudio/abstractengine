/* Main sprite. */
function Sprite(x, y) {

    /* Position. */
    this.position = new Vector(x || 0, y || 0);
    
    /* Size. */
    this.width;
    this.height;
    
    /* Physics. */
    this.velocity = new Vector(0, 0);
    this.acceleration = new Vector(0, 0);
    
    /* Graphics. */
    this.image;
    
    /* Animation. */
    this.frameWidth;
    this.frameHeight;
    
    /* Moves sprite by the specified amount in each direction. */
    this.translate = function(dx, dy) {
        this.position.x += dx;
        this.position.y += dy;
    }
    
    /* Bounding box. */
    this.bbox = function() {
        return [this.position.x, this.position.y, this.width, this.height];
    }
    
    /* Returns whether this sprite touches another one. */
    this.touches = function(sprite) {
        return !(this.position.x + this.width < sprite.position.x || 
                 this.position.x > sprite.position.x + sprite.width || 
                 this.position.y + this.height < sprite.position.y || 
                 this.position.y > sprite.position.y + sprite.height);
    }
    
      
    /* Default update method. Moves the object based on acceleration and velocity. */
    this.update = function(delta) {

    }
    
    /* Render the sprite. */
    this.render = function(context) {
        if (this.frameWidth == 0 && this.frameHeight == 0) { // No animation
        	context.drawImage(this.image, 0, 0, this.width, this.height, 
        		this.position.x, this.position.y, this.width, this.height);
        } else { // There's an animation
        
        }
    }
    
}