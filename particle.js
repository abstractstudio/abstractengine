function Particle(x, y, life) {
	this.pos = new Vector(x, y) || (new Vector(0, 0));
	this.vel = new Vector(0, 0);
	
	this.alive = true;
	
	this.life = life || 0;
	this.radius = 0;
	this.color = [];
	
	this.deltaRadius = 0;
	this.deltaColor = [];
	
	this.update = function(delta) {
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
	
	/** Draws a circle with the particle's properties. */
	this.render = function(context) {
		var color = 'rgba(' + this.color[0] + ', ' + this.color[1] + ', ' + this.color[2] + ', ' + this.color[3] + ')';
        
		context.fillStyle = color;
		
       /* context.beginPath();
		context.arc(this.pos.x, this.pos.y, Math.max(this.radius, 0), 0, 2*Math.PI, true);
		context.closePath();
		context.fill();*/
        context.fillRect(this.pos.x - this.radius, this.pos.y - this.radius, this.radius * 2, this.radius * 2);
	}
	
}

function ParticleSystem(x, y) {
	this.particlePool = [];	
	this.totalParticles = 0;
	this.particleCount = 0;
	this.particleIndex = 0;
	
	this.emissionRate = 0;
	this.emitCounter = 0;

	this.active = false;
	this.duration = 0;
	
	/* Particle properties. */
    this.properties = {
        pos: new Vector(x, y), 
        posVar: new Vector(0, 0), 

        speed: 0, 
        speedVar: 0, 

        angle: 0, 
        angleVar: 0, 

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
    
    this.setProperties = function(properties) {
        for (var prop in properties) {
            this.properties[prop] = properties[prop];
        }
    }
	
	
	this.init = function() {
		this.particlePool = [];
		for (var i = 0; i < this.totalParticles; i++) {
			this.particlePool.push(new Particle());
		}
		
		this.particleCount = 0;
        this.active = true;
	}
	
	this.resetParticle = function() {
		// Initialize particle with position and life
        var x = this.properties.pos.x + this.properties.posVar.x*this.rand();
        var y = this.properties.pos.y + this.properties.posVar.y*this.rand();
		var particle = new Particle(x, y, this.properties.life + this.properties.lifeVar*this.rand());
		
		// Set particle velocity
		var angle = this.properties.angle + this.properties.angleVar*this.rand();
		var speed = this.properties.speed + this.properties.speedVar*this.rand();
		particle.velocity = new Vector(speed * Math.cos(angle), speed * Math.sin(angle));
		
		// Set particle size (start and end)
		particle.radius = this.properties.startRadius + this.properties.startRadiusVar*this.rand();
        if (this.properties.endRadius) {  
            var endradius = this.endRadius + this.endRadiusVar*this.rand();
            particle.deltaRadius = (endradius - particle.radius) / particle.life;
        }
		
		// Set particle color (start and end)
		if (this.properties.startColor) {
			var sc = [];
			for (var i = 0; i < this.properties.startColor.length; i++) 
				sc.push(this.properties.startColor[i] + this.properties.startColorVar[i]*this.rand());
            
			var ec = [];
            for (var i = 0; i < sc.length; i++) ec[i] = sc[i];
			if (this.properties.endColor) {
				for (var i = 0; i < this.properties.endColor.length; i++) 
					ec[i] = this.properties.endColor[i] + this.properties.endColorVar[i]*this.rand();
			}
            
			particle.color = sc;
			particle.deltaColor = [];
			for (var i = 0; i < sc.length; i++)
				particle.deltaColor.push((ec[i] - sc[i]) / particle.life);
		}

		return particle;
	}
	
	this.addParticle = function() {
		if (this.isFull()) return false;
		
		this.particlePool[this.particleCount++] = this.resetParticle();
		
		return true;
	}
	
	this.update = function(delta) {
		if (!this.active) return;
        
		if (this.emissionRate) {
			var rate = 1.0 / this.emissionRate;
			this.emitCounter += delta;
            
			while (!this.isFull() && this.emitCounter > rate) {
				this.addParticle();
				this.emitCounter = 0;
			}
		}
		
		this.particleIndex = 0;
		
		while (this.particleIndex < this.particleCount) {
			var particle = this.particlePool[this.particleIndex];
			particle = this.updateParticle(delta, particle, this.particleIndex);
		}
	}
	
	this.updateParticle = function(delta, particle, index) {
		if (particle.alive) {
			particle.update(delta);
			this.particleIndex++;
		} else {
            this.swapParticles(index, this.particleCount - 1);
			this.particleCount--;
		}
		
		return particle;
	}
    
    this.swapParticles = function(i, j) {
        var t = this.particlePool[i];
        this.particlePool[i] = this.particlePool[j];
        this.particlePool[j] = t;
    }
	
	this.isFull = function() {
		return this.particleCount === this.totalParticles;
	}
	
	this.rand = function() {
		return Math.random() * 2 - 1;
	}
	
	this.render = function(context) {
		for (var i = 0; i < this.particleCount; i++) {
			var particle = this.particlePool[i];
			if (particle.alive && particle.color) {
				particle.render(context);
			}
		}
	}
}