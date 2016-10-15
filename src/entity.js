goog.provide("engine.Transform2D");
goog.provide("engine.BoxCollider2D");
goog.provide("engine.CircleCollider2D");
goog.provide("engine.Entity2D");
goog.provide("engine.EntityManager");

class Transform2D { 
    constructor() {
        this.position = new Vector2();
        this.rotation = new Vector2(); // TODO make quaternions
        this.scale = new Vector2();
    }
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
    
    update(delta) {
        this.renderable.update(delta);
    }
    
    render(context, canvas) {
        this.renderable.render(context, canvas);
    }
    
}

class EntityManager {
    
    constructor() {
        this.entities = {};
    }
    
    update(delta) {
        for (var e in entities) {
            this.entities[e].update(delta);
        }
    }
    
    render(context, canvas) {
        for (var e in entities) {
            this.entities[e].render(context, canvas);
        }
    }
    
}
