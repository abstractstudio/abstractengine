/** General sprite utilities. */
var sprite = {};

/** Transform. */
sprite.Transform = function Transform(x, y, r, v, w) {
    
    /** Basic transform information. */
    this.position = new geometry.Vector(x || 0, y || 0);
    this.rotation = r || 0;
    this.scale = new geometry.Vector(v || 0, w || 0);
    
    /** Combine two transforms. */
    this.with = function(other) {
        return new Transform(this.x + other.x, this.y + other.y, this.r + other.r, this.v * other.v, this.w * other.w);
    }
    
}

/** Fancy property methods. */
sprite.Transform.prototype = {
    
    /* Setters and getters for members. V and W are scale. */
    get x() { return this.position.x; },
    set x($) { this.position.x = $; },
    get y() { return this.position.y; },
    set y($) { this.position.y = $; },
    get r() { return this.rotation; },
    set r($) { this.rotation = $; },
    get v() { return this.scale.x; },
    set v($) { this.scale.x = $; },
    get w() { return this.scale.y; },
    set w($) { this.scale.y = $; }
    
}

/** The sprite class. */
sprite.Sprite = function Sprite(x, y, w, h, c, d) {
    
    /** Transform and center. */
    this.transform = new sprite.Transform(x, y);
    this.width = w || 0;
    this.height = h || 0;
    this.center = c && d && new geometry.Vector(c, d);  // null if c or d are not defined
    
    /** Bounding box. */
    this.bbox = geometry.bbox;
    
    /** Update the sprite. */
    this.update = function(delta) {}
    
<<<<<<< HEAD
    /* Render the sprite. */
    this.render = function(context) {
        
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
=======
    /** Render the sprite. */
    this.render = function(context) {}

}
>>>>>>> development
