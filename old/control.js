goog.require("engine.AssetManager");
goog.provide("engine.EngineControls");

class EngineControls extends AssetManager {

    constructor(canvas) {
        super();
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        
        this.originalCanvasWidth = canvas.width;
        this.originalCanvasHeight = canvas.height;
    }

    resizeFullWindow() {
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
    }

    enableFullWindow() {
        this.resizeFullWindow();
        window.addEventListener("resize", () => { this.resizeFullWindow(); });
        document.body.style.overflow = "hidden";
    }
    
    disableFullWindow() { 
        this.canvas.width = this.originalCanvasWidth;
        this.canvas.height = this.originalCanvasHeight;
    }

}