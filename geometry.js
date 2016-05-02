/** Geometry tools and other math functionality. */ 
var geometry = {};

/** Condensed vector class. */
geometry.Vector = function Vector(x, y) {
    
    /** 0th term of the vector. */
    this.x = x || 0;
    
    /** 1st term of the vector. */
    this.y = y || 0;
    
    /** Add a vector. */
    this.add = function(other) { this.x += other.x; this.y += other.y; return this; }
    
    /** Subtract a vector. */
    this.sub = function(other) { this.x -= other.x; this.y -= other.y; return this; }
    
    /** Dot product. */
    this.dot = function(other) { return this.x*other.x + this.y*other.y}
    
    /** Scale the vector by a float. */
    this.scale = function(scalar) { this.x *= scalar; this.y *= scalar; return this; }
    
    /** Determine the magnitude. */
    this.magnitude = this.valueOf = function() { return Math.sqrt(this.dot(this)); }
    
    /** Copy the vector. */
    this.copy = function() { return new geometry.Vector(this.x, this.y); }
    
    /** Represent the vector as a string. */
    this.toString = function() { return "<" + this.x + ", " + this.y + ">"; }
    
}

/** Get the distance between two vectors. */
geometry.Vector.distance = function(a, b) { return Math.sqrt((b.x-a.x)*(b.x-a.x) + (b.y-a.y)*(b.y-a.y)); }
