goog.require("engine.Engine");

class Demo extends Engine {
    
    setup() {
        
    }
        
    render(context) {    
        context.fillStyle = "white";
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        context.fillStyle = "black";
        context.font = "20px Verdana";
        context.textBaseline = "hanging";
        context.fillText(Math.round(this.fps()) + "", 10, 10);
    }
    
}

window.Demo = Demo;
