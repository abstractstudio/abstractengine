goog.require("engine.Vector2D");
goog.require("engine.Entity2D");

goog.provide("engine.Particle2D");
goog.provide("engine.ParticleEmitter");

const CIRCLE = 69;
const SQUARE = 42;

class Particle2D {
    
    constructor(transform, life) {
        this.transform = transform || new Transform();
        this.velocity = new Vector(0, 0);
        
        this.life = life || 0;
        this.alive = true;
        
        this.radius = 0;
        this.color = [];
        
        this.deltaRadius = 0;
        this.deltaColor = [];
    }
    
    update(delta) {
		this.life -= delta;
		this.radius += this.deltaRadius * delta;
		
		
		if (this.life <= 0) {
			this.alive = false;
		} else {
			this.pos.add(this.velocity.copy().scale(delta));
		}
	}
    
    /** User implemented */
    render(context, canvas) {}
}

class CircleParticle {
    
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
        /* Center the context. */
        context.save();
        context.translate(this.pos.x, this.pos.y);
        context.rotate(-this.rot);
        
        context.fillStyle = color;

        /* Draw. */
        context.beginPath();
        context.arc(this.transform.position.x, this.transform.position.y, this.radius, 0, 2*Math.PI);
        context.stroke();

        /* Restore the context. */
        context.restore();
    }
}

class ParticleSystem2D extends Entity2D {
    
    constructor(particleType) {
        this.maxParticles = 0;
        this.ParticleType = particleType;

        this.emissionRate = 0;
        this.emitCounter = 0;

        this.duration = 0;
        this.active = false;
        
        this.image = null;
        
        this.transform = new Transform();
        this.posVar = new Vector(0, 0); 
        this.rotVar = 0; 

        this.speed = 0; 
        this.speedVar = 0; 

        this.life = 0; 
        this.lifeVar = 0;
        
        this._particlePool = [];
        this._particleCount = 0;
        this._particleIndex = 0;
        
        reset();
    }
    
    reset() {
        this._particlePool = [];
		for (var i = 0; i < this.maxParticles; i++) {
			this._particlePool.push(new this.ParticleType());
		}
		
		this._particleCount = 0;
        this.active = true;
    }
	
	_resetParticle() {
		// Initialize particle with transform and life
        var pos = new Vector2(this.transform.position.x + this.posVar.x*this._rand(), 
                              this.transform.position.y + this.posVar.y*this._rand());
        var rot = this.rot + this.rotVar*this._rand();
        var transform = new Transform(pos, rot);
		var particle = new this.ParticleType(transform, this.life + this.lifeVar*this._rand());
		
		// Set velocity
		var speed = this.speed + this.speedVar*this._rand();
		particle.velocity = new Vector2(speed * Math.cos(rot), speed * Math.sin(rot));
		
		// Set particle size (start and end)
		particle.radius = this.properties.startRadius + this.properties.startRadiusVar*this._rand();
        if (this.properties.endRadius) {  
            var endradius = this.properties.endRadius + this.properties.endRadiusVar*this._rand();
            particle.deltaRadius = (endradius - particle.radius) / particle.life;
        }
		
		// Set particle color (start and end)
		if (this.properties.startColor) {
			var sc = [];
			for (var i = 0; i < this.properties.startColor.length; i++) 
				sc.push(this.properties.startColor[i] + this.properties.startColorVar[i]*this._rand());
            
			var ec = [];
            for (var i = 0; i < sc.length; i++) ec[i] = sc[i];
			if (this.properties.endColor) {
				for (var i = 0; i < this.properties.endColor.length; i++) 
					ec[i] = this.properties.endColor[i] + this.properties.endColorVar[i]*this._rand();
			}
            
			particle.color = sc;
			particle.deltaColor = [];
			for (var i = 0; i < sc.length; i++)
				particle.deltaColor.push((ec[i] - sc[i]) / particle.life);
		}

		return particle;
	}
	
	_addParticle() {
		if (this._isFull()) return false;
		
		this._particlePool[this._particleCount++] = this._resetParticle();
		
		return true;
	}
	
	update(delta) {
		if (!this.active) return;
        
		if (this.emissionRate) {
			var rate = 1.0 / this.emissionRate;
			this.emitCounter += delta;
            
			while (!this._isFull() && this.emitCounter > rate) {
				this._addParticle();
				this.emitCounter = 0;
			}
		}
		
		this._particleIndex = 0;
		while (this._particleIndex < this._particleCount) {
			var particle = this._particlePool[this._particleIndex];
			particle = this._updateParticle(delta, particle, this._particleIndex);
		}
	}
	
	_updateParticle(delta, particle, index) {
		if (particle.alive) {
			particle.update(delta);
			this._particleIndex++;
		} else {
            var t = this._particlePool[index];
            this._particlePool[index] = this._particlePool[this._particleCount - 1];
            this._particlePool[this._particleCount - 1] = t;
			this._particleCount--;
		}
		
		return particle;
	}
	
	_isFull() {
		return this._particleCount === this.maxParticles;
	}
	
	_rand() {
		return Math.random() * 2 - 1;
	}
	
	render(context, canvas) {
		for (var i = 0; i < this._particleCount; i++) {
			var particle = this._particlePool[i];
			if (particle.alive) {
                particle.render(context, canvas);
			}
		}
	}
}