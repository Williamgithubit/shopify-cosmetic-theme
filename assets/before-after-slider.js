// Before/After Image Slider
class BeforeAfterSlider {
  constructor(container) {
    this.container = container;
    this.afterImage = this.container.querySelector('.before-after__image--after');
    this.divider = this.container.querySelector('.before-after__divider');
    this.handle = this.container.querySelector('.before-after__handle');
    
    this.isDragging = false;
    this.containerRect = null;
    
    if (!this.afterImage || !this.divider || !this.handle) return;
    
    this.init();
  }

  init() {
    this.attachEventListeners();
    this.updateContainerRect();
  }

  attachEventListeners() {
    // Mouse events
    this.handle.addEventListener('mousedown', (e) => this.startDrag(e));
    document.addEventListener('mousemove', (e) => this.drag(e));
    document.addEventListener('mouseup', () => this.stopDrag());

    // Touch events
    this.handle.addEventListener('touchstart', (e) => this.startDrag(e), { passive: false });
    document.addEventListener('touchmove', (e) => this.drag(e), { passive: false });
    document.addEventListener('touchend', () => this.stopDrag());

    // Keyboard navigation
    this.handle.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.moveSlider(-5);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.moveSlider(5);
      }
    });

    // Update container rect on resize
    window.addEventListener('resize', () => this.updateContainerRect());
  }

  updateContainerRect() {
    this.containerRect = this.container.getBoundingClientRect();
  }

  startDrag(e) {
    e.preventDefault();
    this.isDragging = true;
    this.updateContainerRect();
    this.container.style.cursor = 'ew-resize';
  }

  drag(e) {
    if (!this.isDragging) return;
    
    e.preventDefault();
    
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const x = clientX - this.containerRect.left;
    const percentage = (x / this.containerRect.width) * 100;
    
    this.updateSlider(Math.max(0, Math.min(100, percentage)));
  }

  stopDrag() {
    this.isDragging = false;
    this.container.style.cursor = '';
  }

  moveSlider(delta) {
    const currentLeft = parseFloat(this.divider.style.left) || 50;
    const newLeft = Math.max(0, Math.min(100, currentLeft + delta));
    this.updateSlider(newLeft);
  }

  updateSlider(percentage) {
    this.divider.style.left = `${percentage}%`;
    this.afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
  }
}

// Initialize all before/after sliders
function initBeforeAfterSliders() {
  const sliders = document.querySelectorAll('.before-after__images');
  sliders.forEach(slider => {
    new BeforeAfterSlider(slider);
  });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBeforeAfterSliders);
} else {
  initBeforeAfterSliders();
}

// Reinitialize on Shopify section load
if (typeof Shopify !== 'undefined' && Shopify.designMode) {
  document.addEventListener('shopify:section:load', initBeforeAfterSliders);
}
