goog.require("engine.Entity2D");

goog.provide("engine.Particle2D");
goog.provide("engine.ColoredParticle");
goog.provide("engine.CircleParticle2D");
goog.provide("engine.SquareParticle2D");
goog.provide("engine.ParticleSystem2D");
goog.provide("engine.ColorParticleSystem2D");
goog.provide("engine.CircleParticleSystem2D");
goog.provide("engine.SquareParticleSystem2D");

const CIRCLE = 69;
const SQUARE = 42;


class Particle2D {
    
    constructor(system, transform, life) {
        this.system = system;
        this.transform = transform || new Transform2D();
        this.velocity = new Vector2D(0, 0);
        this.acceleration = new Vector2D(0, 0);
        
        this.life = life || 0;
        this.alive = false;
    }
    
    update(delta) {
		this.life -= delta;        
		if (this.life <= 0) {
			this.alive = false;
		} else {
            this.velocity.add(this.acceleration.scaled(delta/16));
			this.transform.position.add(this.velocity.scaled(delta/16));
        }
	}
    
    render(context, canvas) {}

}

class ColorParticle2D extends Particle2D {
    
    constructor(transform, life, color, deltaColor) {
        super(transform, life);
        this.color = color || [0, 0, 0, 0];
        this.deltaColor = deltaColor || [0, 0, 0, 0];
    }
    
    update(delta) {
        super.update(delta);
        for (var i = 0; i < this.color.length; i++)
			this.color[i] = this.color[i] + this.deltaColor[i] * delta;
    }
    
    getColorString() {
        var colorString = "rgba(";
        for (var i = 0; i < this.color.length - 1; i++)
            colorString += Math.floor(this.color[i]) + ",";
        colorString += Math.floor(this.color[this.color.length - 1]) + ")";
        return colorString;
    }
    
    render(context, canvas) {}
}

class CircleParticle2D extends ColorParticle2D {
    
    constructor(transform, life, color, deltaColor, radius, deltaRadius) {
        super(transform, life, color, deltaColor);
        this.radius = radius || 0;
        this.deltaRadius = deltaRadius || 0;
    }
    
    update(delta) {
        super.update(delta);
        this.radius += this.deltaRadius * delta;
    }
    
    render(context, canvas) {
        context.save();
        context.translate(this.transform.x, this.transform.y);
        context.rotate(-this.rot);
        context.fillStyle = this.getColorString();
        context.beginPath();
        context.arc(0, 0, this.radius, 0, 2*Math.PI);
        context.fill();
        context.restore();
    }
}

class SquareParticle2D extends ColorParticle2D {
    
    constructor(transform, life, color, deltaColor, length, deltaLength) {
        super(transform, life, color, deltaColor);
        this.length = length || 0;
        this.deltaLength = deltaLength || 0;
    }
    
    update(delta) {
        super.update(delta);
        this.length += this.deltaLength * delta;
    }
    
    render(context, canvas) {
        context.save();
        context.translate(this.transform.x, this.transform.y);
        context.rotate(-this.rot);
        
        context.fillStyle = this.getColorString();
        context.fillRect(-this.length/2, -this.length/2, this.length, this.length);
        
        context.restore();
    }
    
}

class ParticleSystem2D extends Entity2D {
    
    constructor(Particle, maxParticles, emissionRate) {
        super();
        this.Particle = Particle || Particle2D.prototype.constructor;
        this.maxParticles = maxParticles || 0;
        this.emissionRate = emissionRate || 0;
        this._particlePool = [];
        this._deadIndex = 0;
        this._lastEmission = 0;
        this.duration = 0;
        this.running = false;
        this._dying = false;
        this.baseSpeed = 0; 
        this.baseAcceleration = 0;
        this.baseLife = 0; 
        this.positionVariation = new Vector2D(0, 0); 
        this.rotationVariation = 0; 
        this.speedVariation = 0;
        this.accelerationVariation = 0;
        this.lifeVariation = 0;
        this.reset();
    }
    
    reset() {
		for (var i = 0; i < this.maxParticles; i++)
			this._particlePool[i] = new this.Particle(this);
		this._deadIndex = 0;
    }
    
	spawnParticle(particle) {
        particle.transform.position = this.transform.position.copy();
        particle.transform.position.x += this.positionVariation.x * (Math.random()*2 - 1);
        particle.transform.position.y += this.positionVariation.y * (Math.random()*2 - 1);
        var rotation = this.transform.r + this.rotationVariation * (Math.random()*2 - 1);
		particle.life = this.baseLife + this.lifeVariation * (Math.random()*2 - 1);
        var direction = new Vector2D(Math.cos(rotation), Math.sin(rotation));
        var speed = this.baseSpeed + this.speedVariation * (Math.random()*2 - 1);
        var acceleration = this.baseAcceleration + this.accelerationVariation * (Math.random()*2+1);
		particle.velocity = direction.scaled(speed);
		particle.acceleration = direction.scaled(acceleration);
	}
	
