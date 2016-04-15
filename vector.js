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
    
    this.lengthSquare = function() {
        return this.x * this.x + this.y * this.y;
    }
    
    this.length = function() {
        return Math.sqrt(lengthSqr());
    }
    
    this.normalize = function() {
        scale(this.length());
    }
    
    this.dot = function(vec) {
        return this.x * vec.x + this.y * vec.y;
    }
    
}
