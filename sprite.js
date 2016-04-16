/* Main sprite. */
function Sprite(x, y) {

    /* Position. */
    this.position = new Vector(x || 0, y || 0);
    
    /* Size. */
    this.width;
    this.height;
    
    /* Graphics. */
    this.image;
    
    /* Animations. */
    this.animation = [];
    this.currAnim = -1;
    this.numRows;
    this.numColumns;
    
    /** Adds an animation. */
    this.addAnimation = function(anim) {
        this.animation.push(anim);
    }
    
    /** Sets the spritesheet properties. */
    this.setSpriteSheet = function(numR, numC) {
        this.numRows = numR;
        this.numColumns = numC;
    }
    
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
        if (this.animation != null) {
            this.animation.update();
        }
    }
    
    /* Render the sprite. */
    this.render = function(context) {
        if (this.currAnim == -1) { // There's an animation
            var frame = this.animation.getCurrentFrame();
            
            // Get the subimage information
            var subWidth = this.image.width / this.numColumns;
            var subHeight = this.image.height / this.numRows;
            var subX = (frame % this.numColumns) * subWidth;
            var subY = (frame % this.numRows) * subHeight;
            
            // Draw the subimage
            context.drawImage(this.image, subX, subY, subWidth, subHeight, 
                this.position.x, this.position.y, this.width, this.height);
        } else { // No animation
           context.drawImage(this.image, 0, 0, this.image.width, this.image.height, 
        		this.position.x, this.position.y, this.width, this.height);
        }
    }
    
}