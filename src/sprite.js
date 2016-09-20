goog.require("engine.Asset");
goog.require("engine.Animation");
goog.require("engine.Vector");
goog.provide("engine.Sprite");

/* Main sprite. */
class Sprite {
    
    constructor(engine, x, y, w, h, cx, cy) {
        
        /* Engine. */
        this.engine = engine;

        /* Position, center, rotation, dimensions. */
        this.pos = new Vector(x || 0, y || 0);
        this.center = new Vector(cx || w/2 || 0, cy || h/2 || 0);
        this.rot = 0;
        this.width = w || 0;
        this.height = h || 0;

        /* Animations. */
        this.assets = {};
        this.renderable = null;
    
    }
    
    /** Adds, checks, and gets animations. */
    addAsset(asset) { this.assets[name || asset.name] = asset; }
    hasRenderable() { return this.renderable != null; }
    setRenderable(name) { this.renderable = this.assets[name].renderable && this.assets[name] || null; }
    
    /** Moves sprite by the specified amount in each direction. */
    translate(dx, dy) { this.pos.x += dx; this.pos.y += dy; }
    
    /** Bounding box (not implemented). */
    bbox() {}
    
    /** Returns whether this sprite touches another one. (not implemented) */
    touches(sprite) {}

    /** Default update method. */
    update(delta) {}
    
    /* Render the sprite. */
    render(context) {
        
        /* Save and transform the canvas. */
        context.save();
        context.translate(this.pos.x, this.pos.y);
        context.rotate(-this.rot);
        context.translate(-this.pos.x, -this.pos.y);

        /* If there is an active animation. */
        if (this.hasRenderable()) {

            /* Create the clip, center, and draw. */
            var r = this.renderable;
            var c = this.pos;

            if (r.type == "image") 
                context.drawImage(r, c.x, c.y, this.width, this.height);
            else if (r.type == "animation")
                context.drawAnimation(r, c.x, c.y, this.width, this.height);

        }

        /* Restore the context. */
        context.restore();

    }
    
}