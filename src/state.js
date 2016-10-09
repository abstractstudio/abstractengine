goog.require("engine.EventManager");
goog.provide("engine.State");

class State extends EventManager {
    
    constructor(engine) {
        super();
        this.engine = engine;
        this.game = engine.game;
        for (manager in this.engine.managers) 
            this[manager] = this.engine.managers[manager];
        this.transitions = {};
    }
    
    start() {}
    update(delta) {}
    render(context, canvas) {}
    stop() {}
    
}

class Transition extends EventManager {
    
    constructor(engine, game) {
        super();
        this.engine = engine;
        this.game = game;
    }
    
}

class StateManager extends EventManager {
    
    constructor(engine) {
        super();
        this.engine = engine;
        this.states = {};
        this.engine.state = null;
    }
    
    add(name, State) {
        this.states[name] = new State(this.engine, this.engine.game);
    }
    
    link(from, to, Transition) {
        this.states[from].transitions[to] = new Transition(this.engine, this.engine.game);
    }
    
    goto(name) {
        if (!this.states.hasOwnProperty(name)) {
            console.warn("State '" + name + "' does not exist.");
            return;
        } 
        var transition = this.engine.state.transitions[name];
        if (transition !== undefined) {
            console.warn("Current state is not linked to state '" + name + "'.");
            return;
        }
    }
    
}
