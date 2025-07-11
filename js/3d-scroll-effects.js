// Advanced 3D Scroll Effects and Interactive Elements

class ScrollEffect3D {
  constructor() {
    this.observers = [];
    this.ticking = false;
    this.scrollY = 0;
    this.init();
  }
  
  init() {
    this.createObservers();
    this.bindScrollEvents();
    this.enhance3DCards();
    this.createMagneticElements();
  }
  
  createObservers() {
    // Intersection Observer for reveal animations
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          this.triggerElementAnimation(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });
    
    // Observe all animatable elements
    const elements = document.querySelectorAll('.post, .feature-card, .fact-card, .about-timeline, .about-facts');
    elements.forEach(el => {
      el.classList.add('scroll-reveal');
      revealObserver.observe(el);
    });
    
    this.observers.push(revealObserver);
  }
  
  bindScrollEvents() {
    window.addEventListener('scroll', () => {
      this.scrollY = window.pageYOffset;
      if (!this.ticking) {
        requestAnimationFrame(() => {
          this.updateParallaxElements();
          this.ticking = false;
        });
        this.ticking = true;
      }
    });
  }
  
  updateParallaxElements() {
    const parallaxElements = document.querySelectorAll('.parallax-3d');
    
    parallaxElements.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const scrolled = this.scrollY;
      const rate = scrolled * -0.5;
      const yPos = -(rate / (index + 1));
      const rotate = scrolled * 0.01;
      
      element.style.transform = `translate3d(0, ${yPos}px, 0) rotateX(${rotate}deg)`;
    });
  }
  
  triggerElementAnimation(element) {
    const animationType = element.dataset.animation || 'fadeInUp';
    element.style.animation = `${animationType} 0.8s ease-out forwards`;
  }
  
  enhance3DCards() {
    const cards = document.querySelectorAll('.post, .feature-card, .fact-card');
    
    cards.forEach(card => {
      this.make3DInteractive(card);
    });
  }
  
  make3DInteractive(element) {
    element.style.transformStyle = 'preserve-3d';
    element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    
    element.addEventListener('mouseenter', (e) => {
      this.handleCardHover(e.target, true);
    });
    
    element.addEventListener('mouseleave', (e) => {
      this.handleCardHover(e.target, false);
    });
    
    element.addEventListener('mousemove', (e) => {
      this.handleCardMouseMove(e);
    });
  }
  
  handleCardHover(card, isHovering) {
    if (isHovering) {
      card.style.transform = 'translateY(-15px) translateZ(20px) scale(1.02)';
      card.style.boxShadow = '0 25px 50px rgba(255, 92, 42, 0.25), 0 10px 25px rgba(0, 0, 0, 0.2)';
      this.addCardGlow(card);
    } else {
      card.style.transform = 'translateY(0) translateZ(0) scale(1) rotateX(0deg) rotateY(0deg)';
      card.style.boxShadow = '';
      this.removeCardGlow(card);
    }
  }
  
  handleCardMouseMove(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `
      translateY(-15px) 
      translateZ(20px) 
      scale(1.02) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg)
    `;
  }
  
  addCardGlow(card) {
    const glow = document.createElement('div');
    glow.className = 'card-glow';
    glow.style.cssText = `
      position: absolute;
      top: -5px;
      left: -5px;
      right: -5px;
      bottom: -5px;
      background: linear-gradient(45deg, rgba(255, 92, 42, 0.3), rgba(255, 140, 66, 0.2), rgba(255, 184, 77, 0.1));
      border-radius: inherit;
      z-index: -1;
      filter: blur(10px);
      opacity: 0;
      animation: glowPulse 2s ease-in-out infinite;
    `;
    
    card.style.position = 'relative';
    card.appendChild(glow);
  }
  
  removeCardGlow(card) {
    const glow = card.querySelector('.card-glow');
    if (glow) {
      glow.remove();
    }
  }
  
  createMagneticElements() {
    const magneticElements = document.querySelectorAll('.cta, .read-more, .theme-toggle');
    
    magneticElements.forEach(element => {
      this.makeMagnetic(element);
    });
  }
  
  makeMagnetic(element) {
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const moveX = x * 0.3;
      const moveY = y * 0.3;
      
      element.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
    });
    
    element.addEventListener('mouseleave', () => {
      element.style.transform = 'translate(0, 0) scale(1)';
    });
  }
}

