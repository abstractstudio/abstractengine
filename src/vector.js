goog.provide("engine.Vector2D");

/** Simple vector class. */
class Vector2D {
    
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    
    add(vec) { this.x += vec.x; this.y += vec.y; return this; }
    sub(vec) { this.x -= vec.x; this.y -= vec.y; return this; }
    
    dot(vec) { return this.x * vec.x + this.y * vec.y; }
    dotdot() { return this.dot(this); }
    
    magnitude() { return Math.sqrt(this.dotdot()); }
    
    rotate(theta) { 
        var x = this.x * Math.cos(theta) - this.y * Math.sin(theta);
        this.y = this.x * Math.sin(theta) + this.y * Math.cos(theta);
        this.x = x;
        return this;
    }
    rotated(theta) {
        return new Vector2D(this.x * Math.cos(theta) - this.y * Math.sin(theta), 
                            this.x * Math.sin(theta) + this.y * Math.cos(theta));
    }
    
    scale(f) { this.x *= f; this.y *= f; return this; }
    scaled(f) { return new Vector2D(this.x * f, this.y * f); }
    
    normalize() { return this.scale(1/this.magnitude()); }
    normalized() { return this.scaled(1/this.magnitude()); }
    
    copy() {
        return new Vector2D(this.x, this.y);
    }
    
    equals(vec) {
        return this.x === vec.x && this.y === vec.y;
    }
    
    toString() {
        return '(' + this.x + "," + this.y + ")";
    }
    
    /** Get the distance between two vectors as coordinates. */
    static distance(a, b) {
        return Math.sqrt((b.x-a.x)*(b.x-a.x) + (b.y-a.y)*(b.y-a.y));
    }
    
}