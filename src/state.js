goog.require("abstract.event.EventManager");
goog.provide("abstract.state.State");

class State extends EventManager {
    
    constructor(name) {
        this.name = name;
    }
    
    update(delta) {}
    render(context, canvas) {}
    
}
