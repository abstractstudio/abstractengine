goog.require("abstract.event.EventManager");
goog.require("abstract.asset.AssetManager");
goog.require("abstract.input.InputManager");
goog.require("abstract.scripting.ScriptManager");
goog.require("abstract.entities.EntityManager");

class EngineFramework extends EventManager {
    
    constructor(canvas) {
        super();
        this.canvas = canvas;
    }
    
}

class Engine extends EngineFramework {
    
    constructor(canvas, state) {
        super(canvas);
        this.assets = new AssetManager(this);
        this.input = new InputManager(this);
        this.scripting = new ScriptManager(this);
        this.entities = new EntityManager(this);
        this.state = new State(this);
        this.setup();
    }
    
    setup() {
        
    }
    
    start() {
        
    }
    
    update(delta) {
        this.state.update(delta);
    }
    
    render(context, canvas) {
        
    }
    
    stop() {
        
    }
    
    cleanup() {
        
    }
    
}