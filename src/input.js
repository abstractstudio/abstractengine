goog.require("engine.EventInterface");
goog.provide("engine.InputManager");
goog.provide("engine.KEY");
goog.provide("engine.BUTTON");
goog.provide("engine.MOUSE");
goog.provide("engine.IGNORE");

const KEY = Object.freeze({CANCEL: 3, HELP: 6, BACK_SPACE: 8, TAB: 9, CLEAR: 12, RETURN: 13, ENTER: 14, SHIFT: 16, CONTROL: 17, ALT: 18, PAUSE: 19, CAPS_LOCK: 20, ESCAPE: 27, SPACE: 32, PAGE_UP: 33, PAGE_DOWN: 34, END: 35, HOME: 36, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, PRINTSCREEN: 44, INSERT: 45, DELETE: 46, 0: 48, 1: 49, 2: 50, 3: 51, 4: 52, 5: 53, 6: 54, 7: 55, 8: 56, 9: 57, SEMICOLON: 59, EQUALS: 61, A: 65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90, CONTEXT_MENU: 93, NUMPAD0: 96, NUMPAD1: 97, NUMPAD2: 98, NUMPAD3: 99, NUMPAD4: 100, NUMPAD5: 101, NUMPAD6: 102, NUMPAD7: 103, NUMPAD8: 104, NUMPAD9: 105, MULTIPLY: 106, ADD: 107, SEPARATOR: 108, SUBTRACT: 109, DECIMAL: 110, DIVIDE: 111, F1: 112, F2: 113, F3: 114, F4: 115, F5: 116, F6: 117, F7: 118, F8: 119, F9: 120, F10: 121, F11: 122, F12: 123, F13: 124, F14: 125, F15: 126, F16: 127, F17: 128, F18: 129, F19: 130, F20: 131, F21: 132, F22: 133, F23: 134, F24: 135, NUM_LOCK: 144, SCROLL_LOCK: 145, COMMA: 188, PERIOD: 190, SLASH: 191, BACK_QUOTE: 192, OPEN_BRACKET: 219, BACK_SLASH: 220, CLOSE_BRACKET: 221, QUOTE: 222, META: 224});
const BUTTON = Object.freeze({HELD: 1, PRESSED: 2});
const MOUSE = Object.freeze({LEFT: 0, RIGHT: 2});
const IGNORE = new Set([37, 39, 38, 40, 32]);

class InputManager extends EventInterface {

    constructor(engine) {
        super();
        this.engine = engine;
        this.engine.managers.input = this;
        this.canvas = engine.canvas;
        this.canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
        this.canvas.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
        
        this.mouse = {x: 0, y: 0};
        this.keyboard = {};
        this.captureMouseEnabled = false;
        this.preventReloadEnabled = false;  // For development purposes
        
        this._captured = false;
        this._capturing = false;
        
        document.addEventListener("keydown", this.onKeyDown.bind(this));
        document.addEventListener("keyup", this.onKeyUp.bind(this));
        document.addEventListener("mousedown", this.onMouseDown.bind(this));
        document.addEventListener("mouseup", this.onMouseUp.bind(this));  
        document.addEventListener("mousemove", this.onMouseMove.bind(this));
        
        this.canvas.addEventListener("mousedown", this.onMouseDownLock.bind(this), false);
        document.addEventListener("pointerlockchange", this.onPointerLockChange.bind(this), false);
        window.onbeforeunload = this.onReload.bind(this);
    }
    
    update() {
        for (var key in this.keyboard) 
            if (this.keyboard[key] == BUTTON.PRESSED)
                this.keyboard[key] = BUTTON.HELD;
        for (var button in this.mouse)
            if (this.mouse[button] == BUTTON.PRESSED)
                this.mouse[button] = BUTTON.HELD;
    }
    
    captureMouse() { 
        if (this._captured) return;
        this._capturing = true;
        this.canvas.requestPointerLock(); 
        this._captured = true;
        this.fireEvent("capturemouse");
        console.log("capture");
    }
    
    releaseMouse(alreadyReleased) { 
        if (!this._captured) return;
        //this.canvas.exitPointerLock();  // done by browser
        this._captured = false;
        this.fireEvent("releasemouse");
        console.log("release");
    }
    
    isCaptured() {
        return this._captured;
    }
    
    onMouseDownLock(e) { 
        if (!this.captureMouseEnabled) return;
        if (!this._captured) this.captureMouse(); 
    }
    
    onPointerLockChange(e) {
        if (!this.captureMouseEnabled) return;
        if (this._capturing) this._capturing = false;
        else this.releaseMouse(true);
    }
    
    onReload(e) {
        this.fireEvent("attemptreload");
        return this.preventReloadEnabled || null;
    }
    
    onKeyDown(e) {
        if (this.keyboard[e.keyCode] === undefined) 
            this.keyboard[e.keyCode] = BUTTON.PRESSED;
        if (IGNORE.hasOwnProperty(e.keyCode)) e.preventDefault();
    }
    
    onKeyUp(e) { 
        delete this.keyboard[e.keyCode]; 
    }
    
    onMouseDown(e) { 
        this.mouse[e.button] = BUTTON.PRESSED;
    }
    
    onMouseUp(e) {
        delete this.mouse[e.button];
    }
    
    onMouseMove(e) {
        if (this._isMouseCaptured) {
            this.mouse.x += e.movementX || 0;
            this.mouse.y += e.movementY || 0;
        } else if (!this._useMouseCapture) {
            this.mouse.x = e.clientX - (engine.canvas ? engine.canvas.offsetLeft + document.body.scrollLeft : 0);
            this.mouse.y = e.clientY - (engine.canvas ? engine.canvas.offsetTop + document.body.scrollTop : 0); 
        }
    }

}
