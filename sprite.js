/* Main sprite. */
function Sprite(x, y, w, h, rx, ry) {

    /* Position (center). */
    this.position = new Vector(x || 0, y || 0);
    
    /* Rotation about the center. */
    this.rotation = 0;
    this.rposition = new Vector(rx || w/2 || 0, ry || h/2 || 0);
    
    /* Size. */
    this.width = w || 0;
    this.height = h || 0;
    
    /* Graphics. */
    this.spriteImage;
    
    /* Animations. */
    this.animations = {};
    this.currentAnimation = "";
    this.numRows;
    this.numColumns;
    
    /* Adds an animation. */
    this.addAnimation = function(anim) {
        this.animations[anim.name] = anim;
    }
	
	/* Gets the current animation. */
	this.getCurrentAnimation = function() {
		return this.animations[this.currentAnimation];
	}
    
    /* Sets the spritesheet properties. */
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
        var leftX = this.position.x - this.width/2;
        var topY = this.position.y - this.height/2;
        var box = [leftX * Math.cos(this.rotation) - topY * Math.sin(this.rotation), 
                    leftX * Math.sin(this.rotation) + topY * Math.cos(this.rotation), this.width, this.height];
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
        if (this.currentAnimation in this.animations) {
            this.animations[this.currentAnimation].update();
        }
    }
    
    /* Render the sprite. */
    this.render = function(context) {
		if (this.spriteImage != null) {
            
            context.translate(this.position.x+this.rposition.x, this.postition.y+this.position.y);
            context.rotate(this.rotation);
            context.translate(-this.position.x-this.rposition.x, -this.position.y-this.rposition.y);
            
			if (this.currentAnimation in this.animations) { // There's an animation
				var f = this.animations[this.currentAnimation].getCurrentFrame();
				
				// Get the subimage information
				var subWidth = this.spriteImage.width / this.numColumns;
				var subHeight = this.spriteImage.height / this.numRows;
				var subX = (f % this.numColumns) * subWidth;
				var subY = ((f / this.numRows) | 0) * subHeight;
				
				// Draw the subimage
				context.drawImage(this.spriteImage, subX, subY, subWidth, subHeight, this.position.x, this.position.y, this.width, this.height);
			} else { // Image but no animation
				context.drawImage(this.spriteImage, 0, 0, this.spriteImage.width, this.spriteImage.height, this.position.x, this.position.y, this.width, this.height);
			}
            
            context.restore();
		}
    }
}
