goog.require("engine.Asset");
goog.require("engine.Animation");
goog.require("engine.Vector");
goog.provide("engine.Sheet")
goog.provide("engine.Sprite");

/** Sprite sheet. */
class Sheet {
    
    constructor(image, rows, columns) {
        /* Sheet information. */
        this.image = image;
        this.rows = rows || 1;
        this.columns = columns || 1;    
    }
    
    /** Get the current bbox. */
    frame(index) {
        var width = this.image.width / this.columns;
        var height = this.image.height / this.rows;
        var x = (index % this.columns) * width;
        var y = (index / this.columns | 0) * height;
        return [x, y, width, height];
        console.log(x, y);
    }
    
}

/* Main sprite. */
class Sprite {
    
    constructor(engine, x, y, w, h, cx, cy) {
        /* Engine. */
        this.engine = engine;

        /* Position (center). */
        this.pos = new Vector(x || 0, y || 0);
        this.cpos = new Vector(cx || w/2 || 0, cy || h/2 || 0);

        /* Rotation about the center. */
        this.rot = 0;

        /* Size. */
        this.width = w || 0;
        this.height = h || 0;

        /* Graphics. */
        this.sheet;

        /* Animations. */
        this.animations = {};
        this.animation = "";
    }
    
    
    
    /** Adds, checks, and gets animations. */
    addAnimation(animation) { this.animations[animation.name] = animation; }
    hasAnimation() { return this.animation in this.animations; }
    getAnimation() { return this.animations[this.animation]; }
    
    /** Sets the spritesheet properties. */
    setSheet(sheet) { this.sheet = sheet; }
    
    /** Moves sprite by the specified amount in each direction. */
    translate(dx, dy) { this.pos.x += dx; this.pos.y += dy; }
    
    /** Bounding box. (not implemented) */
    bbox() {}
    
    /** Returns whether this sprite touches another one. (not implemented) */
    touches(sprite) {}

	/** Returns the top left point of the sprite. */
	topLeft() { return this.pos.copy().sub(this.cpos) };
	
    /** Default update method. */
    update(delta) {  if (this.hasAnimation()) this.getAnimation().update(); }
    
    /* Render the sprite. */
    render(context) {
        
        /* Check if the sprite has a sheet. */
        if (this.sheet != null) {
            
            /* Save and transform the canvas. */
            context.save();
            context.translate(this.pos.x, this.pos.y);
            context.rotate(-this.rot);
            context.translate(-this.pos.x, -this.pos.y);
            
            /* If there is an active animation. */
            if (this.hasAnimation()) {
                
                /* Create the clip, center, and draw. */
                var box = this.sheet.frame(this.getAnimation().index);
                var c = this.pos.copy().sub(this.cpos);
                context.drawImage(this.sheet.image, box[0], box[1], box[2], box[3], c.x, c.y, this.width, this.height);
                
            /* No animation. */
            } else { 
                
                /* Center and draw. */
                var centered = this.pos.copy().sub(this.cpos);
                context.drawImage(this.sheet.image, 0, 0, this.sheet.image.width, this.sheet.image.height, centered.x, centered.y, this.width, this.height);
                
            }
            
            /* Restore the context. */
            context.restore();
            
        } 
    }
}