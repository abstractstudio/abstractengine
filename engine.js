

/** The main game engine. */
function Engine(canvas) {
    
    /** Entities. */
    this.entities = {};
    
    /** Managers. */
    this.entities.resources = this.resources = new resource.Manager(this);
    this.entities.callbacks = this.callbacks = new callback.Manager(this);
    this.entities.modifiers = this.modifiers = new modifier.Manager(this);
    this.entities.input = this.input = new input.Manager(this);
    
    /** Graphics. */
    this.canvas = canvas;
    this.context = canvas ? canvas.getContext("2d") : null;
    
}