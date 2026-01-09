// Ingredient Spotlight Carousel
class IngredientCarousel {
  constructor(element) {
    this.carousel = element;
    this.track = this.carousel.querySelector('.ingredient-spotlight__track');
    this.slides = Array.from(this.carousel.querySelectorAll('.ingredient-spotlight__slide'));
    this.prevBtn = this.carousel.querySelector('.ingredient-spotlight__arrow--prev');
    this.nextBtn = this.carousel.querySelector('.ingredient-spotlight__arrow--next');
    this.dotsContainer = this.carousel.querySelector('.ingredient-spotlight__dots');
    
    this.currentIndex = 0;
    this.autoplayInterval = null;
    this.autoplayDelay = 5000;
    
    if (this.slides.length === 0) return;
    
    this.init();
  }

  init() {
    this.createDots();
    this.showSlide(0);
    this.attachEventListeners();
    this.startAutoplay();
  }

  createDots() {
    if (!this.dotsContainer) return;
    
    this.slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'ingredient-spotlight__dot';
      dot.setAttribute('type', 'button');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to ingredient ${index + 1}`);
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
    this.carousel.addEventListener('mouseenter', () => this.stopAutoplay());
    this.carousel.addEventListener('mouseleave', () => this.startAutoplay());

    // Keyboard navigation
    this.carousel.addEventListener('keydown', (e) => {
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
    // Remove active class from all slides
    this.slides.forEach(slide => {
      slide.classList.remove('active');
    });

    // Add active class to current slide
    if (this.slides[index]) {
      this.slides[index].classList.add('active');
    }

    // Update dots
    const dots = this.dotsContainer?.querySelectorAll('.ingredient-spotlight__dot');
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
      this.nextBtn.disabled = index === this.slides.length - 1;
    }

    this.currentIndex = index;
  }

  goToSlide(index) {
    if (index >= 0 && index < this.slides.length) {
      this.showSlide(index);
      this.resetAutoplay();
    }
  }

  next() {
    const nextIndex = (this.currentIndex + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  prev() {
    const prevIndex = this.currentIndex === 0 ? this.slides.length - 1 : this.currentIndex - 1;
    this.goToSlide(prevIndex);
  }

  startAutoplay() {
    if (this.slides.length <= 1) return;
    
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

// Initialize all carousels
function initIngredientCarousels() {
  const carousels = document.querySelectorAll('#ingredientCarousel');
  carousels.forEach(carousel => {
    new IngredientCarousel(carousel);
  });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initIngredientCarousels);
} else {
  initIngredientCarousels();
}

// Reinitialize on Shopify section load
if (typeof Shopify !== 'undefined' && Shopify.designMode) {
  document.addEventListener('shopify:section:load', initIngredientCarousels);
}
