// Advanced 3D Gallery Effects for Americas Adventure

class Gallery3DEffects {
  constructor() {
    this.init();
  }
  
  init() {
    this.enhance3DGallery();
    this.createCubeTransitions();
    this.addVirtualDepth();
    this.implementPhotoStackEffect();
  }
  
  enhance3DGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
      this.make3DPhoto(item, index);
    });
  }
  
  make3DPhoto(item, index) {
    // Add 3D container
    const container = document.createElement('div');
    container.className = 'photo-3d-container';
    container.style.cssText = `
      position: relative;
      transform-style: preserve-3d;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      animation-delay: ${index * 0.1}s;
    `;
    
    // Wrap the existing content
    item.innerHTML = `<div class="photo-3d-wrapper">${item.innerHTML}</div>`;
    const wrapper = item.querySelector('.photo-3d-wrapper');
    wrapper.style.cssText = `
      transform-style: preserve-3d;
      transition: all 0.3s ease;
    `;
    
    // Add depth layers
    this.addDepthLayers(item);
    
    // Mouse interaction
    item.addEventListener('mouseenter', () => {
      this.activatePhoto3D(item);
    });
    
    item.addEventListener('mouseleave', () => {
      this.deactivatePhoto3D(item);
    });
    
    item.addEventListener('mousemove', (e) => {
      this.updatePhoto3D(e, item);
    });
  }
  
  addDepthLayers(item) {
    const layers = 3;
    
    for (let i = 0; i < layers; i++) {
      const layer = document.createElement('div');
      layer.className = `depth-layer depth-layer-${i}`;
      layer.style.cssText = `
        position: absolute;
        top: ${i * 2}px;
        left: ${i * 2}px;
        right: ${-i * 2}px;
        bottom: ${-i * 2}px;
        background: linear-gradient(45deg, 
          rgba(255, 92, 42, ${0.1 - i * 0.03}), 
          rgba(255, 140, 66, ${0.05 - i * 0.02}));
        border-radius: 12px;
        z-index: ${-i - 1};
        transform: translateZ(${-i * 5}px);
        transition: all 0.3s ease;
        opacity: 0;
      `;
      
      item.appendChild(layer);
    }
  }
  
  activatePhoto3D(item) {
    const layers = item.querySelectorAll('.depth-layer');
    const wrapper = item.querySelector('.photo-3d-wrapper');
    
    wrapper.style.transform = 'translateZ(15px) scale(1.05)';
    item.style.zIndex = '100';
    
    layers.forEach((layer, index) => {
      layer.style.opacity = '1';
      layer.style.transform = `translateZ(${-index * 8}px) scale(${1 + index * 0.02})`;
    });
    
    // Add floating effect
    this.addFloatingEffect(item);
  }
  
  deactivatePhoto3D(item) {
    const layers = item.querySelectorAll('.depth-layer');
    const wrapper = item.querySelector('.photo-3d-wrapper');
    
    wrapper.style.transform = 'translateZ(0) scale(1) rotateX(0deg) rotateY(0deg)';
    item.style.zIndex = '';
    
    layers.forEach(layer => {
      layer.style.opacity = '0';
      layer.style.transform = 'translateZ(0) scale(1)';
    });
    
    this.removeFloatingEffect(item);
  }
  
  updatePhoto3D(e, item) {
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 8;
    const rotateY = (centerX - x) / 8;
    
    const wrapper = item.querySelector('.photo-3d-wrapper');
    wrapper.style.transform = `
      translateZ(15px) 
      scale(1.05) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg)
    `;
  }
  
  addFloatingEffect(item) {
    const floatingOrbs = document.createElement('div');
    floatingOrbs.className = 'floating-orbs';
    
    for (let i = 0; i < 5; i++) {
      const orb = document.createElement('div');
      orb.style.cssText = `
        position: absolute;
        width: ${4 + Math.random() * 6}px;
        height: ${4 + Math.random() * 6}px;
        background: radial-gradient(circle, rgba(255, 92, 42, 0.8), transparent);
        border-radius: 50%;
        pointer-events: none;
        animation: floatAround ${3 + Math.random() * 2}s ease-in-out infinite;
        animation-delay: ${Math.random() * 2}s;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        z-index: 10;
      `;
      floatingOrbs.appendChild(orb);
    }
    
    item.appendChild(floatingOrbs);
  }
  
  removeFloatingEffect(item) {
    const floatingOrbs = item.querySelector('.floating-orbs');
    if (floatingOrbs) {
      floatingOrbs.remove();
    }
  }
  
  createCubeTransitions() {
    const filters = document.querySelectorAll('.filter-btn');
    
    filters.forEach(filter => {
      filter.addEventListener('click', () => {
        this.triggerCubeTransition();
      });
    });
  }
  
  triggerCubeTransition() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;
    
    // Add cube flip effect
    galleryGrid.style.transform = 'rotateY(180deg)';
    galleryGrid.style.opacity = '0.3';
    
    setTimeout(() => {
      galleryGrid.style.transform = 'rotateY(0deg)';
      galleryGrid.style.opacity = '1';
    }, 300);
  }
  
  addVirtualDepth() {
    const gallerySection = document.querySelector('.americas-gallery');
    if (!gallerySection) return;
    
    // Create depth background
    const depthBg = document.createElement('div');
    depthBg.className = 'gallery-depth-bg';
    depthBg.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(ellipse at 25% 25%, rgba(255, 92, 42, 0.1), transparent 50%),
        radial-gradient(ellipse at 75% 75%, rgba(255, 140, 66, 0.1), transparent 50%);
      pointer-events: none;
      z-index: -1;
      transform: translateZ(-50px);
    `;
    
    gallerySection.style.position = 'relative';
    gallerySection.style.transformStyle = 'preserve-3d';
    gallerySection.appendChild(depthBg);
  }
  
  implementPhotoStackEffect() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
      // Stagger the initial position
      item.style.transform = `translateZ(${index * 2}px)`;
      item.style.animationDelay = `${index * 0.05}s`;
      
      // Add stack animation on scroll
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.animation = 'stackReveal 0.6s ease-out forwards';
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(item);
    });
  }
}

// Enhanced Lightbox with 3D Effects
class Lightbox3D {
  constructor() {
    this.currentIndex = 0;
    this.images = [];
    this.isOpen = false;
    this.init();
  }
  
  init() {
    this.createLightbox();
    this.bindEvents();
  }
  
  createLightbox() {
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox-3d';
    lightbox.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      z-index: 10000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.4s ease;
      perspective: 1000px;
      transform-style: preserve-3d;
    `;
    
    lightbox.innerHTML = `
      <div class="lightbox-3d-container">
        <div class="lightbox-3d-stage">
          <div class="lightbox-3d-image-container">
            <img class="lightbox-3d-image" src="" alt="">
          </div>
        </div>
        <button class="lightbox-3d-close">×</button>
        <button class="lightbox-3d-prev">‹</button>
        <button class="lightbox-3d-next">›</button>
      </div>
    `;
    
    document.body.appendChild(lightbox);
    this.lightbox = lightbox;
  }
  
  bindEvents() {
    // Gallery item clicks
    document.addEventListener('click', (e) => {
      const galleryItem = e.target.closest('.gallery-item');
      if (galleryItem) {
        e.preventDefault();
        this.open(galleryItem);
      }
    });
    
    // Lightbox controls
    this.lightbox.querySelector('.lightbox-3d-close').addEventListener('click', () => this.close());
    this.lightbox.querySelector('.lightbox-3d-prev').addEventListener('click', () => this.prev());
    this.lightbox.querySelector('.lightbox-3d-next').addEventListener('click', () => this.next());
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      
      switch(e.key) {
        case 'Escape': this.close(); break;
        case 'ArrowLeft': this.prev(); break;
        case 'ArrowRight': this.next(); break;
      }
    });
  }
  
  open(item) {
    this.isOpen = true;
    this.lightbox.style.opacity = '1';
    this.lightbox.style.visibility = 'visible';
    
    // 3D entrance animation
    const container = this.lightbox.querySelector('.lightbox-3d-container');
    container.style.transform = 'translateZ(100px) rotateX(10deg)';
    
    setTimeout(() => {
      container.style.transform = 'translateZ(0) rotateX(0deg)';
    }, 100);
  }
  
  close() {
    this.isOpen = false;
    
    // 3D exit animation
    const container = this.lightbox.querySelector('.lightbox-3d-container');
    container.style.transform = 'translateZ(-100px) rotateX(-10deg)';
    
    setTimeout(() => {
      this.lightbox.style.opacity = '0';
      this.lightbox.style.visibility = 'hidden';
      container.style.transform = 'translateZ(0) rotateX(0deg)';
    }, 200);
  }
  
  prev() {
    this.transition(-1);
  }
  
  next() {
    this.transition(1);
  }
  
  transition(direction) {
    const image = this.lightbox.querySelector('.lightbox-3d-image');
    
    // 3D flip transition
    image.style.transform = `rotateY(${direction * 90}deg)`;
    
    setTimeout(() => {
      // Update image source here
      image.style.transform = `rotateY(${direction * -90}deg)`;
      
      setTimeout(() => {
        image.style.transform = 'rotateY(0deg)';
      }, 50);
    }, 200);
  }
}

