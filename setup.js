/** Setup utilities. */
var setup = function(hook) {

    /* Check start function. */
    if (hook || typeof main === "function") {

        /* Load the engine. */
        console.log("Loading dependencies from " + (setup.directory || "."));
        var dependencies = setup.dependencies.map(function(file) { return setup.directory+file; });
        setup.require(dependencies, hook || main);
        console.log("Loaded dependencies");

    /* Otherwise. */
    } else { console.error("No main function is defined"); }

};

/** Abstract Engine dependencies. */
setup.dependencies = ["geometry.js", "callback.js", "resource.js", "modifier.js", "input.js", "engine.js"];

/** Define the engine path. */
setup.directory = "abstractengine/";

/** Require a set of javascript files. */
setup.require = function(files, callback) {
    
    /* Set up ready hooks. */
    var ready = [];
    var finished = false;
    var and = function(a, b) { return a && b; };
    var check = function() {
        if (ready.indexOf(null) == -1 && !finished) {
            callback(ready.reduce(and));
            finished = true;
            console.log("Made callback from require");
        }
    };
    
    /* Iterate through files. */
    for (var i = 0; i < files.length; i++) {
        
        /* Create script and custom hook. */
        var script = document.createElement("script");
        script.index = i;
        script.type = "text/javascript";
        script.src = files[i];

        /* Create event callbacks. */
        var hook = function() { ready[this.index] = true; check(); };
        script.onreadystatechange = hook;
        script.onload = hook;
        ready[i] = null;
        
        /* Add the script. */
        try { document.head.appendChild(script); }
        catch (e) { ready[i] = false; }
        
    }
    
}
