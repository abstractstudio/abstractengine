'use strict';

/*

setup()
load()
main()
  start()
    update()
    render()
  stop()
cleanup()

*/


function Engine(canvas) {
    
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    
    this.updateLimit = 60;
    this.updateInterval = 1000 / this.updateLimit;
    
    var updateTime = 0;
    var renderTime = 0;
    var renderTrackingCount = 20;
    var renderTrackingIndex = 0;
    var renderHistory = new Array(this.renderTrackingCount);
    
    this.a;
    
    var update = function() {   
        var delta = Date.now() - updateTime;
        updateTime = Date.now();
        this.update(delta);
    }
    
    var render = function() {
        requestAnimationFrame(render.bind(this));
        var delta = Date.now() - renderTime;
        renderTime = Date.now();
        this.render(delta);
        
        renderHistory[renderTrackingIndex] = delta;
        renderTrackingIndex++;
        if (renderTrackingIndex == renderTrackingCount) 
            renderTrackingIndex = 0;
    }
    
    this.setup = function() {
        this.queueAsset("player:knife:idle", ANIMATION, "assets/player/knife/move.png", {columns: 20});
        var that = this;
        this.loadAssets(function() { that.load(); });
    }
    
    this.load = function() {
        this.a = this.getAsset("player:knife:idle");
        this.a.play();
        this.start();
    }
        
    this.start = function() {
        setInterval(update.bind(this), this.updateInterval);
        render.call(this);
    }
    
    this.update = function(delta) {}
    
    this.render = function(delta) {
        this.context.fillStyle = "white";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = "black";
        this.context.textAlign = "left";
        this.context.textBaseline = "hanging";
        this.context.font = "16px Verdana";
        this.context.fillText(Math.floor(this.fps()) + " fps", 10, 10)
        
        this.context.drawAnimation(this.a, 50, 50);
    }
    
    this.stop = function() {}
    
    this.cleanup = function() {}
    
    this.main = function() {
        this.setup();
    }
    
    this.fps = function() {
        return renderHistory
            .map(function(x) { return 1000/x; })
            .reduce(function(a, b) { return a+b; }, 0) 
            / renderTrackingCount
    }
    
}

asEventManager.call(Engine.prototype);
asAssetManager.call(Engine.prototype);
