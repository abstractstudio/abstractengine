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
    this.animations = [];
    this.currentAnimation = -1;
    this.numRows;
    this.numColumns;
    
    /** Adds an animation. */
    this.addAnimation = function(anim) {
        this.animations.push(anim);
    }
    
    /** Sets the spritesheet properties. */
    this.setSpriteSheetSize = function(numR, numC) {
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
        if (this.currentAnimation >= 0 && this.currentAnimation < this.animations.length) {
            this.animations[this.currentAnimation].update();
        }
    }
    
    /* Render the sprite. */
    this.render = function(context) {
        if (this.currentAnimation >= 0 && this.currentAnimation < this.animations.length) { // There's an animation
            var frame = this.animations[this.currentAnimation].getCurrentFrame();
            console.log(frame + " " + this.animations[this.currentAnimation].frameIndex);
            
            // Get the subimage information
            var subWidth = this.image.width / this.numColumns;
            var subHeight = this.image.height / this.numRows;
            var subX = (frame % this.numColumns) * subWidth;
            var subY = (frame / this.numRows) * subHeight;
            
            // Draw the subimage
            context.drawImage(this.image, subX, subY, subWidth, subHeight, 
                this.position.x, this.position.y, this.width, this.height);
        } else if (this.image != null) { // Image but no animation
           context.drawImage(this.image, 0, 0, this.image.width, this.image.height, 
        		this.position.x, this.position.y, this.width, this.height);
        }
    }
    
}