goog.require("engine.Vector2D");
goog.require("engine.Entity2D");

goog.provide("engine.Particle2D");
goog.provide("engine.ParticleEmitter");

const CIRCLE = 69;
const SQUARE = 42;

class Particle2D {
    
    constructor(pos, life) {
        this.pos = pos || new Vector2(0, 0);
        this.vel = new Vector(0, 0);
        
        this.rot = 0;
        
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
		for (var i = 0; i < this.color.length; i++)
			this.color[i] += this.deltaColor[i] * delta;
		
		if (this.life <= 0) {
			this.alive = false;
		} else {
			this.pos.add(this.velocity.copy().scale(delta));
		}
	}
    
    /** User implemented */
    render(context, canvas) {}
    
    /** Draws a circle with the particle's properties.
	_render(context, canvas) {
        /** Center the context. 
        context.save();
        context.translate(this.pos.x, this.pos.y);
        context.rotate(-this.rot);

        /* Draw
        this.render(context, canvas);

        /* Restore the context. 
        context.restore();
	}
    */
}

class ParticleSystem2D extends Entity2D {
    
    constructor(transform, particleType) {
        this.particlePool = [];	
        this.totalParticles = 0;
        this.particleCount = 0;
        this.particleIndex = 0;
        this.ParticleType = particleType;

        this.emissionRate = 0;
        this.emitCounter = 0;

        this.active = false;
        this.duration = 0;
        
        this.transform = transform;

        /* Particle properties. */
        this.properties = {
            image: null, 

            pos: new Vector(transform.position.x, transform.positiony), 
            posVar: new Vector(0, 0), 

            speed: 0, 
            speedVar: 0, 

            rot: transform.rotation, 
            rotVar: 0, 

            life: 0, 
            lifeVar: 0, 

            startRadius: 0, 
            startRadiusVar: 0, 
            endRadius: 0, 
            endRadiusVar: 0, 

            startColor: [], 
            startColorVar: [0, 0, 0, 0], 
            endColor: [], 
            endColorVar: [0, 0, 0, 0]
        }
        
        this.particlePool = [];
		for (var i = 0; i < this.totalParticles; i++) {
			this.particlePool.push(new Particle());
		}
		
		this.particleCount = 0;
        this.active = true;
    }
    
    setProperties(properties) {
        for (var prop in properties) {
            this.properties[prop] = properties[prop];
        }
    }
	
	_resetParticle() {
		// Initialize particle with position and life
        var x = this.properties.pos.x + this.properties.posVar.x*this._rand();
        var y = this.properties.pos.y + this.properties.posVar.y*this._rand();
		var particle = new this.ParticleType(x, y, this.properties.life + this.properties.lifeVar*this._rand());
		
		// Set particle rotation and velocity
		particle.rot = this.properties.rot + this.properties.rotVar*this._rand();
		var speed = this.properties.speed + this.properties.speedVar*this._rand();
		particle.velocity = new Vector(speed * Math.cos(particle.rot), speed * Math.sin(particle.rot));
		
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
		
		this.particlePool[this.particleCount++] = this._resetParticle();
		
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
		
		this.particleIndex = 0;
		while (this.particleIndex < this.particleCount) {
			var particle = this.particlePool[this.particleIndex];
			particle = this._updateParticle(delta, particle, this.particleIndex);
		}
	}
	
	_updateParticle(delta, particle, index) {
		if (particle.alive) {
			particle.update(delta);
			this.particleIndex++;
		} else {
            var t = this.particlePool[index];
            this.particlePool[index] = this.particlePool[this.particleCount - 1];
            this.particlePool[this.particleCount - 1] = t;
			this.particleCount--;
		}
		
		return particle;
	}
	
	_isFull() {
		return this.particleCount === this.totalParticles;
	}
	
	_rand() {
		return Math.random() * 2 - 1;
	}
	
	render(context, canvas) {
		for (var i = 0; i < this.particleCount; i++) {
			var particle = this.particlePool[i];
			if (particle.alive) {
                particle.render(context, canvas);
			}
		}
	}
}