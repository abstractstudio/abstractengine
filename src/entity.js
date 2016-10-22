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
    
    constructor (w, h) {
        this.width = w || 0;
        this.height = h || 0;
        this.transform = new Transform2D();
    }
    
}

class CircleCollider2D {
    
    contructor(r) {
        this.radius = r || 0;
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