// CSS for 3D Gallery Effects
class GalleryCSS3D {
  constructor() {
    this.addStyles();
  }
  
  addStyles() {
    const styles = `
      @keyframes floatAround {
        0%, 100% { 
          transform: translate(0, 0) scale(1); 
          opacity: 0.6; 
        }
        25% { 
          transform: translate(10px, -15px) scale(1.2); 
          opacity: 1; 
        }
        50% { 
          transform: translate(-5px, -25px) scale(0.8); 
          opacity: 0.8; 
        }
        75% { 
          transform: translate(-10px, -10px) scale(1.1); 
          opacity: 0.9; 
        }
      }
      
      @keyframes stackReveal {
        from {
          opacity: 0;
          transform: translateY(30px) rotateX(45deg) translateZ(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0) rotateX(0deg) translateZ(0px);
        }
      }
      
      .gallery-grid {
        perspective: 1200px;
        transform-style: preserve-3d;
        transition: all 0.4s ease;
      }
      
      .gallery-item {
        transform-style: preserve-3d;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        backface-visibility: hidden;
      }
      
      .photo-3d-wrapper {
        border-radius: 12px;
        overflow: hidden;
        position: relative;
      }
      
      .gallery-image {
        transition: all 0.3s ease;
        backface-visibility: hidden;
      }
      
      .lightbox-3d-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 800px;
        transform-style: preserve-3d;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .lightbox-3d-stage {
        position: relative;
        transform-style: preserve-3d;
      }
      
      .lightbox-3d-image-container {
        position: relative;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 
          0 25px 50px rgba(0, 0, 0, 0.5),
          0 10px 25px rgba(255, 92, 42, 0.2);
      }
      
      .lightbox-3d-image {
        width: 100%;
        height: auto;
        transition: all 0.4s ease;
        transform-style: preserve-3d;
        backface-visibility: hidden;
      }
      
      .lightbox-3d-close,
      .lightbox-3d-prev,
      .lightbox-3d-next {
        position: absolute;
        background: rgba(255, 92, 42, 0.8);
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 10001;
        backdrop-filter: blur(10px);
      }
      
      .lightbox-3d-close {
        top: -60px;
        right: 0;
      }
      
      .lightbox-3d-prev {
        top: 50%;
        left: -70px;
        transform: translateY(-50%);
      }
      
      .lightbox-3d-next {
        top: 50%;
        right: -70px;
        transform: translateY(-50%);
      }
      
      .lightbox-3d-close:hover,
      .lightbox-3d-prev:hover,
      .lightbox-3d-next:hover {
        background: rgba(255, 92, 42, 1);
        transform: scale(1.1) translateY(-50%);
        box-shadow: 0 5px 15px rgba(255, 92, 42, 0.4);
      }
      
      .lightbox-3d-close:hover {
        transform: scale(1.1);
      }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }
}

// Initialize Gallery 3D Effects
document.addEventListener('DOMContentLoaded', () => {
  new Gallery3DEffects();
  new Lightbox3D();
  new GalleryCSS3D();
});