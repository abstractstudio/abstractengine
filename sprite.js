/* Main sprite. */
function Sprite(x, y, w, h, rx, ry) {

    /* Position (center). */
    this.pos = new Vector(x || 0, y || 0);
    
    /* Rotation about the center. */
    this.rotation = 0;
    this.rpos = new Vector(rx || w/2 || 0, ry || h/2 || 0);
    
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
        this.pos.x += dx;
        this.pos.y += dy;
    }
    
    /* Bounding box. */
    this.bbox = function() {
        var leftX = this.pos.x - this.width/2;
        var topY = this.pos.y - this.height/2;
        var box = [leftX * Math.cos(this.rotation) - topY * Math.sin(this.rotation), 
                    leftX * Math.sin(this.rotation) + topY * Math.cos(this.rotation), this.width, this.height];
    }
    
    /* Returns whether this sprite touches another one. */
    this.touches = function(sprite) {
        return !(this.pos.x + this.width < sprite.pos.x || 
                 this.pos.x > sprite.pos.x + sprite.width || 
                 this.pos.y + this.height < sprite.pos.y || 
                 this.pos.y > sprite.pos.y + sprite.height);
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
            
            context.save();
            context.translate(this.pos.x, this.pos.y);
            context.rotate(-this.rotation);
            context.translate(-this.pos.x, -this.pos.y);
            
			if (this.currentAnimation in this.animations) { // There's an animation
			
                var f = this.animations[this.currentAnimation].getCurrentFrame();
				
				// Get the subimage information
				var subWidth = this.spriteImage.width / this.numColumns;
				var subHeight = this.spriteImage.height / this.numRows;
				var subX = (f % this.numColumns) * subWidth;
				var subY = ((f / this.numRows) || 0) * subHeight;
				
				// Draw the subimage
				context.drawImage(this.spriteImage, subX, subY, subWidth, subHeight, 
                                  this.pos.x-this.rpos.x, this.pos.y-this.rpos.y, this.width, this.height);
                
			} else { // Image but no animation
				context.drawImage(this.spriteImage, 0, 0, this.spriteImage.width, this.spriteImage.height, 
                                  this.pos.x-this.rpos.x, this.pos.y-this.rpos.y, this.width, this.height);
			}
            
            context.restore();
		}
    }
}
