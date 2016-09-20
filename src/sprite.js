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
        this._assets = {};
        this._renderable = null;
    
    }
    
    /** Add an asset to a keyword with a second argument. Otherwise get. */
    addAsset(name, asset) { 
        if (typeof(name) == "object" && asset == undefined)
            this._assets[name.name] = name;
        if (typeof(name) == "string" && asset != undefined) 
            return this._assets[name] = asset;
    }
    
    getAsset(name) {
        return this._assets[name];
    }

    /** Set or replace the current renderable. */
    setRenderable(renderable) {
        return this._renderable = renderable;
    }
    
    getRenderable() {
        return this._renderable;
    }
    
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
        var r;
        if (r = this.renderable()) {

            /* Create the clip, center, and draw. */
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