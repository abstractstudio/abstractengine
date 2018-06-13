/** test.js */
// Displays frames per second in empty canvas

goog.require("engine.Engine2D");

class Demo extends Engine2D {

    render(context, canvas) {
        context.fillStyle = "white";
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        context.fillStyle = "black";
        context.font = "20px Verdana";
        context.textBaseline = "hanging";
        context.fillText("FPS: " + Math.round(this.fps()), 10, 10);
    }

}

window.Demo = Demo;
