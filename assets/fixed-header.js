// Fixed Header on Scroll
class FixedHeader {
  constructor() {
    this.header = document.querySelector('.section-header, .header');
    this.scrollThreshold = 100;
    this.lastScrollY = 0;
    this.ticking = false;
    
    if (!this.header) return;
    
    this.init();
  }

  init() {
    // Add initial class
    this.header.classList.add('header-wrapper');
    
    // Listen to scroll
    window.addEventListener('scroll', () => {
      this.lastScrollY = window.scrollY;
      this.requestTick();
    });
    
    // Initial check
    this.update();
  }

  requestTick() {
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.update();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  update() {
    if (this.lastScrollY > this.scrollThreshold) {
      this.header.classList.add('header-fixed');
    } else {
      this.header.classList.remove('header-fixed');
    }
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new FixedHeader();
  });
} else {
  new FixedHeader();
}
