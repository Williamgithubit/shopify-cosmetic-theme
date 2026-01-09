/**
 * Premium Collection Page JavaScript
 * Aura Cosmetics - Luxury Beauty Theme
 */

(function() {
  'use strict';

  // ============================================
  // FILTER DRAWER FUNCTIONALITY
  // ============================================
  
  const filterToggle = document.querySelector('[data-filter-toggle]');
  const filterDrawer = document.querySelector('[data-filter-drawer]');
  const filterDrawerClose = document.querySelector('[data-filter-drawer-close]');
  const filterDrawerOverlay = document.querySelector('[data-filter-drawer-overlay]');

  if (filterToggle && filterDrawer) {
    filterToggle.addEventListener('click', function() {
      openFilterDrawer();
    });

    if (filterDrawerClose) {
      filterDrawerClose.addEventListener('click', closeFilterDrawer);
    }

    if (filterDrawerOverlay) {
      filterDrawerOverlay.addEventListener('click', closeFilterDrawer);
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && filterDrawer.getAttribute('aria-hidden') === 'false') {
        closeFilterDrawer();
      }
    });
  }

  function openFilterDrawer() {
    filterDrawer.setAttribute('aria-hidden', 'false');
    filterToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    
    // Focus first filter input
    setTimeout(function() {
      const firstInput = filterDrawer.querySelector('input, select');
      if (firstInput) firstInput.focus();
    }, 300);
  }

  function closeFilterDrawer() {
    filterDrawer.setAttribute('aria-hidden', 'true');
    filterToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    filterToggle.focus();
  }

  // ============================================
  // FILTER FORM SUBMISSION
  // ============================================
  
  const filterForms = document.querySelectorAll('[data-collection-filters-form]');
  
  filterForms.forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      applyFilters(form);
    });

    // Auto-submit on checkbox change
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function(checkbox) {
      checkbox.addEventListener('change', function() {
        debounce(function() {
          applyFilters(form);
        }, 500)();
      });
    });

    // Auto-submit on price input change
    const priceInputs = form.querySelectorAll('.collection-filter-price__input');
    priceInputs.forEach(function(input) {
      input.addEventListener('change', function() {
        debounce(function() {
          applyFilters(form);
        }, 800)();
      });
    });
  });

  function applyFilters(form) {
    const submitButton = form.querySelector('.collection-filters__apply');
    if (submitButton) {
      submitButton.classList.add('is-loading');
    }

    const formData = new FormData(form);
    const url = new URL(window.location.href);
    
    // Clear existing filter params
    const params = new URLSearchParams(url.search);
    const keysToRemove = [];
    for (const key of params.keys()) {
      if (key.startsWith('filter.')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => params.delete(key));

    // Add new filter params
    for (const [key, value] of formData.entries()) {
      if (value) {
        params.append(key, value);
      }
    }

    url.search = params.toString();
    window.location.href = url.toString();
  }

  // Clear all filters
  const clearFiltersButtons = document.querySelectorAll('[data-clear-filters]');
  clearFiltersButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);
      
      const keysToRemove = [];
      for (const key of params.keys()) {
        if (key.startsWith('filter.')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => params.delete(key));
      
      url.search = params.toString();
      window.location.href = url.toString();
    });
  });

  // ============================================
  // SORTING FUNCTIONALITY
  // ============================================
  
  const sortSelect = document.querySelector('[data-sort-select]');
  
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      const url = new URL(window.location.href);
      url.searchParams.set('sort_by', this.value);
      window.location.href = url.toString();
    });
  }

  // ============================================
  // QUICK VIEW MODAL
  // ============================================
  
  const quickViewModal = document.querySelector('[data-quick-view-modal]');
  const quickViewOverlay = document.querySelector('[data-quick-view-overlay]');
  const quickViewClose = document.querySelector('[data-quick-view-close]');
  const quickViewContent = document.querySelector('[data-quick-view-content]');

  // Quick view triggers
  document.addEventListener('click', function(e) {
    const trigger = e.target.closest('[data-quick-view-trigger]');
    if (trigger) {
      e.preventDefault();
      const productHandle = trigger.getAttribute('data-product-handle');
      openQuickView(productHandle);
    }
  });

  if (quickViewClose) {
    quickViewClose.addEventListener('click', closeQuickView);
  }

  if (quickViewOverlay) {
    quickViewOverlay.addEventListener('click', closeQuickView);
  }

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && quickViewModal && quickViewModal.getAttribute('aria-hidden') === 'false') {
      closeQuickView();
    }
  });

  function openQuickView(productHandle) {
    if (!quickViewModal || !quickViewContent) return;

    quickViewModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Show loading state
    quickViewContent.innerHTML = '<div class="quick-view-modal__loading"><svg class="spinner" width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="16" stroke="currentColor" stroke-width="3" fill="none" opacity="0.25"/><path d="M20 4a16 16 0 0 1 16 16" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/></svg></div>';

    // Fetch product data
    fetch('/products/' + productHandle + '?view=quick-view')
      .then(function(response) {
        if (!response.ok) throw new Error('Product not found');
        return response.text();
      })
      .then(function(html) {
        quickViewContent.innerHTML = html;
        
        // Initialize product form in quick view
        initializeQuickViewProduct();
      })
      .catch(function(error) {
        console.error('Error loading quick view:', error);
        quickViewContent.innerHTML = '<div style="padding: 40px; text-align: center;"><p>Sorry, there was an error loading this product.</p></div>';
      });
  }

  function closeQuickView() {
    if (!quickViewModal) return;
    
    quickViewModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    setTimeout(function() {
      if (quickViewContent) {
        quickViewContent.innerHTML = '<div class="quick-view-modal__loading"><svg class="spinner" width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="16" stroke="currentColor" stroke-width="3" fill="none" opacity="0.25"/><path d="M20 4a16 16 0 0 1 16 16" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/></svg></div>';
      }
    }, 300);
  }

  function initializeQuickViewProduct() {
    // Re-initialize quantity selectors
    const quantitySelectors = quickViewContent.querySelectorAll('.quantity-selector');
    quantitySelectors.forEach(initializeQuantitySelector);

    // Re-initialize variant selection
    const variantInputs = quickViewContent.querySelectorAll('.variant-input, .variant-select');
    variantInputs.forEach(function(input) {
      input.addEventListener('change', updateVariantInQuickView);
    });

    // Add to cart from quick view
    const addToCartBtn = quickViewContent.querySelector('[data-quick-view-add-to-cart]');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        handleQuickViewAddToCart(this);
      });
    }
  }

  function updateVariantInQuickView() {
    // Similar to main product page variant update logic
    // This would need to be customized based on your variant selection implementation
  }

  function handleQuickViewAddToCart(button) {
    const variantId = button.getAttribute('data-variant-id');
    const quantity = quickViewContent.querySelector('[name="quantity"]')?.value || 1;

    if (!variantId) {
      alert('Please select a variant');
      return;
    }

    button.classList.add('is-loading');

    addToCart(variantId, quantity)
      .then(function() {
        button.classList.remove('is-loading');
        closeQuickView();
        // Optionally show success message or redirect to cart
        setTimeout(function() {
          window.location.href = '/cart';
        }, 300);
      })
      .catch(function(error) {
        button.classList.remove('is-loading');
        alert(error.message || 'There was an error adding to cart');
      });
  }

  // ============================================
  // QUICK ADD TO CART (From Product Cards)
  // ============================================
  
  document.addEventListener('click', function(e) {
    const quickAddBtn = e.target.closest('[data-quick-add]');
    if (quickAddBtn) {
      e.preventDefault();
      handleQuickAdd(quickAddBtn);
    }
  });

  function handleQuickAdd(button) {
    const variantId = button.getAttribute('data-variant-id');
    const productId = button.getAttribute('data-product-id');

    if (!variantId) return;

    button.classList.add('is-loading');

    addToCart(variantId, 1)
      .then(function() {
        button.classList.remove('is-loading');
        updateCartCount();
        
        // Show brief success feedback
        const originalText = button.querySelector('.product-card-premium__add-to-cart-text').textContent;
        button.querySelector('.product-card-premium__add-to-cart-text').textContent = 'Added!';
        
        setTimeout(function() {
          button.querySelector('.product-card-premium__add-to-cart-text').textContent = originalText;
        }, 2000);
      })
      .catch(function(error) {
        button.classList.remove('is-loading');
        alert(error.message || 'There was an error adding to cart');
      });
  }

  // ============================================
  // INFINITE SCROLL / LOAD MORE
  // ============================================
  
  const loadMoreButton = document.querySelector('[data-load-more]');
  const productsGrid = document.querySelector('[data-products-grid]');
  const collectionGrid = document.querySelector('[data-collection-grid]');

  if (loadMoreButton && productsGrid) {
    loadMoreButton.addEventListener('click', function() {
      loadMoreProducts();
    });

    // Optional: Auto-load on scroll
    if (collectionGrid && collectionGrid.getAttribute('data-infinite-scroll') === 'true') {
      let isLoading = false;
      
      window.addEventListener('scroll', function() {
        if (isLoading) return;
        
        const scrollPosition = window.scrollY + window.innerHeight;
        const pageHeight = document.documentElement.scrollHeight;
        
        // Load more when 300px from bottom
        if (scrollPosition >= pageHeight - 300 && loadMoreButton) {
          isLoading = true;
          loadMoreProducts().finally(function() {
            isLoading = false;
          });
        }
      });
    }
  }

  function loadMoreProducts() {
    if (!loadMoreButton) return Promise.resolve();

    const nextUrl = loadMoreButton.getAttribute('data-next-url');
    if (!nextUrl) return Promise.resolve();

    loadMoreButton.classList.add('is-loading');

    return fetch(nextUrl)
      .then(function(response) {
        return response.text();
      })
      .then(function(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Get new products
        const newProducts = doc.querySelectorAll('[data-product-item]');
        newProducts.forEach(function(product) {
          productsGrid.appendChild(product);
        });

        // Update load more button
        const newLoadMoreButton = doc.querySelector('[data-load-more]');
        if (newLoadMoreButton) {
          loadMoreButton.setAttribute('data-next-url', newLoadMoreButton.getAttribute('data-next-url'));
        } else {
          // No more pages
          loadMoreButton.style.display = 'none';
        }

        loadMoreButton.classList.remove('is-loading');

        // Animate new products
        setTimeout(function() {
          newProducts.forEach(function(product, index) {
            product.style.animation = 'fadeInUp 0.6s ease backwards';
            product.style.animationDelay = (index * 0.05) + 's';
          });
        }, 100);
      })
      .catch(function(error) {
        console.error('Error loading more products:', error);
        loadMoreButton.classList.remove('is-loading');
      });
  }

  // ============================================
  // WISHLIST FUNCTIONALITY (Basic)
  // ============================================
  
  document.addEventListener('click', function(e) {
    const wishlistBtn = e.target.closest('[data-wishlist-toggle]');
    if (wishlistBtn) {
      e.preventDefault();
      toggleWishlist(wishlistBtn);
    }
  });

  function toggleWishlist(button) {
    const productId = button.getAttribute('data-product-id');
    
    // Get wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    const index = wishlist.indexOf(productId);
    if (index > -1) {
      // Remove from wishlist
      wishlist.splice(index, 1);
      button.classList.remove('is-active');
      button.setAttribute('aria-label', 'Add to wishlist');
    } else {
      // Add to wishlist
      wishlist.push(productId);
      button.classList.add('is-active');
      button.setAttribute('aria-label', 'Remove from wishlist');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }

  // Initialize wishlist states on page load
  function initializeWishlistStates() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const wishlistButtons = document.querySelectorAll('[data-wishlist-toggle]');
    
    wishlistButtons.forEach(function(button) {
      const productId = button.getAttribute('data-product-id');
      if (wishlist.includes(productId)) {
        button.classList.add('is-active');
        button.setAttribute('aria-label', 'Remove from wishlist');
      }
    });
  }

  initializeWishlistStates();

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  
  function addToCart(variantId, quantity) {
    const formData = {
      items: [{
        id: variantId,
        quantity: quantity
      }]
    };

    return fetch(window.Shopify?.routes?.root + 'cart/add.js' || '/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    .then(function(response) {
      if (!response.ok) {
        return response.json().then(function(errorData) {
          throw new Error(errorData.message || errorData.description || 'Error adding to cart');
        });
      }
      return response.json();
    });
  }

  function updateCartCount() {
    fetch(window.Shopify?.routes?.root + 'cart.js' || '/cart.js')
      .then(function(response) {
        return response.json();
      })
      .then(function(cart) {
        const cartCountBubbles = document.querySelectorAll('.cart-count-bubble');
        cartCountBubbles.forEach(function(bubble) {
          bubble.setAttribute('data-cart-count', cart.item_count);
          bubble.innerHTML = '<span aria-hidden="true">' + cart.item_count + '</span>';
        });
      })
      .catch(function(error) {
        console.error('Error updating cart count:', error);
      });
  }

  function initializeQuantitySelector(selector) {
    const minusButton = selector.querySelector('[name="minus"]');
    const plusButton = selector.querySelector('[name="plus"]');
    const input = selector.querySelector('.quantity-selector__input');

    if (minusButton && input) {
      minusButton.addEventListener('click', function() {
        const currentValue = parseInt(input.value) || 1;
        const minValue = parseInt(input.getAttribute('min')) || 1;
        if (currentValue > minValue) {
          input.value = currentValue - 1;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    }

    if (plusButton && input) {
      plusButton.addEventListener('click', function() {
        const currentValue = parseInt(input.value) || 1;
        const maxValue = parseInt(input.getAttribute('max')) || 999;
        if (currentValue < maxValue) {
          input.value = currentValue + 1;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    }
  }

  function debounce(func, wait) {
    let timeout;
    return function executedFunction() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    };
  }

  // ============================================
  // COLOR SWATCH PREVIEW
  // ============================================
  
  const productSwatches = document.querySelectorAll('[data-product-swatches] a');
  
  productSwatches.forEach(function(swatch) {
    swatch.addEventListener('mouseenter', function(e) {
      e.preventDefault();
      const productCard = this.closest('.product-card-premium');
      const variantId = this.href.split('variant=')[1];
      
      // You could fetch and show the variant image here
      // This is a placeholder for that functionality
    });
  });

  // ============================================
  // ACCESSIBILITY ENHANCEMENTS
  // ============================================
  
  // Trap focus in modals
  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function(e) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    });
  }

  if (quickViewModal) {
    trapFocus(quickViewModal);
  }

  if (filterDrawer) {
    trapFocus(filterDrawer);
  }

  // ============================================
  // ANNOUNCE UPDATES FOR SCREEN READERS
  // ============================================
  
  function announceToScreenReader(message) {
    const announcement = document.getElementById('a11y-refresh-page-message');
    if (announcement) {
      announcement.textContent = message;
      setTimeout(function() {
        announcement.textContent = '';
      }, 3000);
    }
  }

  // Use this when filters are applied or products are loaded
  // announceToScreenReader('Products updated');

  console.log('Premium Collection Page initialized');
})();