// Advanced Particle Trail Effect
class ParticleTrail {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.isMoving = false;
    this.init();
  }
  
  init() {
    this.createCanvas();
    this.bindEvents();
    this.animate();
  }
  
  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'particle-trail';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9999;
    `;
    
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.resize();
  }
  
  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => this.addParticle(e));
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  addParticle(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    
    // Only add particles when mouse is moving
    if (Math.random() < 0.3) {
      this.particles.push(new TrailParticle(this.mouseX, this.mouseY));
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.update();
      particle.draw(this.ctx);
      
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
    
    requestAnimationFrame(() => this.animate());
  }
}

class TrailParticle {
  constructor(x, y) {
    this.x = x + (Math.random() - 0.5) * 10;
    this.y = y + (Math.random() - 0.5) * 10;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.life = 1;
    this.decay = Math.random() * 0.02 + 0.01;
    this.size = Math.random() * 3 + 1;
    this.color = `hsla(${Math.random() * 60 + 15}, 100%, 60%, ${this.life})`;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
    this.size *= 0.98;
  }
  
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// CSS Animations for 3D Effects
class CSS3DAnimations {
  constructor() {
    this.addAnimationStyles();
  }
  
  addAnimationStyles() {
    const styles = `
      .scroll-reveal {
        opacity: 0;
        transform: translateY(50px) rotateX(10deg);
        transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .scroll-reveal.revealed {
        opacity: 1;
        transform: translateY(0) rotateX(0deg);
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translate3d(0, 60px, 0) rotateX(15deg);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0) rotateX(0deg);
        }
      }
      
      @keyframes fadeInLeft {
        from {
          opacity: 0;
          transform: translate3d(-60px, 0, 0) rotateY(15deg);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0) rotateY(0deg);
        }
      }
      
      @keyframes fadeInRight {
        from {
          opacity: 0;
          transform: translate3d(60px, 0, 0) rotateY(-15deg);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0) rotateY(0deg);
        }
      }
      
      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale3d(0.8, 0.8, 0.8) rotateZ(5deg);
        }
        to {
          opacity: 1;
          transform: scale3d(1, 1, 1) rotateZ(0deg);
        }
      }
      
      @keyframes glowPulse {
        0%, 100% {
          opacity: 0.5;
          transform: scale(1);
        }
        50% {
          opacity: 0.8;
          transform: scale(1.05);
        }
      }
      
      @keyframes float {
        0%, 100% {
          transform: translateY(0px) rotateZ(0deg);
        }
        50% {
          transform: translateY(-20px) rotateZ(5deg);
        }
      }
      
      /* Enhanced card hover effects */
      .post, .feature-card, .fact-card {
        transform-style: preserve-3d;
        backface-visibility: hidden;
      }
      
      .post::before, .feature-card::before, .fact-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: inherit;
        background: linear-gradient(45deg, rgba(255, 92, 42, 0.1), rgba(255, 140, 66, 0.05));
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: -1;
      }
      
      .post:hover::before, .feature-card:hover::before, .fact-card:hover::before {
        opacity: 1;
      }
      
      /* 3D perspective for sections */
      .features, .about-timeline, .about-facts {
        perspective: 1000px;
        transform-style: preserve-3d;
      }
      
      /* Magnetic button effects */
      .cta, .read-more, .theme-toggle {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        transform-style: preserve-3d;
      }
      
      .cta:hover, .read-more:hover, .theme-toggle:hover {
        box-shadow: 
          0 10px 25px rgba(255, 92, 42, 0.3),
          0 5px 15px rgba(0, 0, 0, 0.2);
      }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }
}

// Initialize all 3D effects
document.addEventListener('DOMContentLoaded', () => {
  new ScrollEffect3D();
  new ParticleTrail();
  new CSS3DAnimations();
});