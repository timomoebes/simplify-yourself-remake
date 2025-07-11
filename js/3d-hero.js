// Advanced 3D Hero Background with Particle System and Interactive Elements

class ParticleSystem3D {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.scrollY = 0;
    this.time = 0;
    this.animationId = null;
    
    this.config = {
      particleCount: 25,
      maxDistance: 120,
      baseSpeed: 0.3,
      mouseInfluence: 60,
      colorPalette: [
        'rgba(255, 92, 42, 0.4)',
        'rgba(255, 140, 66, 0.3)',
        'rgba(255, 184, 77, 0.2)',
        'rgba(255, 255, 255, 0.1)'
      ]
    };
    
    this.init();
  }
  
  init() {
    this.createCanvas();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }
  
  createCanvas() {
    // Remove existing canvas
    const existing = document.getElementById('particle-canvas');
    if (existing) existing.remove();
    
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'particle-canvas';
    this.canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
    `;
    
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      heroSection.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
      this.resize();
    }
  }
  
  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push(new Particle3D(this.canvas.width, this.canvas.height, this.config));
    }
  }
  
  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => this.updateMouse(e));
    window.addEventListener('scroll', () => this.updateScroll());
  }
  
  resize() {
    if (!this.canvas) return;
    
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    
    // Recreate particles for new dimensions
    this.createParticles();
  }
  
  updateMouse(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;
  }
  
  updateScroll() {
    this.scrollY = window.pageYOffset;
  }
  
  animate() {
    this.time += 0.01;
    this.clearCanvas();
    this.updateParticles();
    this.drawConnections();
    this.drawParticles();
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  updateParticles() {
    this.particles.forEach(particle => {
      particle.update(this.mouseX, this.mouseY, this.scrollY, this.time);
    });
  }
  
  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
        
        if (distance < this.config.maxDistance) {
          const opacity = (1 - distance / this.config.maxDistance) * 0.4;
          this.ctx.strokeStyle = `rgba(255, 92, 42, ${opacity})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }
  }
  
  drawParticles() {
    this.particles.forEach(particle => particle.draw(this.ctx));
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.canvas) {
      this.canvas.remove();
    }
  }
}

class Particle3D {
  constructor(canvasWidth, canvasHeight, config) {
    this.config = config;
    this.reset(canvasWidth, canvasHeight);
    this.z = Math.random() * 1000;
    this.originalX = this.x;
    this.originalY = this.y;
  }
  
  reset(canvasWidth, canvasHeight) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.vx = (Math.random() - 0.5) * this.config.baseSpeed;
    this.vy = (Math.random() - 0.5) * this.config.baseSpeed;
    this.size = Math.random() * 4 + 1;
    this.color = this.config.colorPalette[Math.floor(Math.random() * this.config.colorPalette.length)];
    this.pulse = Math.random() * Math.PI * 2;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }
  
  update(mouseX, mouseY, scrollY, time) {
    // Mouse influence
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < this.config.mouseInfluence) {
      const force = (this.config.mouseInfluence - distance) / this.config.mouseInfluence;
      this.vx -= (dx / distance) * force * 0.3;
      this.vy -= (dy / distance) * force * 0.3;
    }
    
    // Apply 3D rotation effect
    this.z += Math.sin(time + this.pulse) * 2;
    const scale = (1000 + this.z) / 1000;
    
    // Scroll parallax effect
    const scrollInfluence = scrollY * 0.1;
    this.y += scrollInfluence * 0.001;
    
    // Update position
    this.x += this.vx * scale;
    this.y += this.vy * scale;
    
    // Damping
    this.vx *= 0.99;
    this.vy *= 0.99;
    
    // Boundary wrapping with smooth transition
    if (this.x < -10) this.x = this.canvasWidth + 10;
    if (this.x > this.canvasWidth + 10) this.x = -10;
    if (this.y < -10) this.y = this.canvasHeight + 10;
    if (this.y > this.canvasHeight + 10) this.y = -10;
    
    // Update pulse
    this.pulse += 0.02;
  }
  
  draw(ctx) {
    const scale = (1000 + this.z) / 1000;
    const finalSize = this.size * scale;
    const pulseFactor = Math.sin(this.pulse) * 0.3 + 0.7;
    
    // Glow effect
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 15 * scale;
    
    // Draw particle
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, finalSize * pulseFactor, 0, Math.PI * 2);
    ctx.fill();
    
    // Reset shadow
    ctx.shadowBlur = 0;
  }
}

// Floating 3D Elements
class Floating3DElements {
  constructor() {
    this.elements = [];
    this.init();
  }
  
  init() {
    this.createFloatingOrbs();
    this.createGeometricShapes();
  }
  
