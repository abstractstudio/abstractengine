goog.require("engine.Vector2D");
goog.provide("engine.Transform2D");
goog.provide("engine.BoxCollider2D");
goog.provide("engine.CircleCollider2D");
goog.provide("engine.Entity2D");
goog.provide("engine.EntityManager");

class Transform2D { 
    
    constructor(pos, rot, scl) {
        this.position = pos || new Vector2D();
        this.rotation = rot || 0; // Radians
        this.scale = scl || new Vector2D();
    }
    
    get x() { return this.position.x; }
    set x(v) { return this.position.x = v; }
    get y() { return this.position.y; }
    set y(v) { return this.position.y = v; }
    
    get r() { return this.rotation; }
    set r(v) { return this.rotation = v; }
    
    get s() { return this.scale; }
    set s(v) { return this.scale = v; }
    
}

class BoxCollider2D {
    
    constructor(transform, w, h) {
        this.transform = transform || new Transform2D();
        this.width = w || 0;
        this.height = h || 0;
        
        this.attributeChanged = false;
        this._resetVertices();
    }
    
    get transform() { return this._transform; }
    set transform(t) { this._transform = t; this.attributeChanged = true; }

    get width() { return this._width; }
    set width(w) { this._width = w; this.attributeChanged = true; }
    
    get height() { return this._height; }
    set height(h) { this._height = h; this.attributeChanged = true; }
    
    _resetVertices() {
        this._vertices = [this.transform.position.copy().add(new Vector2D(-this.width/2, this.height/2).rotated(this.transform.r)), 
                         this.transform.position.copy().add(new Vector2D(this.width/2, this.height/2).rotated(this.transform.r)), 
                         this.transform.position.copy().add(new Vector2D(this.width/2, -this.height/2).rotated(this.transform.r)), 
                         this.transform.position.copy().add(new Vector2D(-this.width/2, -this.height/2).rotated(this.transform.r))];
    }
    
    collides(collider) {
        // Recalculate vertices if an attribute has changed
        if (this.attributeChanged) {
            this._resetVertices();
            this.attributeChanged = false;
        }
        
        if (collider instanceof CircleCollider2D) {
            /*var maxDist = Number.NEGATIVE_INFINITY; // Max distance from the box center to a box side
            var axis = collider.transform.position.copy().sub(this.transform.position); // Axis along line from center to center
            var totalDistance = axis.magnitude(); // Distance between box center and circle center
            axis.normalize(); // Normalize so that projection can be computed with dot product

            for (var i = 0; i < this.vertices.length; i++) {
                maxDist = Math.max(maxDist, this.vertices[i].copy().sub(this.transform.position).dot(axis)); // Find distance to side and take max
            }
            
            return totalDistance - maxDist*0 - collider.radius <= 0 || totalDistance == 0;*/
            
            var circleCenterRotated = collider.transform.position.copy().sub(this.transform.position).rotated(-this.transform.r);
            var closestPoint = new Vector2D(Math.min(this.width/2, Math.max(-this.width/2, circleCenterRotated.x)), 
                                             Math.min(this.height/2, Math.max(-this.height/2, circleCenterRotated.y)));
            var distance = Vector2D.distance(circleCenterRotated, closestPoint);

            return distance < collider.radius;
        } else if (collider instanceof BoxCollider2D) {
            return false; // TODO
        }
        
        return false;
    }
    
}

class CircleCollider2D {
    
    contructor(transform, r) {
        this.transform = transform || new Transform2D();
        this.radius = r || 0;
    }
    
    collides(collider) {
        if (collider instanceof CircleCollider2D) {
            return Vector2D.distance(this.transform.position, collider.transform.position) < this.radius + collider.radius;
        } else if (collider instanceof BoxCollider2D) {
            return collider.collides(this);
        }
        
        return false;
    }
    
}

class Entity2D {
    
    constructor() {
        this.transform = new Transform2D();
        this.renderables = {};
        this.renderable = null;
        this.collider = null;
    }
    
    setRenderable(name) {
        this.renderable = this.renderables[name];
    }
    
}

class EntityManager {
    
    constructor(engine) {
        this.engine = engine;
        this.engine.managers.entities = this;
        this.entities = {};
    }
    
    add(name, entity) {
        this.entities[name] = entity;
    }
    
    get(name) {
        return this.entities[name];
    }
    
}
