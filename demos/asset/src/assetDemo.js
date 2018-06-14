/** assetDemo.js */
// Asset usage demo

goog.require("engine.Engine2D");
goog.require("engine.Entity2D");
goog.require("engine.AudioSource");

class AssetDemo extends Engine2D {

		setup() {
			// Set up assets
			this.assets.queue("sampleImg", IMAGE, "assets/abstract.png");
			this.assets.queue("sampleSound", AUDIO, "assets/spinme_short.wav");

			// Set up entities
			var entity = new Entity2D();
			entity.transform.position = new Vector2D(400, 300);
			entity.transform.scale = new Vector2D(2, 2);
			this.entities.add("sampleEntity", entity);

			audioSource = new AudioSource();
		}

		load() {
			// Load in assets and choose renderable for entity
			this.entities.get("sampleEntity").addRenderable("sampleImg", this.assets.get("sampleImg"));
			this.entities.get("sampleEntity").setRenderable("sampleImg");

			// Set audio settings and play
			audioSource.volume = 0.1;
			audioSource.isLooping = true;
			audioSource.playbackRate = 1.5;
			audioSource.clip = this.assets.get("sampleSound");
			audioSource.play();
		}

		update(delta) {
			// Update entity rotation
			this.entities.get("sampleEntity").transform.rotation += 0.01;
		}

		render (context, canvas) {
			// Render BG
			context.fillStyle = "white";
			context.fillRect(0, 0, this.canvas.width, this.canvas.height);

			this.entities.get("sampleEntity").render(context, canvas);

			// Render text
			context.fillStyle = "black";
			context.font = "20px Verdana";
			context.textBaseline = "hanging";
			context.fillText("Asset Demo", 10, 10);
		}

}

window.AssetDemo = AssetDemo;
