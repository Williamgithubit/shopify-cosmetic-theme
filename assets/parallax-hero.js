// Parallax Scrolling Effect for Hero Section
class ParallaxHero {
  constructor() {
    this.heroes = document.querySelectorAll('.hero-enhanced, .section-hero');
    this.scrollY = 0;
    this.ticking = false;
    
    if (this.heroes.length === 0) return;
    
    this.init();
  }

  init() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    this.attachEventListeners();
    this.update();
  }

  attachEventListeners() {
    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY;
      this.requestTick();
    });

    // Update on resize
    window.addEventListener('resize', () => {
      this.update();
    });
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
    this.heroes.forEach(hero => {
      const heroRect = hero.getBoundingClientRect();
      const heroTop = heroRect.top + this.scrollY;
      const heroHeight = heroRect.height;
      
      // Only apply parallax if hero is in viewport
      if (heroRect.top < window.innerHeight && heroRect.bottom > 0) {
        const scrollProgress = (this.scrollY - heroTop) / heroHeight;
        
        // Apply parallax to media elements
        const media = hero.querySelector('.hero-enhanced__media, .hero__media');
        if (media) {
          const parallaxSpeed = 0.5; // Adjust speed (0.5 = half speed)
          const translateY = scrollProgress * 100 * parallaxSpeed;
          media.style.transform = `translateY(${translateY}px)`;
        }

        // Apply fade effect to content
        const content = hero.querySelector('.hero-enhanced__content, .hero__content');
        if (content) {
          const fadeStart = 0;
          const fadeEnd = 0.5;
          const opacity = 1 - Math.max(0, Math.min(1, (scrollProgress - fadeStart) / (fadeEnd - fadeStart)));
          content.style.opacity = opacity;
          content.style.transform = `translateY(${scrollProgress * 50}px)`;
        }
      }
    });
  }
}

// Smooth Scroll Reveal Animation
class ScrollReveal {
  constructor() {
    this.elements = document.querySelectorAll('[data-scroll-reveal]');
    this.observer = null;
    
    if (this.elements.length === 0) return;
    
    this.init();
  }

  init() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Show all elements immediately
      this.elements.forEach(el => el.style.opacity = '1');
      return;
    }

    // Set up Intersection Observer
    const options = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.reveal(entry.target);
        }
      });
    }, options);

    // Observe all elements
    this.elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      this.observer.observe(el);
    });
  }

  reveal(element) {
    const delay = element.dataset.scrollRevealDelay || 0;
    
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
      
      // Unobserve after revealing
      if (this.observer) {
        this.observer.unobserve(element);
      }
    }, delay);
  }
}

// Smooth Parallax for Background Images
class BackgroundParallax {
  constructor() {
    this.elements = document.querySelectorAll('[data-parallax-bg]');
    this.scrollY = 0;
    this.ticking = false;
    
    if (this.elements.length === 0) return;
    
    this.init();
  }

  init() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    this.attachEventListeners();
    this.update();
  }

  attachEventListeners() {
    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY;
      this.requestTick();
    });
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
    this.elements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const speed = parseFloat(element.dataset.parallaxBg) || 0.5;
      
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const yPos = -(this.scrollY * speed);
        element.style.backgroundPosition = `center ${yPos}px`;
      }
    });
  }
}

// Initialize all parallax effects
function initParallaxEffects() {
  new ParallaxHero();
  new ScrollReveal();
  new BackgroundParallax();
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initParallaxEffects);
} else {
  initParallaxEffects();
}

// Reinitialize on Shopify section load
if (typeof Shopify !== 'undefined' && Shopify.designMode) {
  document.addEventListener('shopify:section:load', initParallaxEffects);
}