  createFloatingOrbs() {
    const orbCount = 2;
    for (let i = 0; i < orbCount; i++) {
      const orb = document.createElement('div');
      orb.className = 'floating-orb';
      orb.style.cssText = `
        position: absolute;
        width: ${60 + Math.random() * 40}px;
        height: ${60 + Math.random() * 40}px;
        background: radial-gradient(circle at 30% 30%, rgba(255, 140, 66, 0.3), rgba(255, 92, 42, 0.1));
        border-radius: 50%;
        pointer-events: none;
        z-index: 2;
        animation: float3D ${12 + Math.random() * 6}s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
        filter: blur(2px);
        transform: translate3d(0, 0, 0);
      `;
      
      orb.style.left = Math.random() * 80 + '%';
      orb.style.top = Math.random() * 80 + '%';
      
      const heroSection = document.querySelector('.hero');
      if (heroSection) {
        heroSection.appendChild(orb);
        this.elements.push(orb);
      }
    }
  }
  
  createGeometricShapes() {
    const shapes = ['diamond'];
    
    shapes.forEach((shape, index) => {
      const element = document.createElement('div');
      element.className = `floating-shape floating-${shape}`;
      element.style.cssText = `
        position: absolute;
        width: 30px;
        height: 30px;
        pointer-events: none;
        z-index: 2;
        animation: rotate3D ${15 + index * 3}s linear infinite;
        animation-delay: ${index * 2}s;
        transform: translate3d(0, 0, 0);
      `;
      
      element.style.left = Math.random() * 90 + '%';
      element.style.top = Math.random() * 90 + '%';
      
      // Shape-specific styling
      if (shape === 'diamond') {
        element.style.background = 'linear-gradient(45deg, rgba(255, 140, 66, 0.2), rgba(255, 184, 77, 0.1))';
        element.style.transform += ' rotate(45deg)';
      }
      
      const heroSection = document.querySelector('.hero');
      if (heroSection) {
        heroSection.appendChild(element);
        this.elements.push(element);
      }
    });
  }
  
  destroy() {
    this.elements.forEach(element => element.remove());
    this.elements = [];
  }
}

// Initialize 3D Hero Effects
class Hero3DManager {
  constructor() {
    this.particleSystem = null;
    this.floatingElements = null;
    this.init();
  }
  
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }
  
  setup() {
    this.addStyles();
    this.particleSystem = new ParticleSystem3D();
    this.floatingElements = new Floating3DElements();
    this.enhanceHeroContent();
  }
  
  addStyles() {
    const styles = `
      @keyframes float3D {
        0%, 100% { 
          transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg); 
        }
        25% { 
          transform: translate3d(10px, -20px, 10px) rotateX(5deg) rotateY(10deg); 
        }
        50% { 
          transform: translate3d(-5px, -40px, 20px) rotateX(-5deg) rotateY(-5deg); 
        }
        75% { 
          transform: translate3d(-15px, -20px, 10px) rotateX(10deg) rotateY(-10deg); 
        }
      }
      
      @keyframes rotate3D {
        0% { 
          transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) rotateZ(0deg); 
        }
        100% { 
          transform: translate3d(0, 0, 0) rotateX(360deg) rotateY(360deg) rotateZ(360deg); 
        }
      }
      
      @keyframes heroGlow {
        0%, 100% { 
          text-shadow: 0 0 10px rgba(255, 92, 42, 0.2);
        }
        50% { 
          text-shadow: 0 0 20px rgba(255, 92, 42, 0.3);
        }
      }
      
      .hero {
        perspective: 1000px;
        transform-style: preserve-3d;
      }
      
      .hero-content {
        animation: heroGlow 6s ease-in-out infinite;
        transform: translateZ(15px);
      }
      
      .floating-orb {
        box-shadow: 
          0 0 15px rgba(255, 92, 42, 0.2),
          inset 0 0 10px rgba(255, 255, 255, 0.05);
      }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }
  
  enhanceHeroContent() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      // Add subtle depth and interaction
      heroContent.style.transform = 'translateZ(15px)';
      heroContent.style.transition = 'all 0.3s ease';
      
      // Subtle mouse interaction
      heroContent.addEventListener('mouseenter', () => {
        heroContent.style.transform = 'translateZ(25px) scale(1.01)';
      });
      
      heroContent.addEventListener('mouseleave', () => {
        heroContent.style.transform = 'translateZ(15px) scale(1)';
      });
    }
  }
  
  destroy() {
    if (this.particleSystem) this.particleSystem.destroy();
    if (this.floatingElements) this.floatingElements.destroy();
  }
}

// Auto-initialize
new Hero3DManager();