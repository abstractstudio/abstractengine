goog.require("engine.Entity2D");

goog.provide("engine.Particle2D");
goog.provide("engine.CircleParticle2D");
goog.provide("engine.ParticleSystem2D");
goog.provide("engine.CircleParticleSystem2D");

const CIRCLE = 69;
const SQUARE = 42;


class Particle2D {
    
    constructor(transform, life) {
        this.transform = transform || new Transform2();
        this.velocity = new Vector2(0, 0);
        this.acceleration = new Vector2(0, 0);
        
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
        this.color = color;
        this.deltaColor = deltaColor;
        this.radius = radius;
        this.deltaRadius = deltaRadius;
    }
    
    update(delta) {
        super.update(delta);
        for (var i = 0; i < this.color.length; i++)
			this.color[i] += this.deltaColor[i] * delta;
        this.radius += this.deltaRadius * delta;
    }
    
    render(context, canvas) {
        context.save();
        context.translate(this.transform.x, this.transform.y);
        context.rotate(-this.rot);
        context.fillStyle = "rgba(" + this.color.join(",") + ")";
        context.beginPath();
        context.arc(this.transform.x, this.transform.y, this.radius, 0, 2*Math.PI);
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
        this._emitCounter = 0;
        
        this.duration = 0;
        this.alive = false;

        this.baseSpeed = 0; 
        this.baseAcceleration = 0;
        this.baseLife = 0; 
        this.positionVariation = new Vector2(0, 0); 
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
        particle.transform.x = this.transform.x + this.positionVariation.x * (Math.random()*2 - 1);
        particle.transform.y = this.transform.y + this.positionVariation.y * (Math.random()*2 - 1);
        particle.transform.r = this.transform.r + this.rotationVariation * (Math.random()*2 - 1);
		particle.life = this.baseLife + this.lifeVariation * (Math.random()*2 - 1);
        var direction = new Vector2(Math.cos(this.transform.r), Math.sin(this.transform.r));
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
			this._emitCounter += delta;
			while (!this._isFull() && this._emitCounter > rate) {
				this._addParticle();
				this._emitCounter = 0;
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
    
    constructor(maxParticles, emissionRate) {
        super(CircleParticle2D.prototype.constructor, maxParticles, emissionRate);    
        this.startRadius = 0;
        this.startRadiusVar = 0;
        this.endRadius = 0;
        this.endRadiusVar = 0;
        this.color = [0, 0, 0, 0];
        this.colorVar = [0, 0, 0, 0];
        this.endColor = [0, 0, 0, 0];
        this.endColorVar = [0, 0, 0, 0];
    }
    
    _spawnParticle(particle) {
        super._spawnParticle(particle);
        
        // Set particle size (start and end)
		particle.radius = this.startRadius + this.startRadiusVar * (Math.random()*2 - 1);
        particle.deltaRadius = 0;
        if (this.endRadius) {
            var endradius = this.endRadius + this.endRadiusVar * (Math.random()*2 - 1);
            particle.deltaRadius = (endradius - particle.radius) / particle.life;
        }
       
		// Set particle color
		if (this.color) {
            // Start color
			var sc = [];
			for (var i = 0; i < this.color.length; i++) 
				sc.push(this.color[i] + this.colorVar[i] * (Math.random()*2 - 1));
            
            // End color
			var ec = [];
            for (var i = 0; i < sc.length; i++) ec[i] = sc[i];
			if (this.endColor) {
				for (var i = 0; i < this.endColor.length; i++) 
					ec[i] = this.endColor[i] + this.endColorVar[i] * (Math.random()*2 - 1);
			}
            
            // Set start and calculate deltaColor
			particle.color = sc;
			particle.deltaColor = [];
			for (var i = 0; i < sc.length; i++)
				particle.deltaColor.push((ec[i] - sc[i]) / particle.life);
		}
    }
    
    update(delta) {
        super.update(delta);
    }
    
}