// Product Quick View Modal
class ProductQuickView {
  constructor() {
    this.modal = document.getElementById('quickViewModal');
    this.overlay = this.modal?.querySelector('.quick-view-modal__overlay');
    this.closeBtn = this.modal?.querySelector('.quick-view-modal__close');
    this.content = document.getElementById('quickViewContent');
    
    this.currentProduct = null;
    this.selectedVariant = null;
    
    if (!this.modal) return;
    
    this.init();
  }

  init() {
    this.attachEventListeners();
  }

  attachEventListeners() {
    // Quick view button clicks
    document.addEventListener('click', (e) => {
      const quickViewBtn = e.target.closest('[data-quick-view]');
      if (quickViewBtn) {
        e.preventDefault();
        const productHandle = quickViewBtn.dataset.quickView;
        this.open(productHandle);
      }
    });

    // Close button
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // Overlay click
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.close());
    }

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  async open(productHandle) {
    if (!this.modal) return;
    
    this.modal.classList.add('is-open');
    this.modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Show loading state
    this.content.innerHTML = `
      <div class="quick-view-modal__loading">
        <div class="loading-spinner"></div>
        <p>Loading product...</p>
      </div>
    `;
    
    try {
      await this.loadProduct(productHandle);
      this.trapFocus();
    } catch (error) {
      console.error('Error loading product:', error);
      this.content.innerHTML = `
        <div class="quick-view-modal__loading">
          <p style="color: #d32f2f;">Unable to load product. Please try again.</p>
        </div>
      `;
    }
  }

  close() {
    if (!this.modal) return;
    
    this.modal.classList.remove('is-open');
    setTimeout(() => {
      this.modal.style.display = 'none';
    }, 300);
    document.body.style.overflow = '';
    this.currentProduct = null;
    this.selectedVariant = null;
  }

  isOpen() {
    return this.modal && this.modal.classList.contains('is-open');
  }

  async loadProduct(handle) {
    const response = await fetch(`/products/${handle}.js`);
    const product = await response.json();
    
    this.currentProduct = product;
    this.selectedVariant = product.variants[0];
    
    this.renderProduct(product);
  }

  renderProduct(product) {
    const mainImage = product.images[0] || '';
    const comparePrice = this.selectedVariant.compare_at_price;
    const price = this.selectedVariant.price;
    
    const priceHTML = comparePrice && comparePrice > price
      ? `<span class="quick-view-modal__price--compare">${this.formatMoney(comparePrice)}</span>${this.formatMoney(price)}`
      : this.formatMoney(price);
    
    const thumbnailsHTML = product.images.length > 1
      ? `<div class="quick-view-modal__thumbnails">
          ${product.images.map((img, index) => `
            <div class="quick-view-modal__thumbnail ${index === 0 ? 'active' : ''}" data-image-index="${index}">
              <img src="${img}" alt="${product.title}" loading="lazy">
            </div>
          `).join('')}
        </div>`
      : '';
    
    const variantsHTML = product.options.length > 0 && product.variants.length > 1
      ? this.renderVariants(product)
      : '';
    
    this.content.innerHTML = `
      <div class="quick-view-modal__product">
        <div class="quick-view-modal__gallery">
          <div class="quick-view-modal__main-image" id="quickViewMainImage">
            <img src="${mainImage}" alt="${product.title}">
          </div>
          ${thumbnailsHTML}
        </div>
        
        <div class="quick-view-modal__info">
          ${product.vendor ? `<div class="quick-view-modal__vendor">${product.vendor}</div>` : ''}
          <h2 class="quick-view-modal__title" id="quickViewTitle">${product.title}</h2>
          <div class="quick-view-modal__price">${priceHTML}</div>
          ${product.description ? `<div class="quick-view-modal__description">${this.truncateDescription(product.description)}</div>` : ''}
          
          ${variantsHTML}
          
          <div class="quick-view-modal__actions">
            <button 
              type="button" 
              class="quick-view-modal__add-to-cart"
              id="quickViewAddToCart"
              ${!this.selectedVariant.available ? 'disabled' : ''}
            >
              ${this.selectedVariant.available ? 'Add to Cart' : 'Sold Out'}
            </button>
            <a href="/products/${product.handle}" class="quick-view-modal__view-full">
              View Full Details
            </a>
          </div>
        </div>
      </div>
    `;
    
    this.attachProductEventListeners();
  }

  renderVariants(product) {
    return product.options.map((option, optionIndex) => {
      const values = [...new Set(product.variants.map(v => v.options[optionIndex]))];
      
      return `
        <div class="quick-view-modal__variants">
          <label class="quick-view-modal__variant-label">${option.name}</label>
          <div class="quick-view-modal__variant-options">
            ${values.map(value => {
              const variant = product.variants.find(v => v.options[optionIndex] === value);
              const isSelected = this.selectedVariant.options[optionIndex] === value;
              const isAvailable = variant && variant.available;
              
              return `
                <button 
                  type="button"
                  class="quick-view-modal__variant-option ${isSelected ? 'selected' : ''}"
                  data-option-index="${optionIndex}"
                  data-option-value="${value}"
                  ${!isAvailable ? 'disabled' : ''}
                >
                  ${value}
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  attachProductEventListeners() {
    // Thumbnail clicks
    const thumbnails = this.content.querySelectorAll('.quick-view-modal__thumbnail');
    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const index = parseInt(thumb.dataset.imageIndex);
        this.switchImage(index);
        
        thumbnails.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });

    // Variant selection
    const variantButtons = this.content.querySelectorAll('.quick-view-modal__variant-option');
    variantButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const optionIndex = parseInt(btn.dataset.optionIndex);
        const optionValue = btn.dataset.optionValue;
        this.selectVariant(optionIndex, optionValue);
      });
    });

    // Add to cart
    const addToCartBtn = document.getElementById('quickViewAddToCart');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => this.addToCart());
    }
  }

  switchImage(index) {
    const mainImage = document.getElementById('quickViewMainImage');
    if (mainImage && this.currentProduct.images[index]) {
      mainImage.querySelector('img').src = this.currentProduct.images[index];
    }
  }

  selectVariant(optionIndex, optionValue) {
    const newOptions = [...this.selectedVariant.options];
    newOptions[optionIndex] = optionValue;
    
    const newVariant = this.currentProduct.variants.find(v => 
      v.options.every((opt, i) => opt === newOptions[i])
    );
    
    if (newVariant) {
      this.selectedVariant = newVariant;
      this.updatePrice();
      this.updateAddToCartButton();
      this.updateVariantButtons();
    }
  }

  updatePrice() {
    const priceContainer = this.content.querySelector('.quick-view-modal__price');
    if (!priceContainer) return;
    
    const comparePrice = this.selectedVariant.compare_at_price;
    const price = this.selectedVariant.price;
    
    const priceHTML = comparePrice && comparePrice > price
      ? `<span class="quick-view-modal__price--compare">${this.formatMoney(comparePrice)}</span>${this.formatMoney(price)}`
      : this.formatMoney(price);
    
    priceContainer.innerHTML = priceHTML;
  }

  updateAddToCartButton() {
    const btn = document.getElementById('quickViewAddToCart');
    if (!btn) return;
    
    if (this.selectedVariant.available) {
      btn.disabled = false;
      btn.textContent = 'Add to Cart';
    } else {
      btn.disabled = true;
      btn.textContent = 'Sold Out';
    }
  }

  updateVariantButtons() {
    const buttons = this.content.querySelectorAll('.quick-view-modal__variant-option');
    buttons.forEach(btn => {
      const optionIndex = parseInt(btn.dataset.optionIndex);
      const optionValue = btn.dataset.optionValue;
      const isSelected = this.selectedVariant.options[optionIndex] === optionValue;
      
      if (isSelected) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });
  }

  async addToCart() {
    const btn = document.getElementById('quickViewAddToCart');
    if (!btn || !this.selectedVariant) return;
    
    btn.disabled = true;
    btn.textContent = 'Adding...';
    
    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            id: this.selectedVariant.id,
            quantity: 1
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      // Show success notification
      this.showNotification('Product added to cart!');
      
      // Update cart count
      if (typeof window.cartDrawer !== 'undefined') {
        window.cartDrawer.fetchCart();
      }
      
      // Close modal after short delay
      setTimeout(() => this.close(), 1000);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      this.showNotification('Error adding to cart', 'error');
      btn.disabled = false;
      btn.textContent = 'Add to Cart';
    }
  }

  showNotification(message, type = 'success') {
    let notification = document.querySelector('.cart-notification');
    
    if (!notification) {
      notification = document.createElement('div');
      notification.className = 'cart-notification';
      document.body.appendChild(notification);
    }

    const icon = type === 'success' 
      ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
      : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

    notification.innerHTML = `
      <div class="cart-notification__content">
        <div class="cart-notification__icon">${icon}</div>
        <div class="cart-notification__message">${message}</div>
      </div>
    `;

    setTimeout(() => notification.classList.add('is-visible'), 10);

    setTimeout(() => {
      notification.classList.remove('is-visible');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  truncateDescription(description) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = description;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    
    if (text.length > 200) {
      return text.substring(0, 200) + '...';
    }
    return text;
  }

  formatMoney(cents) {
    return `$${(cents / 100).toFixed(2)}`;
  }

  trapFocus() {
    if (!this.modal) return;
    
    const focusableElements = this.modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement.focus();

    const handleTab = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    this.modal.addEventListener('keydown', handleTab);
  }
}

// Initialize quick view
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ProductQuickView();
  });
} else {
  new ProductQuickView();
}
