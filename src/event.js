goog.provide("engine.EventInterface");

class EventInterface {
    
    constructor() {
        this.eventListeners = {};
    }
    
    addEventListener(event, listener) {
        if (this.eventListeners[event] === undefined)
            this.eventListeners[event] = [listener];
        else this.eventListeners[event].push(listener);
    }
    
    removeEventListener(event, listener) {
        if (this.eventListeners[event] !== undefined) {
            var i = this.eventListeners[event].indexOf(listener);
            return this.eventListeners[event].splice(i, i+1);
        }
    }
    
    fireEvent(event, data) {
        var eventListeners = this.eventListeners[event];
        if (eventListeners !== undefined)
            eventListeners.map(function(listener) { listener(data); });
    }

}
