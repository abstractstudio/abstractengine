goog.require("engine.Entity2D");

goog.provide("engine.Particle2D");
goog.provide("engine.CircleParticle");
goog.provide("engine.ParticleSystem");
goog.provide("engine.CircleParticleSystem");

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
       // console.log("Updating");
        
		if (this.life <= 0) {
			this.alive = false;
		} else {
            this.velocity.add(this.acceleration.copy().scale(delta/16));
			this.transform.position.add(this.velocity.copy().scale(delta/16));
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
        context.translate(this.transform.x, this.transform.y);
        context.rotate(-this.rot);
        
        context.fillStyle = "rgba(" + this.color.join(",") + ")";
        
        /* Draw. */
        context.beginPath();
        context.arc(this.transform.x, this.transform.y, this.radius, 0, 2*Math.PI);
        context.fill();

        /* Restore the context. */
        context.restore();
    }
}

class ParticleSystem2D extends Entity2D {
    
    constructor(Particle, maxParticles, emissionRate) {
        super();
        
        this.Particle = Particle || Particle2D.prototype.constructor;
        this.maxParticles = maxParticles || 0;

        this.emissionRate = emissionRate || 0;
        this._emitCounter = 0;

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
        
        this.reset();
    }
    
    reset() {
		for (var i = 0; i < this.maxParticles; i++) {
			this._particlePool[i] = new this.Particle();
		}	
		this._particleCount = 0;
    }
    
    start() {
        this.active = true;
    }
    
    stop() {
        this.active = false;
    }
	
	resetParticle(particle) {
		// Initialize particle with transform and life
        particle.transform.position = this.transform.position.copy().add(new Vector2(this.posVar.x * (Math.random()*2+1)), this.posVar.y * (Math.random()*2+1));
        particle.transform.rotation = this.transform.r + this.rotVar * (Math.random()*2+1);
		particle.life = this.life + this.lifeVar * (Math.random()*2+1);
		
		// Set velocity and acceleration
		var speed = this.speed + this.speedVar * (Math.random()*2+1);
		particle.velocity = new Vector2(speed * Math.cos(this.transform.r), speed * Math.sin(this.transform.r));
        var accel = this.acceleration + this.accelerationVar * (Math.random()*2+1);
		particle.acceleration = new Vector2(accel * Math.cos(this.transform.r), accel * Math.sin(this.transform.r));
	}
	
	_addParticle() {
		if (this._isFull()) return;
        
        this.resetParticle(this._particlePool[this._particleCount]);
        this._particlePool[this._particleCount].alive = true;
        this._particleCount++;
	}
	
	update(delta) {
        //console.log("start");
		if (!this.active) return;
        
		if (this.emissionRate) {
			var rate = 1.0 / this.emissionRate;
			this._emitCounter += delta;
            
			while (!this._isFull() && this._emitCounter > rate) {
				this._addParticle();
				this._emitCounter = 0;
			}
		}
		
		var index = 0;
        //console.log(this._particleCount);
		while (index < this._particleCount) {
			var particle = this._particlePool[index];
			//console.log(particle.transform.position);
            if (particle.alive) {
                particle.update(delta);
                index++;
            } else {
                var t = this._particlePool[index];
                this._particlePool[index] = this._particlePool[this._particleCount - 1];
                this._particlePool[this._particleCount - 1] = t;
                this._particleCount--;
            }
		}
	}
	
	_isFull() {
		return this._particleCount === this.maxParticles;
	}
    
	render(context, canvas) {
		for (var i = 0; i < this._particleCount; i++) {
			var particle = this._particlePool[i];
			particle.render(context, canvas);
		}
	}
}

class CircleParticleSystem extends ParticleSystem2D {
    constructor(maxParticles, emissionRate) {
        super(CircleParticle.prototype.constructor, maxParticles, emissionRate);
        
        this.startRadius = 0;
        this.startRadiusVar = 0;
        this.endRadius = 0;
        this.endRadiusVar = 0;
        
        this.color = [0, 0, 0, 0];
        this.colorVar = [0, 0, 0, 0];
        this.endColor = [0, 0, 0, 0];
        this.endColorVar = [0, 0, 0, 0];
    }
    
    resetParticle(particle) {
        super.resetParticle(particle);
        
        // Set particle size (start and end)
		particle.radius = this.startRadius + this.startRadiusVar * (Math.random()*2+1);
        particle.deltaRadius = 0;
        if (this.endRadius) {
            var endradius = this.endRadius + this.endRadiusVar * (Math.random()*2+1);
            particle.deltaRadius = (endradius - particle.radius) / particle.life;
        }
       
		// Set particle color
		if (this.color) {
            // Start color
			var sc = [];
			for (var i = 0; i < this.color.length; i++) 
				sc.push(this.color[i] + this.colorVar[i] * (Math.random()*2+1));
            
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
    }
    
    update(delta) {
        super.update(delta);
    }
}