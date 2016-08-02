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
    
    var setup = (function() {
        this.setup();
        this.loadAssets(function() { load(); console.log(5); });
    }).bind(this);
    
    var load = (function() {
        this.load();
        start();
    }).bind(this);
    
    var start = (function() {
        setInterval(update, this.updateInterval);
        render();
    }).bind(this);
    
    var update = (function() {   
        var delta = Date.now() - updateTime;
        updateTime = Date.now();
        this.update(delta);
    }).bind(this);
    
    var render = (function() {
        requestAnimationFrame(render);
        var delta = Date.now() - renderTime;
        renderTime = Date.now();
        this.render(delta);
        
        renderHistory[renderTrackingIndex] = delta;
        renderTrackingIndex++;
        if (renderTrackingIndex == renderTrackingCount) 
            renderTrackingIndex = 0;
    }).bind(this)
    
    this.setup = function() {}
    
    this.load = function() {}
    
    this.update = function(delta) {}
    
    this.render = function(delta) {}
    
    this.stop = function() {}
    
    this.cleanup = function() {}
    
    this.main = function() { setup.call(this); }
    
    this.fps = function() {
        return renderHistory
            .map(function(x) { return 1000/x; })
            .reduce(function(a, b) { return a+b; }, 0) 
            / renderTrackingCount
    }
    
}

asEventManager.call(Engine.prototype);
asAssetManager.call(Engine.prototype);
