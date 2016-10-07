goog.require("engine.EventManager");
goog.require("engine.AssetManager");
goog.require("engine.InputManager");
//goog.require("abstract.scripting.ScriptManager");
//goog.require("engine.EntityManager");
goog.provide("engine.Engine");

class EngineFramework extends EventManager {
    
    constructor(canvas) {
        super();
        this.canvas = canvas;
    }
    
}

class EngineMachine extends EngineFramework {
    
    constructor(canvas) {
        super(canvas);
        this.state = null;
        this.states = {};
    }
    
    connect(from, to, transition) {}
    
}

class Engine extends EngineFramework {
    
    constructor(canvas) {
        super(canvas);
        this.assets = new AssetManager(this);
        this.input = new InputManager(this);
        //this.scripting = new ScriptManager(this);
        //this.entities = new EntityManager(this);
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
    
    main() {
    
    }
    
}
