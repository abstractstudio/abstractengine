goog.require("engine.Entity2D");

goog.provide("engine.Particle2D");
goog.provide("engine.CircleParticle");
goog.provide("engine.ParticleSystem");
goog.provide("engine.CircleParticleSystem");

const CIRCLE = 69;
const SQUARE = 42;

class Particle2D {
    
    constructor(transform, life) {
        this.transform = transform || new Transform2D();
        this.velocity = new Vector2(0, 0);
        this.acceleration = new Vector2(0, 0);
        
        this.life = life || 0;
        this.alive = true;
    }
    
    update(delta) {
		this.life -= delta;
        
		if (this.life <= 0) {
			this.alive = false;
		} else {
            this.velocity.add(this.acceleration.copy().scale(delta));
			this.transform.position.add(this.velocity.copy().scale(delta));
            console.log(this.pos);
		}
	}
    
    /** User implemented */
    render(context, canvas) {}
}

class CircleParticle extends Particle2D {
    
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
    
    constructor(Particle, maxParticles) {
        super();
        
        this.Particle = Particle || Particle2D.constructor;
        this.maxParticles = maxParticles || 0;

        this.emissionRate = 0;
        this.emitCounter = 0;

        this.duration = 0;
        this.active = false;
        
        this.image = null;

        this.posVar = new Vector2(0, 0); 
        this.rotVar = 0; 

        this.speed = 0; 
        this.speedVar = 0;
        
        this.acceleration = 0;
        this.accelerationVar = 0;

        this.life = 0; 
        this.lifeVar = 0;
        
        this._particlePool = [];
        this._particleCount = 0;
        this._particleIndex = 0;
        
        this.reset();
    }
    
    reset() {
        this._particlePool = [];
		for (var i = 0; i < this.maxParticles; i++) {
			this._particlePool.push(new this.Particle());
		}
		
		this._particleCount = 0;
        this.active = true;
    }
	
	generateParticle() {
		// Initialize particle with transform and life
        var pos = this.transform.position.copy().add(new Vector2(this.posVar.x * (Math.random()*2+1)), this.posVar.y * (Math.random()*2+1));
        var rot = this.rot + this.rotVar * (Math.random()*2+1);
        var transform = new Transform(pos, rot);
		var particle = new this.Particle(transform, this.life + this.lifeVar * (Math.random()*2+1));
		
		// Set velocity and acceleration
		var speed = this.speed + this.speedVar * (Math.random()*2+1);
		particle.velocity = new Vector2(speed * Math.cos(rot), speed * Math.sin(rot));
        var accel = this.acceleration + this.accelerationVar * (Math.random()*2+1);
		particle.acceleration = new Vector2(accel * Math.cos(rot), accel * Math.sin(rot));

		return particle;
	}
	
	_addParticle() {
		if (this._isFull()) return false;
		
		this._particlePool[this._particleCount++] = this.generateParticle();
		
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
    
	render(context, canvas) {
		for (var i = 0; i < this._particleCount; i++) {
			var particle = this._particlePool[i];
			if (particle.alive) {
                particle.render(context, canvas);
			}
		}
	}
}

class CircleParticleSystem extends ParticleSystem2D {
    constructor(maxParticles) {
        super(CircleParticle.constructor, maxParticles);
        
        this.startRadius = 0;
        this.endRadius = 0;
        
        this.startColor = [0, 0, 0, 0];
        this.endColor = [0, 0, 0, 0];
    }
    
    genParticle() {
        var particle = super.genParticle();
        
        // Set particle size (start and end)
		particle.radius = this.startRadius + this.startRadiusVar * (Math.random()*2+1);
        if (this.endRadius) {
            var endradius = this.endRadius + this.endRadiusVar * (Math.random()*2+1);
            particle.deltaRadius = (endradius - particle.radius) / particle.life;
        }
		
		// Set particle color
		if (this.startColor) {
            // Start color
			var sc = [];
			for (var i = 0; i < this.startColor.length; i++) 
				sc.push(this.startColor[i] + this.startColorVar[i] * (Math.random()*2+1));
            
            // End color
			var ec = [];
            for (var i = 0; i < sc.length; i++) ec[i] = sc[i];
			if (this.endColor) {
				for (var i = 0; i < this.endColor.length; i++) 
					ec[i] = this.endColor[i] + this.endColorVar[i] * (Math.random()*2+1);
			}
            
            // Set start and calculate deltaColor
			particle.color = sc;
			particle.deltaColor = [];
			for (var i = 0; i < sc.length; i++)
				particle.deltaColor.push((ec[i] - sc[i]) / particle.life);
		}
        
        return particle;
    }
}