goog.require("engine.EventManager");
goog.provide("engine.State");

class State extends EventManager {
    
    constructor(name) {
        super();
        this.name = name;
    }
    
    start() {}
    update(delta) {}
    render(context, canvas) {}
    stop() {}
    
}
