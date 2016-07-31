IMAGE = "image";
AUDIO = "audio";
ANIMATION = "animation";
CREATED = 0;
LOADING = 1;
LOADED = 2;
FAILED = 3;

var Asset = function(name, type, path) {

    var that = this;
    
    this.name = name;
    this.type = type;
    this.path = path;
    this.status = CREATED;
    this.content = null;
    
    this.load = function(listener) {
        this.status = LOADING;
        if (this.type == IMAGE) {
            this.content = new Image();
            this.content.onload = function() { that.status = resource.LOADED; listener(); }
            this.content.onerror = function() { that.status = resource.FAILED; listener(); }
            this.content.src = this.path;  
        } else if (this.type == AUDIO) {
            this.content = new Audio();
            this.content.oncanplaythrough = function() { that.status = resource.LOADED; hook(); }
            this.content.onerror = function() { that.status = resource.FAILED; hook(); }
            this.content.src = this.path;  
        }
        
    }
    
}

var asAssetManager = (function() {
    
    
    
})();