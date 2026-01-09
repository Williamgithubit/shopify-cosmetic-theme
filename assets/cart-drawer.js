// Cart Drawer and Quick Add Functionality
class CartDrawer {
  constructor() {
    this.drawer = document.querySelector('.cart-drawer');
    this.overlay = document.querySelector('.cart-drawer__overlay');
    this.closeButton = document.querySelector('.cart-drawer__close');
    this.cartIcon = document.querySelector('.header__cart');
    
    this.init();
  }

  init() {
    if (this.cartIcon) {
      this.cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    }

    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => this.close());
    }

    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.close());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });

    this.initQuickAdd();
  }

  initQuickAdd() {
    document.addEventListener('click', (e) => {
      const quickAddButton = e.target.closest('.product-card__quick-add-button');
      if (quickAddButton) {
        e.preventDefault();
        this.handleQuickAdd(quickAddButton);
      }
    });
  }

  async handleQuickAdd(button) {
    const variantId = button.dataset.variantId;
    
    if (!variantId) {
      console.error('No variant ID found');
      return;
    }

    button.classList.add('product-card__quick-add-button--loading');
    button.disabled = true;

    try {
      await this.addToCart(variantId, 1);
      this.showNotification('Product added to cart!');
      await this.fetchCart();
      this.open();
    } catch (error) {
      console.error('Error adding to cart:', error);
      this.showNotification('Error adding product to cart', 'error');
    } finally {
      button.classList.remove('product-card__quick-add-button--loading');
      button.disabled = false;
    }
  }

  async addToCart(variantId, quantity = 1) {
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{
          id: variantId,
          quantity: quantity
        }]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || error.description || 'Failed to add to cart');
    }

    return response.json();
  }

  async fetchCart() {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      this.updateCartUI(cart);
      this.updateCartCount(cart.item_count);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }

  updateCartUI(cart) {
    if (!this.drawer) return;

    const body = this.drawer.querySelector('.cart-drawer__body');
    if (!body) return;

    if (cart.item_count === 0) {
      body.innerHTML = `
        <div class="cart-drawer__empty">
          <svg class="cart-drawer__empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <p class="cart-drawer__empty-text">Your cart is empty</p>
          <a href="/collections/all" class="button button--primary">Continue Shopping</a>
        </div>
      `;
      
      const footer = this.drawer.querySelector('.cart-drawer__footer');
      if (footer) footer.style.display = 'none';
    } else {
      const itemsHTML = cart.items.map(item => this.renderCartItem(item)).join('');
      
      body.innerHTML = `
        <div class="cart-drawer__items">
          ${itemsHTML}
        </div>
      `;

      const footer = this.drawer.querySelector('.cart-drawer__footer');
      if (footer) {
        footer.style.display = 'block';
        const subtotalPrice = footer.querySelector('.cart-drawer__subtotal-price');
        if (subtotalPrice) {
          subtotalPrice.textContent = this.formatMoney(cart.total_price);
        }
      }

      this.attachItemListeners();
    }
  }

  renderCartItem(item) {
    const variantOptions = item.variant_options && item.variant_options.length > 0
      ? item.variant_options.map(opt => `<div class="cart-drawer__item-variant">${opt}</div>`).join('')
      : '';

    return `
      <div class="cart-drawer__item" data-line="${item.line}">
        <img src="${item.image}" alt="${item.title}" class="cart-drawer__item-image" loading="lazy">
        <div class="cart-drawer__item-details">
          <h3 class="cart-drawer__item-title">${item.product_title}</h3>
          ${variantOptions}
          <div class="cart-drawer__item-price">${this.formatMoney(item.final_line_price)}</div>
          <div class="cart-drawer__item-quantity">
            <button class="quantity-selector__button" data-action="decrease" data-line="${item.line}" aria-label="Decrease quantity">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="4" y1="8" x2="12" y2="8"/>
              </svg>
            </button>
            <input type="number" class="quantity-selector__input" value="${item.quantity}" min="0" data-line="${item.line}" aria-label="Quantity">
            <button class="quantity-selector__button" data-action="increase" data-line="${item.line}" aria-label="Increase quantity">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="8" y1="4" x2="8" y2="12"/>
                <line x1="4" y1="8" x2="12" y2="8"/>
              </svg>
            </button>
            <button class="cart-drawer__item-remove" data-line="${item.line}">Remove</button>
          </div>
        </div>
      </div>
    `;
  }

  attachItemListeners() {
    const body = this.drawer.querySelector('.cart-drawer__body');
    if (!body) return;

    body.addEventListener('click', async (e) => {
      const decreaseBtn = e.target.closest('[data-action="decrease"]');
      const increaseBtn = e.target.closest('[data-action="increase"]');
      const removeBtn = e.target.closest('.cart-drawer__item-remove');

      if (decreaseBtn) {
        const line = decreaseBtn.dataset.line;
        const input = body.querySelector(`input[data-line="${line}"]`);
        const newQty = Math.max(0, parseInt(input.value) - 1);
        await this.updateQuantity(line, newQty);
      } else if (increaseBtn) {
        const line = increaseBtn.dataset.line;
        const input = body.querySelector(`input[data-line="${line}"]`);
        const newQty = parseInt(input.value) + 1;
        await this.updateQuantity(line, newQty);
      } else if (removeBtn) {
        const line = removeBtn.dataset.line;
        await this.updateQuantity(line, 0);
      }
    });

    body.addEventListener('change', async (e) => {
      if (e.target.classList.contains('quantity-selector__input')) {
        const line = e.target.dataset.line;
        const newQty = Math.max(0, parseInt(e.target.value) || 0);
        await this.updateQuantity(line, newQty);
      }
    });
  }

  async updateQuantity(line, quantity) {
    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          line: line,
          quantity: quantity
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update cart');
      }

      const cart = await response.json();
      this.updateCartUI(cart);
      this.updateCartCount(cart.item_count);
    } catch (error) {
      console.error('Error updating cart:', error);
      this.showNotification('Error updating cart', 'error');
    }
  }

  updateCartCount(count) {
    const cartCountBubbles = document.querySelectorAll('.cart-count-bubble');
    cartCountBubbles.forEach(bubble => {
      bubble.setAttribute('data-cart-count', count);
      if (count > 0) {
        bubble.innerHTML = `<span aria-hidden="true">${count}</span>`;
      } else {
        bubble.innerHTML = '';
      }
    });
  }

  formatMoney(cents) {
    const dollars = (cents / 100).toFixed(2);
    return `$${dollars}`;
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

  open() {
    if (!this.drawer) return;
    
    this.fetchCart();
    this.drawer.classList.add('is-open');
    if (this.overlay) this.overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    
    this.trapFocus();
  }

  close() {
    if (!this.drawer) return;
    
    this.drawer.classList.remove('is-open');
    if (this.overlay) this.overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  isOpen() {
    return this.drawer && this.drawer.classList.contains('is-open');
  }

  trapFocus() {
    if (!this.drawer) return;
    
    const focusableElements = this.drawer.querySelectorAll(
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

    this.drawer.addEventListener('keydown', handleTab);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CartDrawer();
  });
} else {
  new CartDrawer();
}
