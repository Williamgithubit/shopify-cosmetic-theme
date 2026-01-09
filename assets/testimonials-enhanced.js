// Enhanced Testimonials with Star Animations and Slider
class TestimonialsEnhanced {
  constructor(container) {
    this.container = container;
    this.track = this.container.querySelector('.testimonials-enhanced__track');
    this.items = Array.from(this.container.querySelectorAll('.testimonials-enhanced__item'));
    this.prevBtn = this.container.querySelector('.testimonials-enhanced__arrow--prev');
    this.nextBtn = this.container.querySelector('.testimonials-enhanced__arrow--next');
    this.dotsContainer = this.container.querySelector('.testimonials-enhanced__dots');
    
    this.currentIndex = 0;
    this.isSlider = this.container.classList.contains('testimonials-enhanced__container--slider');
    this.autoplayInterval = null;
    this.autoplayDelay = 6000;
    
    this.init();
  }

  init() {
    this.animateStars();
    
    if (this.isSlider && this.items.length > 0) {
      this.createDots();
      this.showSlide(0);
      this.attachEventListeners();
      this.startAutoplay();
    }
  }

  animateStars() {
    const starContainers = this.container.querySelectorAll('.testimonials-enhanced__stars');
    
    starContainers.forEach(container => {
      const rating = parseInt(container.dataset.rating) || 5;
      const stars = container.querySelectorAll('.testimonials-enhanced__star');
      
      stars.forEach((star, index) => {
        if (index < rating) {
          setTimeout(() => {
            star.classList.add('filled');
          }, index * 100);
        }
      });
    });
  }

  createDots() {
    if (!this.dotsContainer) return;
    
    this.items.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'testimonials-enhanced__dot';
      dot.setAttribute('type', 'button');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
      dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => this.goToSlide(index));
      this.dotsContainer.appendChild(dot);
    });
  }

  attachEventListeners() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prev());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.next());
    }

    // Pause autoplay on hover
    this.container.addEventListener('mouseenter', () => this.stopAutoplay());
    this.container.addEventListener('mouseleave', () => this.startAutoplay());

    // Keyboard navigation
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.prev();
      } else if (e.key === 'ArrowRight') {
        this.next();
      }
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    this.track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    this.track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    });
  }

  handleSwipe(startX, endX) {
    const swipeThreshold = 50;
    const diff = startX - endX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }

  showSlide(index) {
    // Remove active class from all items
    this.items.forEach(item => {
      item.classList.remove('active');
    });

    // Add active class to current item
    if (this.items[index]) {
      this.items[index].classList.add('active');
    }

    // Update dots
    const dots = this.dotsContainer?.querySelectorAll('.testimonials-enhanced__dot');
    if (dots) {
      dots.forEach((dot, i) => {
        if (i === index) {
          dot.classList.add('active');
          dot.setAttribute('aria-selected', 'true');
        } else {
          dot.classList.remove('active');
          dot.setAttribute('aria-selected', 'false');
        }
      });
    }

    // Update navigation buttons
    if (this.prevBtn) {
      this.prevBtn.disabled = index === 0;
    }
    if (this.nextBtn) {
      this.nextBtn.disabled = index === this.items.length - 1;
    }

    this.currentIndex = index;
  }

  goToSlide(index) {
    if (index >= 0 && index < this.items.length) {
      this.showSlide(index);
      this.resetAutoplay();
    }
  }

  next() {
    const nextIndex = (this.currentIndex + 1) % this.items.length;
    this.goToSlide(nextIndex);
  }

  prev() {
    const prevIndex = this.currentIndex === 0 ? this.items.length - 1 : this.currentIndex - 1;
    this.goToSlide(prevIndex);
  }

  startAutoplay() {
    if (!this.isSlider || this.items.length <= 1) return;
    
    this.autoplayInterval = setInterval(() => {
      this.next();
    }, this.autoplayDelay);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  resetAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }

  destroy() {
    this.stopAutoplay();
  }
}

// Initialize all testimonials
function initTestimonialsEnhanced() {
  const containers = document.querySelectorAll('.testimonials-enhanced__container');
  containers.forEach(container => {
    new TestimonialsEnhanced(container);
  });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTestimonialsEnhanced);
} else {
  initTestimonialsEnhanced();
}

// Reinitialize on Shopify section load
if (typeof Shopify !== 'undefined' && Shopify.designMode) {
  document.addEventListener('shopify:section:load', initTestimonialsEnhanced);
}
