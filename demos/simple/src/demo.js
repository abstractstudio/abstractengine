/** simple.js */
// Simple drawing demonstration with Vector2D

goog.require("engine.Engine2D");
goog.require("engine.Vector2D");

class Simple extends Engine2D {

		// Set up position and direction vecs
		setup() {
			position = new Vector2D(0, 0);
			direction = new Vector2D(3, 3);
		}

		update(delta) {
			// Move square
			position.add(direction);

			// Bounce on edges
			if (position.x > this.canvas.width || position.x < 0){
				direction.x = -direction.x;
			}
			if (position.y > this.canvas.height || position.y < 0){
				direction.y = -direction.y;
			}
		}

    render(context, canvas) {
				// Render BG
        context.fillStyle = "white";
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        context.fillStyle = "black";
        context.font = "20px Verdana";
        context.textBaseline = "hanging";
        context.fillText("Simple", 10, 10);

				// Render square
				context.fillStyle = "red";
				context.fillRect(position.x, position.y, 10, 10);
    }

}

window.Simple = Simple;
