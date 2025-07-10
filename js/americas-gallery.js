// Americas Adventure Photo Gallery
// Interactive photo gallery for displaying Timo's 14-month Americas journey

class AmericasGallery {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container with id "${containerId}" not found.`);
      return;
    }
    
    this.photosData = null;
    this.currentFilter = 'all';
    this.currentPage = 1;
    this.photosPerPage = 12;
    this.lightboxOpen = false;
    this.currentLightboxIndex = 0;
    
    this.init();
  }
  
  async init() {
    try {
      const response = await fetch('assets/images/americas-adventure/photos-data.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      this.photosData = await response.json();
      
      this.createGalleryStructure();
      this.renderFilters();
      this.renderPhotos();
      this.bindEvents();
      
      console.log(`Loaded ${this.photosData.journey.totalPhotos} photos from Americas adventure`);
    } catch (error) {
      console.error('Error loading Americas photos:', error);
      this.container.innerHTML = `
        <div style="color: #ff5c2a; padding: 2rem; text-align: center;">
          <h3>Unable to load Americas adventure photos</h3>
          <p>Error: ${error.message}</p>
        </div>
      `;
    }
  }
  
  createGalleryStructure() {
    this.container.innerHTML = `
      <div class="americas-gallery">
        <div class="gallery-header">
          <h2 class="gallery-title">${this.photosData.journey.title}</h2>
          <p class="gallery-description">${this.photosData.journey.description}</p>
          <div class="gallery-stats">
            <span class="stat">${this.photosData.journey.totalPhotos} Photos</span>
            <span class="stat">${this.photosData.journey.totalVideos} Videos</span>
            <span class="stat">14 Months</span>
          </div>
        </div>
        
        <div class="gallery-filters"></div>
        <div class="gallery-timeline">
          <div class="timeline-months"></div>
        </div>
        
        <div class="gallery-grid"></div>
        
        <div class="gallery-pagination">
          <button class="pagination-btn" id="prev-page" disabled>Previous</button>
          <span class="page-info"></span>
          <button class="pagination-btn" id="next-page">Next</button>
        </div>
        <button id="load-more-btn">Load More</button>
      </div>
      
