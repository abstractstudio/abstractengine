var asEventManager = (function() {
    
    eventListeners = {};
    
    addEventListener = function(type, listener) {
        if (this.eventListeners[type] === undefined) this.eventListeners[type] = [];
        this.eventListeners[type].push(listener);
    }
    
    removeEventListener = function(type, listener) {
        this.eventListeners[type].pop(this.eventListeners[type].indexOf(listener));
    }
    
    raiseEvent = function(type, event) {
        var eventListeners;
        if ((eventListeners = this.eventListeners[type]) !== undefined)
            eventListeners.map(function(e) { e(event); });
    }

    return function() {
        this.eventListeners = eventListeners;
        this.addEventListener = addEventListener;
        this.removeEventListener = removeEventListener;
        this.raiseEvent = raiseEvent;
        return this;
    };

})();
