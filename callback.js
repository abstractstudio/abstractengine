var asEventManager = (function() {
    
    this.eventListeners = {};
    
    this.addEventListener = function(type, listener) {
        if (this.eventListeners[type] === undefined) this.eventListeners[type] = [];
        this.eventListeners[type].push(listener);
    }
    
    this.removeEventListener = function(type, listener) {
        this.eventListeners[type].pop(this.eventListeners[type].indexOf(listener));
    }

})();