      <div class="lightbox" id="photo-lightbox">
        <div class="lightbox-overlay"></div>
        <div class="lightbox-content">
          <button class="lightbox-close">&times;</button>
          <img class="lightbox-image" src="" alt="">
          <div class="lightbox-info">
            <h3 class="lightbox-title"></h3>
            <p class="lightbox-caption"></p>
            <div class="lightbox-meta">
              <span class="lightbox-date"></span>
              <span class="lightbox-location"></span>
            </div>
          </div>
          <button class="lightbox-nav lightbox-prev">&#8249;</button>
          <button class="lightbox-nav lightbox-next">&#8250;</button>
        </div>
      </div>
    `;
  }
  
  renderFilters() {
    const filtersContainer = this.container.querySelector('.gallery-filters');
    const timelineContainer = this.container.querySelector('.timeline-months');
    
    // Main category filters
    const categories = ['All', ...Object.keys(this.photosData.categories)];
    filtersContainer.innerHTML = categories.map(category => `
      <button class="filter-btn ${category === 'All' ? 'active' : ''}" data-filter="${category.toLowerCase()}">
        ${category}
      </button>
    `).join('');
    
    // Monthly timeline filters
    const months = Object.keys(this.photosData.monthlyPosts).sort();
    timelineContainer.innerHTML = months.map(month => {
      const [year, monthNum] = month.split('-');
      const monthName = new Date(year, monthNum - 1).toLocaleDateString('en', { month: 'short' });
      const postCount = this.photosData.monthlyPosts[month].length;
      
      return `
        <div class="timeline-month" data-month="${month}">
          <div class="month-label">${monthName} ${year}</div>
          <div class="month-count">${postCount} posts</div>
        </div>
      `;
    }).join('');
  }
  
  getFilteredPhotos() {
    let photos = [...this.photosData.posts];
    
    if (this.currentFilter !== 'all') {
      if (this.currentFilter.includes('-')) { // Month filter
        photos = photos.filter(photo => photo.month === this.currentFilter);
      } else { // Category filter
        photos = photos.filter(photo => photo.category.toLowerCase() === this.currentFilter);
      }
    }
    
    return photos.filter(photo => !photo.isVideo);
  }
  
  renderPhotos(newFilter = false) {
    const photos = this.getFilteredPhotos();
    const startIndex = (this.currentPage - 1) * this.photosPerPage;
    const pagePhotos = photos.slice(0, startIndex + this.photosPerPage);
    
    const grid = this.container.querySelector('.gallery-grid');
    if (newFilter) {
        grid.innerHTML = '';
    }
    
    grid.innerHTML = pagePhotos.map((photo, index) => `
      <div class="gallery-item" data-index="${index}">
        <div class="gallery-image-container">
          <img class="gallery-image" 
               src="${photo.fullPath}" 
               alt="${this.truncateText(photo.caption, 100)}"
               loading="lazy">
          <div class="gallery-overlay">
            <div class="gallery-overlay-content">
              <div class="gallery-date">${this.formatDate(photo.date)}</div>
              <div class="gallery-caption">${this.truncateText(photo.caption, 80)}</div>
              ${photo.coordinates ? `<div class="gallery-location">📍 ${this.formatLocation(photo.coordinates)}</div>` : ''}
            </div>
          </div>
        </div>
      </div>
    `).join('');
    
    this.updatePagination(photos.length);
  }
  
  updatePagination(totalPhotos) {
    const totalPages = Math.ceil(totalPhotos / this.photosPerPage);
    const pageInfo = this.container.querySelector('.page-info');
    const prevBtn = this.container.querySelector('#prev-page');
    const nextBtn = this.container.querySelector('#next-page');
    
    if (totalPages <= 1) {
      this.container.querySelector('.gallery-pagination').style.display = 'none';
      this.container.querySelector('#load-more-btn').style.display = 'none';
      return;
    }
    
    this.container.querySelector('.gallery-pagination').style.display = 'flex';
    this.container.querySelector('#load-more-btn').style.display = 'block';
    
    pageInfo.textContent = `Page ${this.currentPage} of ${totalPages}`;
    prevBtn.disabled = this.currentPage === 1;
    nextBtn.disabled = this.currentPage === totalPages;
    
    if (this.currentPage === totalPages) {
        this.container.querySelector('#load-more-btn').style.display = 'none';
    }
  }
  
  bindEvents() {
    // Filter buttons
    this.container.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.container.querySelectorAll('.filter-btn, .timeline-month').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentFilter = e.currentTarget.dataset.filter;
        this.currentPage = 1;
        this.renderPhotos(true);
      });
    });
    
    // Timeline months
    this.container.querySelectorAll('.timeline-month').forEach(month => {
      month.addEventListener('click', (e) => {
        this.container.querySelectorAll('.filter-btn, .timeline-month').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentFilter = e.currentTarget.dataset.month;
        this.currentPage = 1;
        this.renderPhotos(true);
      });
    });
    
    // Pagination
    this.container.querySelector('#prev-page').addEventListener('click', () => this.changePage(-1));
    this.container.querySelector('#next-page').addEventListener('click', () => this.changePage(1));
    this.container.querySelector('#load-more-btn').addEventListener('click', () => this.loadMorePhotos());
    
    // Photo clicks for lightbox
    this.container.querySelector('.gallery-grid').addEventListener('click', (e) => {
      const galleryItem = e.target.closest('.gallery-item');
      if (galleryItem) {
        this.openLightbox(parseInt(galleryItem.dataset.index));
      }
    });
    
    this.bindLightboxEvents();
  }
  
  loadMorePhotos() {
    this.currentPage++;
    this.renderPhotos();
  }
  
  changePage(direction) {
    const totalPhotos = this.getFilteredPhotos().length;
    const totalPages = Math.ceil(totalPhotos / this.photosPerPage);
    
    this.currentPage += direction;
    
    if (this.currentPage < 1) this.currentPage = 1;
    if (this.currentPage > totalPages) this.currentPage = totalPages;
    
    this.renderPhotos();
  }
  
  bindLightboxEvents() {
    const lightbox = this.container.querySelector('#photo-lightbox');
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.closeLightbox());
    lightbox.querySelector('.lightbox-overlay').addEventListener('click', () => this.closeLightbox());
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => this.showPreviousPhoto());
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => this.showNextPhoto());
    
    document.addEventListener('keydown', (e) => {
      if (this.lightboxOpen) {
        if (e.key === 'Escape') this.closeLightbox();
        if (e.key === 'ArrowLeft') this.showPreviousPhoto();
        if (e.key === 'ArrowRight') this.showNextPhoto();
      }
    });
  }
  
  openLightbox(photoIndex) {
    this.currentLightboxIndex = photoIndex;
    this.updateLightboxContent();
    
    this.container.querySelector('#photo-lightbox').classList.add('active');
    this.lightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }
  
  closeLightbox() {
    this.container.querySelector('#photo-lightbox').classList.remove('active');
    this.lightboxOpen = false;
    document.body.style.overflow = '';
  }
  
  showPreviousPhoto() {
    const totalPhotos = this.getFilteredPhotos().length;
    this.currentLightboxIndex = (this.currentLightboxIndex - 1 + totalPhotos) % totalPhotos;
    this.updateLightboxContent();
  }
  
  showNextPhoto() {
    const totalPhotos = this.getFilteredPhotos().length;
    this.currentLightboxIndex = (this.currentLightboxIndex + 1) % totalPhotos;
    this.updateLightboxContent();
  }
  
  updateLightboxContent() {
    const photos = this.getFilteredPhotos();
    const photo = photos[this.currentLightboxIndex];
    const lightbox = this.container.querySelector('#photo-lightbox');
    
    lightbox.querySelector('.lightbox-image').src = photo.fullPath;
    lightbox.querySelector('.lightbox-title').textContent = this.formatDate(photo.date);
    lightbox.querySelector('.lightbox-caption').textContent = photo.caption;
    lightbox.querySelector('.lightbox-date').textContent = photo.date;
    lightbox.querySelector('.lightbox-location').textContent = photo.coordinates 
      ? `📍 ${this.formatLocation(photo.coordinates)}` 
      : '';
  }
  
  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  formatLocation(coordinates) {
    return `${coordinates.latitude.toFixed(3)}, ${coordinates.longitude.toFixed(3)}`;
  }
  
  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('americas-gallery-container')) {
    new AmericasGallery('americas-gallery-container');
  }
});
