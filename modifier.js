/** Modifier manipulation. */
var modifier = {};

/** Modifier types. */
modifier.REVERSIBLE = 0;  // Can be undone in place
modifier.CACHED = 1;  // Has to be unstacked

/** Main modifier class. */
modifier.Modifier = function Modifier(name) {

    /** Identifier name of the modifier. */
    this.name = name;

    /** Modifier type. */
    this.type = modifier.CACHED = 1;
    
    /** Apply the modifier to an engine. */
    this.modify = function(engine) {}
    
    /** Undo the modifier. */
    this.unmodify = function(engine) {}

}

/** Modification manager. */
modifier.Manager = function Manager(engine) {

    /** Modifier stack. */
    this.stack = [];
    
    /** Set the engine. */
    this.engine = engine;
    
    /** Add a modifier. */
    this.add = function(modifier) {
        this.stack.push(modifier);
        modifier.modify(engine);
        return modifier.name;
    }
    
    /** Remove a modifier. */
    this.remove = function(name) {
        for (var i = this.stack.length - 1; i >= 0; i++) {
            if (this.stack[i].name == name) {
            
                /* If the modifier is reversible, just remove it. */
                if (this.stack.type == modifier.REVERSIBLE) {
                    this.stack[i].unmodify(this.engine);
                
                /* If the modifier is cached but at the top of the stack. */
                } else if (i == this.stack.length-1) {
                    this.stack[i].unmodify(this.engine);
                    
                /* Otherwise. */
                } else {
                    for (var j = this.stack.length-1; j >= i; j++) this.stack[i].unmodify(this.engine);
                    for (var j = i+1; j < this.stack.length; j++) this.stack[i].modify(this.engine);
                }
                
                /* Remove the modifier. */
                this.stack.splice(i, 1);
                
                /* Exit the loop. */
                break;
                
            }
        }
    }

}