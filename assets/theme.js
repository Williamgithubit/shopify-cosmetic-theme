// Mobile Menu Toggle
(function() {
  const menuToggle = document.querySelector('.header__menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuClose = document.querySelector('.mobile-menu__close');
  const mobileMenuOverlay = document.querySelector('.mobile-menu__overlay');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function() {
      mobileMenu.setAttribute('aria-hidden', 'false');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    });

    function closeMobileMenu() {
      mobileMenu.setAttribute('aria-hidden', 'true');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    if (mobileMenuOverlay) {
      mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }
  }
})();

// Product Media Gallery
(function() {
  const thumbnails = document.querySelectorAll('.product-main__thumbnail');
  const mediaItems = document.querySelectorAll('.product-main__media-item');

  thumbnails.forEach(function(thumbnail) {
    thumbnail.addEventListener('click', function() {
      const mediaId = this.getAttribute('data-media-id');
      
      thumbnails.forEach(function(t) {
        t.classList.remove('is-active');
      });
      this.classList.add('is-active');
      
      mediaItems.forEach(function(item) {
        if (item.getAttribute('data-media-id') === mediaId) {
          item.classList.add('is-active');
        } else {
          item.classList.remove('is-active');
        }
      });
    });
  });
})();

// Quantity Selector
(function() {
  const quantitySelectors = document.querySelectorAll('.quantity-selector');

  quantitySelectors.forEach(function(selector) {
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
  });
})();

// Cart Quantity Update
(function() {
  const cartForm = document.querySelector('.cart-items__form');
  
  if (cartForm) {
    const quantityInputs = cartForm.querySelectorAll('[data-quantity-input]');
    const removeButtons = cartForm.querySelectorAll('[data-cart-remove]');

    quantityInputs.forEach(function(input) {
      input.addEventListener('change', function() {
        const line = this.getAttribute('data-line');
        const quantity = parseInt(this.value) || 0;
        
        if (quantity === 0) {
          updateCart(line, 0);
        } else {
          updateCart(line, quantity);
        }
      });
    });

    removeButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        const line = this.getAttribute('data-line');
        updateCart(line, 0);
      });
    });

    function updateCart(line, quantity) {
      const formData = new FormData();
      formData.append('line', line);
      formData.append('quantity', quantity);

      fetch(window.routes.cart_change_url, {
        method: 'POST',
        body: formData
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        window.location.reload();
      })
      .catch(function(error) {
        console.error('Error:', error);
      });
    }
  }
})();

// Product Form Submit
(function() {
  const productForm = document.querySelector('.product-main__info');
  
  if (productForm) {
    const submitButton = productForm.querySelector('.product-main__submit');
    const quantityInput = productForm.querySelector('[name="quantity"]');
    
    if (submitButton) {
      submitButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        const variantId = getSelectedVariantId();
        const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
        
        if (!variantId) {
          alert('Please select a variant');
          return;
        }
        
        addToCart(variantId, quantity);
      });
    }
  }

  function getSelectedVariantId() {
    const variantSelects = document.querySelectorAll('variant-selects');
    if (variantSelects.length === 0) {
      const productInfo = document.querySelector('.product-main__info');
      if (productInfo && productInfo.hasAttribute('data-variant-id')) {
        return productInfo.getAttribute('data-variant-id');
      }
      return null;
    }
    
    const selectedOptions = {};
    const radioInputs = document.querySelectorAll('.variant-input:checked');
    const selectInputs = document.querySelectorAll('.variant-select');
    
    radioInputs.forEach(function(input) {
      selectedOptions[input.name] = input.value;
    });
    
    selectInputs.forEach(function(select) {
      selectedOptions[select.name] = select.value;
    });
    
    const variantData = document.querySelector('variant-selects script[type="application/json"]');
    if (variantData) {
      const variants = JSON.parse(variantData.textContent);
      const selectedVariant = variants.find(function(variant) {
        return variant.options.every(function(option, index) {
          return option === Object.values(selectedOptions)[index];
        });
      });
      
      return selectedVariant ? selectedVariant.id : null;
    }
    
    return null;
  }

  function addToCart(variantId, quantity) {
    const formData = {
      items: [{
        id: variantId,
        quantity: quantity
      }]
    };

    fetch(window.routes.cart_add_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    .then(function(response) {
      if (!response.ok) {
        return response.json().then(function(errorData) {
          throw new Error(errorData.message || errorData.description || 'Network response was not ok');
        });
      }
      return response.json();
    })
    .then(function(data) {
      if (data.status && data.status === 422) {
        console.error('Cart Error:', data);
        alert(data.message || data.description || window.cartStrings.error);
        return;
      }
      if (data.message || data.description) {
        console.error('Cart Error:', data);
        alert(data.message || data.description);
        return;
      }
      updateCartCount();
      setTimeout(function() {
        window.location.href = window.routes.cart_url;
      }, 300);
    })
    .catch(function(error) {
      console.error('Error:', error);
      alert(error.message || window.cartStrings.error || 'There was an error updating your cart. Please try again.');
    });
  }

  function updateCartCount() {
    fetch(window.routes.cart_url + '.js')
      .then(function(response) {
        return response.json();
      })
      .then(function(cart) {
        const cartCountBubble = document.querySelector('.cart-count-bubble');
        if (cartCountBubble) {
          cartCountBubble.setAttribute('data-cart-count', cart.item_count);
          cartCountBubble.innerHTML = '<span aria-hidden="true">' + cart.item_count + '</span>';
        }
      });
  }
})();

