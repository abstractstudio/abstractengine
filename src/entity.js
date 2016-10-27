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
    }
    
    get transform() { return this._transform; }
    set transform(t) { 
        this._transform = t;
        this.center = t.position.copy().add(new Vector2D(this._width/2, this._height/2));
        this.vertices = [t.position.copy(), t.position.copy().add(new Vector2D(this._width, 0)), 
                         t.position.copy().add(new Vector2D(0, this._height)), 
                         t.position.copy().add(new Vector2D(this._width, this._height))];
    }
    
    get width() { return this._width; }
    set width(w) {
        this._width = w;
        this.center = t.position.copy().add(new Vector2D(this._width/2, this._height/2));
        this.vertices = [t.position.copy(), t.position.copy().add(new Vector2D(this._width, 0)), 
                         t.position.copy().add(new Vector2D(0, this._height)), 
                         t.position.copy().add(new Vector2D(this._width, this._height))];
    }
    
    get height() { return this._height; }
    set height(h) {
        this._height = h;
        this.center = t.position.copy().add(new Vector2D(this._width/2, this._height/2));
        this.vertices = [t.position.copy(), t.position.copy().add(new Vector2D(this._width, 0)), 
                         t.position.copy().add(new Vector2D(0, this._height)), 
                         t.position.copy().add(new Vector2D(this._width, this._height))];
    }
    
    collides(collider) {
        return this.distance(collider) > 0;
    }
    
    distance(collider) {
        if (collider instanceof CircleCollider2D) {
            if (this.transform.position.equals)
            
            var maxDist = Number.NEGATIVE_INFINITY; // Max distance from the box center to a box side
            var axis = collider.transform.position.copy().sub(this.transform.position); // Axis along line from center to center
            var centerDistance = axis.distance(); // Distance between box and circle center
            axis.normalize();

            for (var i = 0; i < this.vertices.length; i++) {
                maxDist = Math.max(maxDist, this.vertices[i].copy().sub(this.transform.position).dot(axis));
            }
            
            return centerDistance - maxDist - collider.radius;
        } else if (collider instanceof BoxCollider2D) {
            // TODO
        }
    }
    
}

class CircleCollider2D {
    
    contructor(r) {
        this.transform = new Transform2D();
        this.radius = r || 0;
    }
    
    collides(collider) {
        if (collider instanceof CircleColler2D) {
            return Vector.distance(this.transform.position, collider.transform.position) < this.radius + collider.radius;
        } else if (collider instanceof BoxCollider2D) {
            return collider.collides(this);
        }
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
