/** Object callback management. */
var callback = {};

/** Callback manager. */
callback.Manager = function Manager() {
    
    /** The callback mappings. */
    this.map = {};
    
    /** Register a function to an event. */
    this.register = function(event, hook) {
        if (this.map[event]) this.map[event].push(hook);
        else this.map[event] = [hook];
    }
    
    /** Raise an event. */
    this.raise = this.$ = function(event, data) {
        for (var i in this.map[event]) this.map[event][i](data);
    }
    
}
