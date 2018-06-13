goog.require("engine.EventInterface");
goog.provide("engine.State");
goog.provide("engine.Transition")
goog.provide("engine.StateManager")

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
    render(context, canvas) {}
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

    start() {}

}

class StateManager extends EventInterface {

    constructor(engine) {
        super();
        this.engine = engine;
        this.engine.managers.states = this;
        this.states = {};
        this.engine.state = null;
        this.current = "";
    }

    add(name, State) {
        this.states[name] = new State(this.engine, this.engine.game);
    }

    link(from, to, Transition) {
        var transition;
        if (Transition === undefined) transition = null;
        else transition = new Transition(this.engine, this.engine.game);
        this.states[from].transitions[to] = transition;
    }

    go(name) {
        if (!this.states.hasOwnProperty(name)) {
            console.warn("State '" + name + "' does not exist.");
            return;
        } else if (this.engine.state !== null) {
			this.engine.state.stop();
            var transition = this.engine.state.transitions[name];
            if (transition === undefined) {
                console.warn("Current state is not linked to state '" + name + "'.");
                return;
            } else if (transition !== null) {
                transition.start();
            }
        }
        this.engine.state = this.states[name];
        this.current = name;
        this.engine.state.start();
	}

}
