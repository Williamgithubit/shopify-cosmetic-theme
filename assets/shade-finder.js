// Shade Finder Quiz Functionality
class ShadeFinder {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 3;
    this.answers = {};
    this.quiz = document.getElementById('shadeFinder');
    
    if (!this.quiz) return;
    
    this.init();
  }

  init() {
    this.attachEventListeners();
    this.updateNavigation();
  }

  attachEventListeners() {
    // Option selection
    this.quiz.addEventListener('click', (e) => {
      const option = e.target.closest('.shade-finder__option');
      if (option && !option.closest('.shade-finder__results')) {
        this.selectOption(option);
      }
    });

    // Navigation buttons
    const prevBtn = this.quiz.querySelector('.shade-finder__prev');
    const nextBtn = this.quiz.querySelector('.shade-finder__next');
    const restartBtn = this.quiz.querySelector('.shade-finder__restart');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.previousStep());
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextStep());
    }

    if (restartBtn) {
      restartBtn.addEventListener('click', () => this.restart());
    }

    // Keyboard navigation
    this.quiz.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const option = e.target.closest('.shade-finder__option');
        if (option) {
          e.preventDefault();
          this.selectOption(option);
        }
      }
    });
  }

  selectOption(option) {
    const step = option.closest('.shade-finder__step');
    const stepNumber = parseInt(step.dataset.step);
    const value = option.dataset.value;
    
    // Remove previous selection
    step.querySelectorAll('.shade-finder__option').forEach(opt => {
      opt.classList.remove('selected');
      opt.setAttribute('aria-selected', 'false');
    });
    
    // Mark as selected
    option.classList.add('selected');
    option.setAttribute('aria-selected', 'true');
    
    // Store answer
    const questionMap = {
      1: 'skinTone',
      2: 'undertone',
      3: 'concern'
    };
    
    this.answers[questionMap[stepNumber]] = value;
    
    // Enable next button
    const nextBtn = this.quiz.querySelector('.shade-finder__next');
    if (nextBtn) {
      nextBtn.disabled = false;
    }
    
    // Auto-advance on last step
    if (stepNumber === this.totalSteps) {
      setTimeout(() => this.showResults(), 300);
    }
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.updateSteps();
      this.updateNavigation();
      this.updateProgress();
    } else {
      this.showResults();
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateSteps();
      this.updateNavigation();
      this.updateProgress();
    }
  }

  updateSteps() {
    const steps = this.quiz.querySelectorAll('.shade-finder__step');
    steps.forEach((step, index) => {
      if (index + 1 === this.currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
  }

  updateNavigation() {
    const prevBtn = this.quiz.querySelector('.shade-finder__prev');
    const nextBtn = this.quiz.querySelector('.shade-finder__next');
    
    if (prevBtn) {
      prevBtn.disabled = this.currentStep === 1;
    }
    
    if (nextBtn) {
      const currentStepEl = this.quiz.querySelector(`.shade-finder__step[data-step="${this.currentStep}"]`);
      const hasSelection = currentStepEl && currentStepEl.querySelector('.shade-finder__option.selected');
      nextBtn.disabled = !hasSelection;
      
      if (this.currentStep === this.totalSteps) {
        nextBtn.textContent = 'See Results';
      } else {
        nextBtn.innerHTML = 'Next <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>';
      }
    }
  }

  updateProgress() {
    const progressFill = this.quiz.querySelector('.shade-finder__progress-fill');
    const currentStepText = this.quiz.querySelector('#currentStep');
    
    if (progressFill) {
      const percentage = (this.currentStep / this.totalSteps) * 100;
      progressFill.style.width = `${percentage}%`;
    }
    
    if (currentStepText) {
      currentStepText.textContent = this.currentStep;
    }
  }

  async showResults() {
    // Hide steps and navigation
    const steps = this.quiz.querySelectorAll('.shade-finder__step');
    const navigation = this.quiz.querySelector('.shade-finder__navigation');
    
    steps.forEach(step => step.style.display = 'none');
    if (navigation) navigation.style.display = 'none';
    
    // Show results
    const results = this.quiz.querySelector('.shade-finder__results');
    if (results) {
      results.style.display = 'block';
    }
    
    // Fetch and display recommended products
    await this.loadRecommendations();
  }

  async loadRecommendations() {
    const resultsContainer = document.getElementById('shadeFinderResults');
    if (!resultsContainer) return;
    
    // Show loading state
    resultsContainer.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <div class="loading-spinner" style="margin: 0 auto;"></div>
        <p style="margin-top: 16px; color: #666;">Finding your perfect matches...</p>
      </div>
    `;
    
    try {
      // Get collection handle from section settings
      const section = this.quiz.closest('.section-shade-finder');
      const collectionHandle = section?.dataset.collection || 'all';
      
      // Fetch products
      const response = await fetch(`/collections/${collectionHandle}/products.json?limit=4`);
      const data = await response.json();
      
      if (data.products && data.products.length > 0) {
        this.displayRecommendations(data.products);
      } else {
        resultsContainer.innerHTML = `
          <p style="text-align: center; color: #666;">No products found. Please try again.</p>
        `;
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
      resultsContainer.innerHTML = `
        <p style="text-align: center; color: #666;">Unable to load recommendations. Please try again.</p>
      `;
    }
  }

  displayRecommendations(products) {
    const resultsContainer = document.getElementById('shadeFinderResults');
    if (!resultsContainer) return;
    
    const productsHTML = products.slice(0, 3).map(product => {
      const price = this.formatMoney(product.variants[0].price);
      const image = product.images[0] || '';
      
      return `
        <div class="shade-finder__result-card">
          <a href="/products/${product.handle}" class="shade-finder__result-link">
            <div class="shade-finder__result-image">
              <img src="${image}" alt="${product.title}" loading="lazy">
            </div>
            <h4 class="shade-finder__result-title">${product.title}</h4>
            <p class="shade-finder__result-price">${price}</p>
            <div class="shade-finder__result-match">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Perfect Match
            </div>
          </a>
        </div>
      `;
    }).join('');
    
    resultsContainer.innerHTML = productsHTML;
  }

  formatMoney(cents) {
    return `$${(cents / 100).toFixed(2)}`;
  }

  restart() {
    this.currentStep = 1;
    this.answers = {};
    
    // Reset all selections
    this.quiz.querySelectorAll('.shade-finder__option').forEach(option => {
      option.classList.remove('selected');
      option.setAttribute('aria-selected', 'false');
    });
    
    // Hide results
    const results = this.quiz.querySelector('.shade-finder__results');
    if (results) {
      results.style.display = 'none';
    }
    
    // Show steps and navigation
    const steps = this.quiz.querySelectorAll('.shade-finder__step');
    const navigation = this.quiz.querySelector('.shade-finder__navigation');
    
    steps.forEach(step => step.style.display = '');
    if (navigation) navigation.style.display = '';
    
    this.updateSteps();
    this.updateNavigation();
    this.updateProgress();
  }
}

// Additional styles for result cards
const style = document.createElement('style');
style.textContent = `
  .shade-finder__result-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    border: 1px solid #e5e5e5;
  }
  
  .shade-finder__result-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  .shade-finder__result-link {
    display: block;
    text-decoration: none;
    color: inherit;
  }
  
  .shade-finder__result-image {
    position: relative;
    padding-bottom: 100%;
    background: #f5f5f5;
    overflow: hidden;
  }
  
  .shade-finder__result-image img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .shade-finder__result-title {
    font-size: 1.6rem;
    font-weight: 600;
    margin: 16px 16px 8px;
    line-height: 1.4;
  }
  
  .shade-finder__result-price {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--color-primary, #d4a574);
    margin: 0 16px 12px;
  }
  
  .shade-finder__result-match {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px 16px;
    font-size: 1.3rem;
    font-weight: 600;
    color: #4caf50;
  }
  
  .shade-finder__result-match svg {
    color: #4caf50;
  }
`;
document.head.appendChild(style);

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ShadeFinder();
  });
} else {
  new ShadeFinder();
}

// Reinitialize on Shopify section load (for theme editor)
if (typeof Shopify !== 'undefined' && Shopify.designMode) {
  document.addEventListener('shopify:section:load', () => {
    new ShadeFinder();
  });
}
