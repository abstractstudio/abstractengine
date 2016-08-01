function Animation() {

    this._src;
    this.image;
    var interval;

    this._rows = 0;
    this._columns = 0;
    
    this.isPlaying = true;
    this.isReverse = false;
    this.loop = true;
    
    this.frameCount = 0;
    this.frameIndex = 0;
    this.frameSpeed = 0;
    this.startTime = 0;
        
    this._onload = function(e) { this.raiseEvent("load", e); this.onload(e); }
    this._onerror = function(e) { this.raiseEvent("error", e); this.onerror(e); }
    this._onfinish = function(e) { this.raiseEvent("finish", e); this.onfinish(e); }
    
    this.onload = function(e) {}
    this.onerror = function(e) {}
    this.onfinish = function(e) {}
    
    this.play = function(useInterval) {
        this.frameIndex = 0;
        this.isPlaying = true;
        if (useInteval !== false)
            interval = setInterval(function() { update(); }, this.frameSpeed);
    }
    
    var update = function() {
        this.frameIndex++;
        if (this.frameIndex + 1 == this.frameCount) {
            if (!this.loop) this._onfinish();
            else this.frameIndex = 0;
        }
    }
    
    this.update = function() {
        if (this.isPlaying) {
            var now = Date.now();
            if (now - this.start >= this.frameSpeed) {
                this.start = now;
                update();
            }
        }
    }
    
    this.stop = function() {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
    }

}

Animation.prototype = {

    get src() { return url; },
    set src(url) { return this.srcset(url); },
    
    srcset(url) {
        this._src = url;
        this.image = new Image();
        this.image.onload = this._onload.bind(this);
        this.image.onerror = this._onerror.bind(this);
        this.image.src = url;
    },
    
    get rows() { return this._rows; },
    set rows(number) { this.frameCount = (this._rows = number) * this._columns; },
    
    get columns() { return this._columns; },
    set columns(number) { this.frameCount = (this._columns = number) * this._rows; },
  
};

asEventManager.call(Animation.prototype);

CanvasRenderingContext2D.prototype["drawAnimation"] = function(animation, dx, dy, dWidth, dHeight) {
    
    
    var w = this.image.width / animation._columns;
    var h = this.image.height / animation._rows;
    
    

}

