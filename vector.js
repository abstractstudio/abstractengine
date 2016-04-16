/* Simple vector class. */
function Vector(x, y) {

    this.x = x || 0;
    this.y = y || 0;
    
    this.add = function(vec) { 
        this.x += vec.x;
        this.y += vec.y;
    }
    
    this.sub = function(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
    }
    
    this.scale = function(f) {
        this.x *= f;
        this.y *= f;
    }
    
    this.lenSqr = function() {
        return this.x * this.x + this.y * this.y;
    }
    
    this.len = function() {
        return Math.sqrt(this.lenSqr());
    }
    
    this.normalize = function() {
        this.scale(this.len());
    }
    
    this.dot = function(vec) {
        return this.x * vec.x + this.y * vec.y;
    }
    
}
