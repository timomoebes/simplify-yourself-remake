// Blog Search and Filter Functionality

class BlogSearch {
  constructor() {
    this.posts = [];
    this.filteredPosts = [];
    this.currentSearchTerm = '';
    this.currentCategoryFilter = '';
    this.currentYearFilter = '';
    
    this.init();
  }
  
  init() {
    this.collectPosts();
    this.bindEvents();
    this.updateResultsInfo();
  }
  
  collectPosts() {
    const postElements = document.querySelectorAll('.post');
    this.posts = Array.from(postElements).map(post => {
      const title = post.querySelector('.post-title')?.textContent || '';
      const excerpt = post.querySelector('.post-excerpt')?.textContent || '';
      const dateText = post.querySelector('.post-date')?.textContent || '';
      const categories = Array.from(post.querySelectorAll('.category')).map(cat => cat.textContent.trim());
      
      // Extract year from date
      const year = this.extractYear(dateText);
      
      return {
        element: post,
        title: title.toLowerCase(),
        excerpt: excerpt.toLowerCase(),
        dateText,
        year,
        categories,
        searchText: (title + ' ' + excerpt).toLowerCase()
      };
    });
    
    this.filteredPosts = [...this.posts];
  }
  
  extractYear(dateText) {
    const match = dateText.match(/\d{4}/);
    return match ? match[0] : '';
  }
  
  bindEvents() {
    // Search input
    const searchInput = document.getElementById('blog-search');
    const searchClear = document.getElementById('search-clear');
    
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.currentSearchTerm = e.target.value.toLowerCase().trim();
        this.toggleClearButton();
        this.applyFilters();
      });
    }
    
    if (searchClear) {
      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        this.currentSearchTerm = '';
        this.toggleClearButton();
        this.applyFilters();
        searchInput.focus();
      });
    }
    
    // Category filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', (e) => {
        this.currentCategoryFilter = e.target.value;
        this.applyFilters();
      });
    }
    
    // Year filter
    const yearFilter = document.getElementById('year-filter');
    if (yearFilter) {
      yearFilter.addEventListener('change', (e) => {
        this.currentYearFilter = e.target.value;
        this.applyFilters();
      });
    }
    
    // Clear all filters
    const clearFilters = document.getElementById('clear-filters');
    if (clearFilters) {
      clearFilters.addEventListener('click', () => {
        this.clearAllFilters();
      });
    }
  }
  
  toggleClearButton() {
    const searchClear = document.getElementById('search-clear');
    if (searchClear) {
      searchClear.style.display = this.currentSearchTerm ? 'flex' : 'none';
    }
  }
  
  applyFilters() {
    this.filteredPosts = this.posts.filter(post => {
      // Search filter
      if (this.currentSearchTerm && !post.searchText.includes(this.currentSearchTerm)) {
        return false;
      }
      
      // Category filter
      if (this.currentCategoryFilter && !post.categories.includes(this.currentCategoryFilter)) {
        return false;
      }
      
      // Year filter
      if (this.currentYearFilter && post.year !== this.currentYearFilter) {
        return false;
      }
      
      return true;
    });
    
    this.updateDisplay();
    this.updateResultsInfo();
    this.toggleClearFiltersButton();
  }
  
  updateDisplay() {
    const postsContainer = document.getElementById('posts-container');
    const noResultsElement = document.getElementById('no-results');
    
    // Remove existing no-results element
    if (noResultsElement) {
      noResultsElement.remove();
    }
    
    // Hide all posts first
    this.posts.forEach(post => {
      post.element.classList.add('hidden');
    });
    
    // Show filtered posts
    this.filteredPosts.forEach(post => {
      post.element.classList.remove('hidden');
    });
    
    // Show no results message if needed
    if (this.filteredPosts.length === 0) {
      this.showNoResults();
    }
  }
  
  showNoResults() {
    const postsContainer = document.getElementById('posts-container');
    const noResults = document.createElement('div');
    noResults.id = 'no-results';
    noResults.className = 'no-results';
    
    const filterMessages = [];
    if (this.currentSearchTerm) filterMessages.push(`"${this.currentSearchTerm}"`);
    if (this.currentCategoryFilter) filterMessages.push(`category "${this.currentCategoryFilter}"`);
    if (this.currentYearFilter) filterMessages.push(`year ${this.currentYearFilter}`);
    
    const filterText = filterMessages.length > 0 ? ` for ${filterMessages.join(', ')}` : '';
    
    noResults.innerHTML = `
      <h3>No Posts Found</h3>
      <p>Sorry, no blog posts match your search criteria${filterText}. Try adjusting your filters or search terms.</p>
    `;
    
    postsContainer.appendChild(noResults);
  }
  
  updateResultsInfo() {
    const resultsInfo = document.getElementById('results-info');
    if (resultsInfo) {
      const total = this.posts.length;
      const filtered = this.filteredPosts.length;
      
      if (filtered === total) {
        resultsInfo.textContent = `Showing all ${total} posts`;
      } else {
        resultsInfo.textContent = `Showing ${filtered} of ${total} posts`;
      }
    }
  }
  
  toggleClearFiltersButton() {
    const clearFilters = document.getElementById('clear-filters');
    if (clearFilters) {
      const hasActiveFilters = this.currentSearchTerm || this.currentCategoryFilter || this.currentYearFilter;
      clearFilters.style.display = hasActiveFilters ? 'block' : 'none';
    }
  }
  
  clearAllFilters() {
    // Clear search
    const searchInput = document.getElementById('blog-search');
    if (searchInput) {
      searchInput.value = '';
    }
    
    // Clear category filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
      categoryFilter.value = '';
    }
    
    // Clear year filter
    const yearFilter = document.getElementById('year-filter');
    if (yearFilter) {
      yearFilter.value = '';
    }
    
    // Reset internal state
    this.currentSearchTerm = '';
    this.currentCategoryFilter = '';
    this.currentYearFilter = '';
    
    // Apply filters (which will show all posts)
    this.applyFilters();
    this.toggleClearButton();
    
    // Focus search input
    if (searchInput) {
      searchInput.focus();
    }
  }
}

// Initialize blog search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('blog-search')) {
    new BlogSearch();
  }
});