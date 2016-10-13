goog.provide("engine.Transform2D");
goog.provide("engine.Entity2D");

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
        this.currentRenderable = null;
        this.collider = null;
    }
    
    setCurrentRenderable(name) {
        this.currentRenderable = this.renderables[name];
    }
    
    update() {
        
    }
    
    render() {
        if (this.currentRenderable.type == ANIMATION) {
            this.currentRenderable.nextFrame();
            this.currentRenderable.render();
        } else if (this.currentRenderable.type == IMAGE) {
            this.currentRenderable.render();
        }
    }
}

class EntityManager {
    
    constructor() {
        this.entities = {};
    }
    
    update() {
        for (var e in entities) {
            this.entities[e].update();
        }
    }
    
    render() {
        for (var e in entities) {
            this.entities[e].render();
        }
    }
}