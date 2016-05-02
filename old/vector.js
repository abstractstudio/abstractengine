/** Simple vector class. */
function Vector(x, y) {

    this.x = x || 0;
    this.y = y || 0;
    
    this.add = function(vec) { 
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }
    
    this.sub = function(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    }
    
    this.scale = function(f) {
        this.x *= f;
        this.y *= f;
        return this;
    }
    
    this.dotdot = function() {
        return this.dot(this);
    }
    
    this.magnitude = function() {
        return Math.sqrt(this.dotdot());
    }
    
    this.normalize = function() {
        this.scale(1/this.magnitude());
        return this;
    }
    
    this.dot = function(vec) {
        return this.x * vec.x + this.y * vec.y;
    }
    
    this.copy = function() {
        return new Vector(this.x, this.y);
    }
    
}

/** Get the distance between two vectors as coordinates. */
Vector.distance = function(a, b) { 
    return Math.sqrt((b.x-a.x)*(b.x-a.x) + (b.y-a.y)*(b.y-a.y)); 
}
