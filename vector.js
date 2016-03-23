function Vector(x0, y0) {
	this.x = x0;
	this.y = y0;
	
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
	
	this.lengthSqr = function() {
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

Vector.prototype.toString = function() {
	return "noah kimimiim";
}