function Demo(canvas) {

    Engine.call(this, canvas);
    
    this.setup = function() {
        this.queueAsset("player:knife:idle", ANIMATION, "assets/player/knife/melee.png", {columns: 15});
    }
    
    this.load = function() {
        this.a = this.getAsset("player:knife:idle");
        this.a.play();
    }
    
    this.render = function(delta) {
        this.context.fillStyle = "white";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = "black";
        this.context.textAlign = "left";
        this.context.textBaseline = "hanging";
        this.context.font = "16px Verdana";
        this.context.fillText(Math.floor(this.fps()) + " fps", 10, 10);
        this.context.drawAnimation(this.a, 50, 50);
    }

}

Demo.prototype = Engine.prototype;
