goog.require("engine.Engine");

class Demo extends Engine {
    
    setup() {
        this.context = this.canvas.getContext("2d");
    }
        
    render(context, canvas) {    
        context.fillStyle = "white";
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        context.fillStyle = "black";
        context.font = "20px Verdana";
        context.textBaseline = "hanging";
        context.fillText(Math.round(this.fps()) + "", 10, 10);
    }
    
}

window.Demo = Demo;