	_addParticle() {
        this.spawnParticle(this._particlePool[this._deadIndex]);
        this._particlePool[this._deadIndex].alive = true;
        this._deadIndex++;
	}
    
	_isFull() {
		return this._deadIndex == this.maxParticles;
	}
	
	update(delta) {
		if (!this.running) return;
        
		if (this.emissionRate) {
			var rate = 1000.0 / this.emissionRate;
			this._lastEmission += delta;
            if (!this._dying) while (!this._isFull() && this._lastEmission > rate) {
				this._addParticle();
				this._lastEmission -= rate;
			} else if (this._deadIndex == 0) {
                this._dying = false;
                this._lastEmission = 0;
                this.stop();
            }
		}
        
		var index = 0;
		while (index < this._deadIndex) {
			var particle = this._particlePool[index];
            if (particle.alive) {
                particle.update(delta);
                index++;
            } else {
                var t = this._particlePool[index];
                this._particlePool[index] = this._particlePool[this._deadIndex - 1];
                this._particlePool[this._deadIndex - 1] = t;
                this._deadIndex--;
            }
		}
	}
    
	render(context, canvas) {
		for (var i = 0; i < this._deadIndex; i++) {
			var particle = this._particlePool[i];
            if (particle.alive) particle.render(context, canvas);
		}
	}
    
    start() {
        this.running = true;
    }
    
    die() { 
        this._dying = true;
    }
    
    stop() {
        this.running = false;
    }
    
    
    
}

class ColorParticleSystem2D extends ParticleSystem2D {
    
    constructor(Particle, maxParticles, emissionRate) {
        super(Particle.prototype.constructor, maxParticles, emissionRate);
        this.baseColor = [0, 0, 0, 0];
        this.endColor = null;
        this.baseColorVariation = [0, 0, 0, 0];
        this.endColorVariation = [0, 0, 0, 0];
    }
    
    spawnParticle(particle) {
        super.spawnParticle(particle);
        
        particle.color = [];
        for (var i = 0; i < this.baseColor.length; i++) 
            particle.color[i] = Math.min(255, Math.max(0, this.baseColor[i] + this.baseColorVariation[i] * (Math.random()*2 - 1)));
        
        particle.deltaColor = [0, 0, 0, 0];
        if (this.endColor) {
            var endC = [];
            for (var i = 0; i < this.endColor.length; i++) 
                endC[i] = Math.min(255, Math.max(0, this.endColor[i] + this.endColorVariation[i] * (Math.random()*2 - 1)));
            for (var i = 0; i < this.baseColor.length; i++)
                particle.deltaColor[i] = (endC[i] - particle.color[i]) / particle.life;
        }
    }
    
    update(delta) {
        super.update(delta);
    }
}

class CircleParticleSystem2D extends ColorParticleSystem2D {
    
    constructor(maxParticles, emissionRate) {
        super(CircleParticle2D.prototype.constructor, maxParticles, emissionRate);
        this.baseRadius = 0;
        this.endRadius = NaN;
        this.baseRadiusVariation = 0;
        this.endRadiusVariation = 0;
    }
    
    spawnParticle(particle) {
        super.spawnParticle(particle);
        
        // Set particle size (start and end)
		particle.radius = this.baseRadius + this.baseRadiusVariation * (Math.random()*2 - 1);
        particle.deltaRadius = 0;
        if (this.endRadius) {
            var endR = this.endRadius + this.endRadiusVariation * (Math.random()*2 - 1);
            particle.deltaRadius = (endR - particle.radius) / particle.life;
        }
    }
    
    update(delta) {
        super.update(delta);
    }
    
}

class SquareParticleSystem2D extends ColorParticleSystem2D {
    
    constructor(maxParticles, emissionRate, CustomParticle) {
        super(CustomParticle || SquareParticle2D.prototype.constructor, maxParticles, emissionRate);
        this.baseLength = 0;
        this.endLength = NaN;
        this.baseLengthVariation = 0;
        this.endLengthVariation = 0;
    }
    
    spawnParticle(particle) {
        super.spawnParticle(particle);
		particle.length = this.baseLength + this.baseLengthVariation * (Math.random()*2 - 1);
        particle.deltaLength = 0;
        if (this.endLength) {
            var endL = this.endLength + this.endLengthVariation * (Math.random()*2 - 1);
            particle.deltaLength = (endL - particle.length) / particle.life;
        }
    }
    
    update(delta) {
        super.update(delta);
    }
    
}