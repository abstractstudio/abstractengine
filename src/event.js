'use strict';

goog.provide("event.EventManager");

class EventManager {
    
    constructor() {
        this.eventListeners = {};
    }
    
    addEventListener(type, listener) {
        if (this.eventListeners[type] === undefined) this.eventListeners[type] = [];
        this.eventListeners[type].push(listener);
    }
    
    removeEventListener(type, listener) {
        this.eventListeners[type].pop(this.eventListeners[type].indexOf(listener));
    }
    
    fireEvent(type, event) {
        var eventListeners;
        if ((eventListeners = this.eventListeners[type]) !== undefined)
            eventListeners.map(function(e) { e(event); });
    }

}
