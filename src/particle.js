goog.require("engine.Entity2D");

goog.provide("engine.Particle2D");
goog.provide("engine.CircleParticle2D");
goog.provide("engine.ParticleSystem2D");
goog.provide("engine.CircleParticleSystem2D");

const CIRCLE = 69;
const SQUARE = 42;


class Particle2D {
    
    constructor(transform, life) {
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

class CircleParticle2D extends Particle2D {
    
    constructor(transform, life, color, deltaColor, radius, deltaRadius) {
        super(transform, life);
        this.color = color || [0, 0, 0, 0];
        this.deltaColor = deltaColor || [0, 0, 0, 0];
        this.radius = radius || 0;
        this.deltaRadius = deltaRadius || 0;
    }
    
    update(delta) {
        super.update(delta);
        for (var i = 0; i < this.color.length; i++)
			this.color[i] = this.color[i] + this.deltaColor[i] * delta;
        this.radius += this.deltaRadius * delta;
    }
    
    render(context, canvas) {
        context.save();
        context.translate(this.transform.x, this.transform.y);
        context.rotate(-this.rot);
        
        var colorString = "rgba(";
        for (var i = 0; i < this.color.length - 1; i++)
            colorString += Math.floor(this.color[i]) + ",";
        colorString += Math.floor(this.color[this.color.length - 1]) + ")";
        context.fillStyle = colorString;
        
        context.beginPath();
        context.arc(0, 0, this.radius, 0, 2*Math.PI);
        context.fill();
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
        this.alive = false;

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
			this._particlePool[i] = new this.Particle();
		this._deadIndex = 0;
    }
    
	_spawnParticle(particle) {
        particle.transform.position = this.transform.position.copy().add(this.positionVariation.scaled(Math.random()*2 - 1));
        particle.transform.rotation = this.transform.r + this.rotationVariation * (Math.random()*2 - 1);
		particle.life = this.baseLife + this.lifeVariation * (Math.random()*2 - 1);
        var direction = new Vector2D(Math.cos(this.transform.r), Math.sin(this.transform.r));
        var speed = this.baseSpeed + this.speedVariation * (Math.random()*2 - 1);
        var acceleration = this.baseAcceleration + this.accelerationVariation * (Math.random()*2+1);
		particle.velocity = direction.scaled(speed);
		particle.acceleration = direction.scaled(acceleration);
	}
	
	_addParticle() {
		if (this._isFull()) return;
        this._spawnParticle(this._particlePool[this._deadIndex]);
        this._particlePool[this._deadIndex].alive = true;
        this._deadIndex++;
	}
    
	_isFull() {
		return this._deadIndex === this.maxParticles;
	}
	
	update(delta) {
		if (!this.alive) return;
		if (this.emissionRate) {
			var rate = 1.0 / this.emissionRate;
			this._lastEmission += delta;
			while (!this._isFull() && this._lastEmission > rate) {
				this._addParticle();
				this._lastEmission = 0;
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
        this.alive = true;
    }
    
    stop() {
        this.alive = false;
    }
    
}

class CircleParticleSystem2D extends ParticleSystem2D {
    
    constructor(maxParticles, emissionRate, baseRadius, baseColor, endRadius, endColor) {
        super(CircleParticle2D.prototype.constructor, maxParticles, emissionRate);
        
        this.baseRadius = baseRadius || 1;
        this.endRadius = endRadius || baseRadius || NaN;
        this.baseColor = baseColor || [0, 0, 0, 0];
        this.endColor = endColor || baseColor || null;
        
        this.baseRadiusVariation = 0;
        this.endRadiusVariation = 0;
        this.baseColorVariation = [0, 0, 0, 0];
        this.endColorVariation = [0, 0, 0, 0];
    }
    
    _spawnParticle(particle) {
        super._spawnParticle(particle);
        
        // Set particle size (start and end)
		particle.radius = this.baseRadius + this.baseRadiusVariation * (Math.random()*2 - 1);
        particle.deltaRadius = 0;
        if (this.endRadius) {
            var endR = this.endRadius + this.endRadiusVariation * (Math.random()*2 - 1);
            particle.deltaRadius = (endR - particle.radius) / particle.life;
        }
       
		// Start color
        particle.color = [];
        for (var i = 0; i < this.baseColor.length; i++) 
            particle.color[i] = Math.min(255, Math.max(0, this.baseColor[i] + this.baseColorVariation[i] * (Math.random()*2 - 1)));
        
        // End color
        particle.deltaColor = [0, 0, 0, 0];
        if (this.endColor) {
            var endC = [];
            for (var i = 0; i < this.endColor.length; i++) 
                endC[i] = Math.min(255, Math.max(0, this.endColor[i] + this.endColorVariation[i] * (Math.random()*2 - 1)));
            
            // Calculate delta color
            for (var i = 0; i < this.baseColor.length; i++)
                particle.deltaColor[i] = (endC[i] - particle.color[i]) / particle.life;
        }
    }
    
    update(delta) {
        super.update(delta);
    }
    
}