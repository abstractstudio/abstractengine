goog.require("engine.EventInterface");
goog.provide("engine.Animation");


class Animation extends EventManager {

    constructor() {
        super();
        this.image = null;
        this.name = null;
        this._src = null;
        this._interval = null;
        this._rows = 1;
        this._columns = 1;
    
        this.isPlaying = true;
        this.isReverse = false;
        this.loop = true;
    
        this.frameCount = 0;
        this.frameIndex = 0;
        this.frameSpeed = 40;
        this.startTime = 0;
    }
    
    get src() { return url; }
    set src(url) { return this.srcset(url); }
    
    get rows() { return this._rows; }
    set rows(number) { console.log(number); this.frameCount = (this._rows = number) * this._columns; }
    
    get columns() { return this._columns; }
    set columns(number) { this.frameCount = (this._columns = number) * this._rows; }
    
    get width() { return this.image.width / this._columns; }
    get height() { return this.image.height / this._rows; }
        
    srcset(url) {
        this._src = url;
        this.image = new Image();
        this.image.onload = this._onload.bind(this);
        this.image.onerror = this._onerror.bind(this);
        this.image.src = url;
    }
        
    _onload(e) { this.fireEvent("load", e); this.onload(e); }
    _onerror(e) { this.fireEvent("error", e); this.onerror(e); }
    _onfinish(e) { this.fireEvent("finish", e); this.onfinish(e); }
    
    onload(e) {}
    onerror(e) {}
    onfinish(e) {}
    
    frame(index) {
        this.frameIndex = index % this.frameCount;
    }
    
    play() {
        this.frameIndex = 0;
        this.isPlaying = true;
    }
    
    _update() {
        this.frameIndex++;
        if (this.frameIndex == this.frameCount) {
            if (!this.loop) this._onfinish();
            else this.frameIndex = 0;
        }
    }
    
    update() {
        if (this.isPlaying) {
            var now = Date.now();
            if (now - this.start >= this.frameSpeed) {
                this.start = now;
                this._update();
            }
        }
    }
    
    stop() {
        this.isPlaying = false;
    }

}

CanvasRenderingContext2D.prototype["drawAnimation"] = function(animation, dx, dy, dWidth, dHeight) {
    
    var r = animation._rows;
    var c = animation._columns;
    var i = animation.frameIndex;
    var image = animation.image;
    
    var w = image.width / c;
    var h = image.height / r;
    var x = (i % c) * w;
    var y = Math.floor(i / c) * h;
        
    this.drawImage(image, x, y, w, h, dx, dy, dWidth || w, dHeight || h);

}
