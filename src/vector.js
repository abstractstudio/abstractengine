goog.provide("engine.Vector");

/** Simple vector class. */
class Vector {
    
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    
    add(vec) { 
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }
    
    sub(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    }
    
    scale(f) {
        this.x *= f;
        this.y *= f;
        return this;
    }
    
    dotdot() {
        return this.dot(this);
    }
    
    magnitude() {
        return Math.sqrt(this.dotdot());
    }
    
    normalize() {
        this.scale(1/this.magnitude());
        return this;
    }
    
    dot(vec) {
        return this.x * vec.x + this.y * vec.y;
    }
    
    copy() {
        return new Vector(this.x, this.y);
    }
    
    toString() {
        return '(' + this.x + "," + this.y + ")";
    }
    
    /** Get the distance between two vectors as coordinates. */
    static distance(a, b) {
        return Math.sqrt((b.x-a.x)*(b.x-a.x) + (b.y-a.y)*(b.y-a.y));
    }
}