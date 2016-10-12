goog.require("engine.EventInterface");
goog.provide("engine.InterfaceManager");

class InterfaceManager extends EventInterface {
    
    constructor(engine) {
        super();
        this.engine = engine;
        this.engine.managers.interface = this;
        this.fullscreenEnabled = false;
        this.fullpageEnabled = false;
    }

    enableFullscreen() {}
    
    disableFullscreen() {}
    
    enableFullpage() {}
    
    disableFullpage() {}

    _onResize() {}
    
}
