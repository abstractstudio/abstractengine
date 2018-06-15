/** inputDemo.js */
// Sample input

goog.require("engine.Engine2D");

class InputDemo extends Engine2D {
		// Set up position vecs
		setup() {
			speed = 5;
			position = new Vector2D(this.canvas.width/2, this.canvas.height/2);
		}

		update(delta) {
			// Detect WASD and move accordingly
			if (this.input.keyboard[87]){
				position.add(new Vector2D(0, -speed));
			}
			if(this.input.keyboard[68]){
				position.add(new Vector2D(speed, 0));
			}
			if (this.input.keyboard[83]){
				position.add(new Vector2D(0, speed));
			}
			if(this.input.keyboard[65]){
				position.add(new Vector2D(-speed, 0));
			}
		}

    render(context, canvas) {
				// Render BG
        context.fillStyle = "white";
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        context.fillStyle = "black";
        context.font = "20px Verdana";
        context.textBaseline = "hanging";
        context.fillText("Input Demo", 10, 10);

				// Render square
				context.fillStyle = "red";
				context.fillRect(position.x, position.y, 10, 10);
    }

}

window.InputDemo = InputDemo;
