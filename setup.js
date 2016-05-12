/** Setup utilities. */
var setup = {};

/** Abstract Engine dependencies. */
var dependencies = ["geometry.js", "callback.js", "resource.js", "modifier.js", "input.js", "engine.js"];

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

/** Locate a crossplatform feature. */
function crossplatform(name) { 
	window[name] = window[name] || window["webkit"+name] || window["moz"+name] || window["ms"+name]; 
}

/* Check start function. */
if (typeof start === "function") {
    
    /* Load the engine. */
    if (typeof ENGINE !== "string") var ENGINE = "";
    dependencies = dependencies.map(function(file) { return ENGINE+file; });
    setup.require(dependencies, start);
    console.log("Loaded dependencies");

/* Otherwise. */
} else { console.error("No start function is defined"); }
