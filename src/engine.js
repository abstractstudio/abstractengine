goog.require("engine.EventManager");
goog.require("engine.AssetManager");
goog.require("engine.InputManager");
//goog.require("engine.ScriptManager");
//goog.require("engine.EntityManager");
goog.provide("engine.Engine");

class EngineFramework extends EventManager {
    
    constructor(canvas) {
        super();
        this.canvas = canvas;
        this.updateLimit = 60;
        this.updateInterval = 1000 / this.updateLimit;
        this.updateTime = 0;
        this.renderTime = 0;
        this.renderTrackingCount = 20;
        this.renderTrackingIndex = 0;
        this.renderHistory = new Array(this.renderTrackingCount);
        this._setup();
    }
    
    _setup() {
        console.log("Running setup.")
        this.setup();
    }
    
    _load() {
        console.log("Loading the engine.");
        this.load();
        this._start();
    }
    
    _start() {
        console.log("Starting the engine.");
        setInterval(() => this._update(), this.updateInterval);
        this._render();
    }
    
    _update() {   
        var delta = Date.now() - this.updateTime;
        this.updateTime = Date.now();
        this.update(delta);
    }
    
    _render() {
        requestAnimationFrame(this._render.bind(this));
        var delta = Date.now() - this.renderTime;
        this.renderTime = Date.now();
        this.render(this.context, this.canvas);
        this.renderHistory[this.renderTrackingIndex] = delta;
        this.renderTrackingIndex++;
        if (this.renderTrackingIndex == this.renderTrackingCount) 
            this.renderTrackingIndex = 0;
    }
    
    setup() {}
    load() {}
    start() {}
    update() {}
    render() {}

    main() { this._setup(); }
    
    fps() {
        return this.renderHistory
            .map(function(x) { return 1000/x; })
            .reduce(function(a, b) { return a+b; }, 0) 
            / this.renderTrackingCount
    }
    
}

class Engine extends EngineFramework {
    
    constructor(canvas) {
        super(canvas);
        this.assets = new AssetManager(this);
        this.input = new InputManager(this);
        this.states = new StateManager(this);
        this.managers = {
            assets: this.assets,
            input: this.inputs,
            states: this.states,
            //scripting: this.scripting = new ScriptManager(this),
            //entities: this.entities = new EntityManager(this),
        }
        this.game = null;
    }
    
    _setup() {
        // TODO: super.setup()
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
    
    main() {
    
    }
    
}
