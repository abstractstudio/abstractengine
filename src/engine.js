goog.require("engine.EventInterface");
goog.require("engine.AssetManager");
goog.require("engine.InputManager");
goog.require("engine.InterfaceManager");
goog.require("engine.EntityManager");
//goog.require("engine.ScriptManager");
goog.provide("engine.Engine");
goog.provide("engine.Engine2D");


class Engine extends EventInterface {
    
    constructor(canvas) {
        super();
        this.canvas = canvas;
        this.context = null;
        this.managers = {};
        this.game = null;
        this.assets = new AssetManager(this);
        this.input = new InputManager(this);
        this.entities = new EntityManager(this);
        this.states = new StateManager(this);
        this.updateLimit = 60;
        this.updateInterval = 1000 / this.updateLimit;
        this.updateTime = 0;
        this.renderTime = 0;
        this.renderTrackingCount = 20;
        this.renderTrackingIndex = 0;
        this.renderHistory = new Array(this.renderTrackingCount);
    }
    
    _setup() {
        console.log("Running setup.")
        this.setup();
        this.assets.load(this._load.bind(this));
    }
    
    _load() {
        console.log("Loading the engine.");
        this.load();
        this._start();
    }
    
    _start() {
        console.log("Starting the engine.");
        this.updateTime = Date.now();
        this.renderTime = Date.now();
        setInterval(() => this._update(), this.updateInterval);
        this._render();
    }
    
    _update() {
        var delta = Date.now() - this.updateTime;
        this.updateTime = Date.now();
        this.update(delta);
        this.input.update(delta);
    }
    
    setup() {}
    load() {}
    update(delta) {}
    
    main() { this._setup(); }
    
    fps() {
        return this.renderHistory
            .map(function(x) { return 1000/x; })
            .reduce(function(a, b) { return a+b; }, 0) 
            / this.renderTrackingCount
    }
    
}


class Engine2D extends Engine {
    
    constructor(canvas) {
        super(canvas);
        this.context = canvas.getContext("2d");
        this.context.imageSmoothingEnabled = false;
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
    
    render(canvas, context) {}
    
}
