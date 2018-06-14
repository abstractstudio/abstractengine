goog.provide("engine.AudioSource");
goog.provide("engine.SoundManager");

// Wrapper for playing sounds
class AudioSource {
    constructor(sound) {
        this.sound = sound;
        this.isPlaying = false;
        this.isLooping = false;
        this.volume = 1;
    }

    play() {
        this.isPlaying = true;
        this.clip.play();
    }
    stop() {
        this.isPlaying = false;
        this.clip.stop();
    }

    set clip(c) {
        this.sound = c;
        this.sound.volume = this.volume;
        this.sound.loop = this.isLooping;
    }
    get clip(){ return this.sound; }
}

// Dictionary for storing sounds
class SoundManager {
    constructor(engine) {
        this.engine = engine;
        this.engine.managers.sounds = this;
        this.sounds = {};
    }

    add(name, sound) {
        this.sounds[name] = entity;
    }

    get(name) {
        return this.sounds[name];
    }
}
