function Vector(x0, y0) {
	var x = x0;
	var y = y0;
	
	function add(vec) { 
		this.x += vec.x;
		this.y += vec.y;
	}
	
	function sub(vec) {
		this.x -= vec.x;
		this.y -= vec.y;
	}
	
	function scale(f) {
		this.x *= f;
		this.y *= f;
	}
	
	function lengthSqr() {
		return this.x * this.x + this.y * this.y;
	}
	
	function length() {
		return Math.sqrt(lengthSqr());
	}
	
	function normalize() {
		scale(this.length());
	}
	
	function dot(vec) {
		return this.x * vec.x + this.y * vec.y;
	}
}