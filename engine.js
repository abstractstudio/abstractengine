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
    this.updateTime = 0;
    
    this.renderTime = 0;
    this.renderTracking = 5;
    this.renderTrackingIndex = 0;
    this.renderHistory = new Array(this.renderTracking);
    
    this.setup = function() {}
    
    this.load = function() {}
    
    this.main = function() {}
    
    this.start = function() {}
    
    this.update = function(delta) {}
    
    this.render = function(delta) {}
    
    this.stop = function() {}
    
    this.cleanup = function() {}

    this.run = function() {}
    
}

asEventManager.call(Engine.prototype);