// Variant Selection
(function() {
  const variantInputs = document.querySelectorAll('.variant-input, .variant-select');
  
  variantInputs.forEach(function(input) {
    input.addEventListener('change', function() {
      updateVariant();
    });
  });

  function updateVariant() {
    const selectedOptions = {};
    const radioInputs = document.querySelectorAll('.variant-input:checked');
    const selectInputs = document.querySelectorAll('.variant-select');
    
    radioInputs.forEach(function(input) {
      selectedOptions[input.name] = input.value;
    });
    
    selectInputs.forEach(function(select) {
      selectedOptions[select.name] = select.value;
    });
    
    const variantData = document.querySelector('variant-selects script[type="application/json"]');
    if (variantData) {
      const variants = JSON.parse(variantData.textContent);
      const selectedVariant = variants.find(function(variant) {
        return variant.options.every(function(option, index) {
          return option === Object.values(selectedOptions)[index];
        });
      });
      
      if (selectedVariant) {
        updatePrice(selectedVariant);
        updateAvailability(selectedVariant);
        updateMedia(selectedVariant);
      }
    }
  }

  function updatePrice(variant) {
    const priceElement = document.querySelector('.product-main__price .price-item--regular');
    const salePriceElement = document.querySelector('.product-main__price .price-item--sale');
    const compareAtPriceElement = document.querySelector('.product-main__price .price-item--regular s');
    
    if (priceElement) {
      const price = formatMoney(variant.price);
      if (variant.compare_at_price && variant.compare_at_price > variant.price) {
        if (compareAtPriceElement) {
          compareAtPriceElement.textContent = formatMoney(variant.compare_at_price);
        }
        if (salePriceElement) {
          salePriceElement.textContent = price;
        }
      } else {
        priceElement.textContent = price;
      }
    }
  }

  function updateAvailability(variant) {
    const submitButton = document.querySelector('.product-main__submit');
    if (submitButton) {
      if (variant.available) {
        submitButton.disabled = false;
        submitButton.querySelector('span').textContent = window.variantStrings.addToCart;
      } else {
        submitButton.disabled = true;
        submitButton.querySelector('span').textContent = window.variantStrings.soldOut;
      }
    }
  }

  function updateMedia(variant) {
    if (variant.featured_media) {
      const mediaItem = document.querySelector('[data-media-id="' + variant.featured_media.id + '"]');
      if (mediaItem) {
        const allMediaItems = document.querySelectorAll('.product-main__media-item');
        allMediaItems.forEach(function(item) {
          item.classList.remove('is-active');
        });
        mediaItem.classList.add('is-active');
        
        const thumbnail = document.querySelector('.product-main__thumbnail[data-media-id="' + variant.featured_media.id + '"]');
        if (thumbnail) {
          const allThumbnails = document.querySelectorAll('.product-main__thumbnail');
          allThumbnails.forEach(function(t) {
            t.classList.remove('is-active');
          });
          thumbnail.classList.add('is-active');
        }
      }
    }
  }

  function formatMoney(cents) {
    const dollars = (cents / 100).toFixed(2);
    return '$' + dollars;
  }
})();

// Collection Sorting
(function() {
  const sortSelect = document.getElementById('SortBy');
  
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      const url = new URL(window.location.href);
      url.searchParams.set('sort_by', this.value);
      window.location.href = url.toString();
    });
  }
})();

// Filter Drawer Toggle
(function() {
  const filterToggle = document.querySelector('.collection-grid__filter-toggle');
  const filterDrawer = document.querySelector('.filter-drawer');
  const filterClose = document.querySelector('.filter-drawer__close');
  const filterOverlay = document.querySelector('.filter-drawer__overlay');

  if (filterToggle && filterDrawer) {
    filterToggle.addEventListener('click', function() {
      filterDrawer.setAttribute('aria-hidden', 'false');
      filterToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    });

    function closeFilterDrawer() {
      filterDrawer.setAttribute('aria-hidden', 'true');
      filterToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    if (filterClose) {
      filterClose.addEventListener('click', closeFilterDrawer);
    }

    if (filterOverlay) {
      filterOverlay.addEventListener('click', closeFilterDrawer);
    }
  }
})();

// Filter Form Submit
(function() {
  const filterForm = document.querySelector('.filter-drawer__form');
  
  if (filterForm) {
    filterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const url = new URL(window.location.href);
      const formData = new FormData(filterForm);
      
      url.search = '';
      
      for (const [key, value] of formData.entries()) {
        if (value) {
          url.searchParams.append(key, value);
        }
      }
      
      window.location.href = url.toString();
    });
    
    const filterInputs = filterForm.querySelectorAll('input[type="checkbox"]');
    filterInputs.forEach(function(input) {
      input.addEventListener('change', function() {
        filterForm.dispatchEvent(new Event('submit'));
      });
    });
  }
})();

// Accordion functionality for product details
(function() {
  const accordions = document.querySelectorAll('.accordion');
  
  accordions.forEach(function(accordion) {
    const summary = accordion.querySelector('.accordion__summary');
    if (summary) {
      summary.addEventListener('click', function(e) {
        e.preventDefault();
        if (accordion.hasAttribute('open')) {
          accordion.removeAttribute('open');
        } else {
          accordion.setAttribute('open', '');
        }
      });
    }
  });
})();

// Lazy loading images
(function() {
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(function(img) {
      img.src = img.src;
    });
  } else {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
  }
})();

// Custom element for variant selects
if (!customElements.get('variant-selects')) {
  customElements.define('variant-selects', class VariantSelects extends HTMLElement {
    constructor() {
      super();
    }
  });
}
