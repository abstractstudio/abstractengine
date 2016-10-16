goog.require("engine.EventInterface");
goog.provide("engine.State");
goog.provide("engine.Transition")

class State extends EventInterface {
    
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
    prerender(context, canvas) {}
    postrender(context, canvas) {}
    stop() {}
    
}

class Transition extends EventInterface {
    
    constructor(engine, game) {
        super();
        this.engine = engine;
        this.game = game;
        for (manager in this.engine.managers) 
            this[manager] = this.engine.managers[manager];
    }
    
    main() {}
    
}

class StateManager extends EventInterface {
    
    constructor(engine) {
        super();
        this.engine = engine;
        this.engine.managers.states = this;
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
		if (this.engine.state !== null) {
			var transition = this.engine.state.transitions[name];
			if (transition === null) {
				console.warn("Current state is not linked to state '" + name + "'.");
				return;
			}
			this.engine.state.stop();
			transition.main();
		}
        this.engine.state = this.states[name];
		this.engine.state.start();
	}
    
}
