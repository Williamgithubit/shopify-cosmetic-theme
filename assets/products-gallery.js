/**
 * Products Gallery - Infinite Scroll & Masonry Layout
 * Premium Beauty Theme - Aura Cosmetics
 */

class ProductsGallery {
  constructor() {
    this.grid = document.querySelector(".products-gallery__grid");
    this.loadMoreButton = document.querySelector("[data-load-more]");
    this.filterItems = document.querySelectorAll(
      ".products-gallery__filter-item"
    );
    this.productItems = document.querySelectorAll(".products-gallery__item");
    this.isMasonry =
      this.grid &&
      this.grid.classList.contains("products-gallery__grid--masonry");

    this.init();
  }

  init() {
    if (!this.grid) return;

    // Initialize masonry layout
    if (this.isMasonry) {
      this.initMasonry();
    }

    // Initialize category filters
    this.initFilters();

    // Initialize infinite scroll
    this.initInfiniteScroll();

    // Initialize scroll animations
    this.initScrollAnimations();
  }

  initMasonry() {
    // Using CSS columns for masonry effect
    // No additional JS needed as we're using CSS columns
    // This is more performant than JS-based masonry libraries

    // Add resize handler to maintain layout
    window.addEventListener("resize", () => {
      // Force reflow on resize
      this.grid.style.display = "none";
      setTimeout(() => {
        this.grid.style.display = "";
      }, 10);
    });
  }

  initFilters() {
    if (!this.filterItems.length) return;

    this.filterItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();

        // Remove active class from all filters
        this.filterItems.forEach((filter) =>
          filter.classList.remove("products-gallery__filter-item--active")
        );

        // Add active class to clicked filter
        item.classList.add("products-gallery__filter-item--active");

        const category = item.getAttribute("data-category");

        // Show all products if "All" is selected
        if (category === "all") {
          this.productItems.forEach((product) => {
            product.style.display = "";
            // Add animation class with slight delay
            setTimeout(() => {
              product.classList.add("animate");
            }, 10);
          });
        } else {
          // Show only products in the selected category
          this.productItems.forEach((product) => {
            if (product.getAttribute("data-category") === category) {
              product.style.display = "";
              // Add animation class with slight delay
              setTimeout(() => {
                product.classList.add("animate");
              }, 10);
            } else {
              product.style.display = "none";
              product.classList.remove("animate");
            }
          });
        }
      });
    });
  }

  initInfiniteScroll() {
    if (!this.loadMoreButton) return;

    this.loadMoreButton.addEventListener("click", () => {
      const nextUrl = this.loadMoreButton.getAttribute("data-next-url");
      if (!nextUrl) return;

      this.loadMoreButton.classList.add("is-loading");

      fetch(nextUrl)
        .then((response) => response.text())
        .then((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");

          // Get new products
          const newProducts = doc.querySelectorAll(".products-gallery__item");

          // Append new products
          newProducts.forEach((product) => {
            const clone = product.cloneNode(true);
            this.grid.appendChild(clone);

            // Add to our product items collection
            this.productItems = [...this.productItems, clone];

            // Animate in with slight delay
            setTimeout(() => {
              clone.classList.add("animate");
            }, 100);
          });

          // Update load more button with new next URL
          const newLoadMoreButton = doc.querySelector("[data-load-more]");
          if (newLoadMoreButton) {
            const newNextUrl = newLoadMoreButton.getAttribute("data-next-url");
            this.loadMoreButton.setAttribute("data-next-url", newNextUrl);
          } else {
            // No more products to load
            this.loadMoreButton.remove();
          }

          // Update pagination info
          const paginationInfo = doc.querySelector(
            ".products-gallery__pagination-info"
          );
          if (paginationInfo) {
            const currentInfo = document.querySelector(
              ".products-gallery__pagination-info"
            );
            if (currentInfo) {
              currentInfo.innerHTML = paginationInfo.innerHTML;
            }
          }

          this.loadMoreButton.classList.remove("is-loading");
        })
        .catch((error) => {
          console.error("Error loading more products:", error);
          this.loadMoreButton.classList.remove("is-loading");
        });
    });
  }

  initScrollAnimations() {
    const animateOnScroll = () => {
      const items = document.querySelectorAll(
        ".products-gallery__item:not(.animate)"
      );
      items.forEach((item, index) => {
        const position = item.getBoundingClientRect();
        // If the item is in the viewport or above it (already visible)
        if (position.top < window.innerHeight) {
          // Add slight stagger effect based on index
          setTimeout(() => {
            item.classList.add("animate");
          }, index * 50);
        }
      });
    };

    // Run on scroll
    window.addEventListener("scroll", animateOnScroll);

    // Run once on load - immediately animate all visible items
    setTimeout(() => {
      const items = document.querySelectorAll(".products-gallery__item");
      items.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add("animate");
        }, index * 30);
      });
    }, 50);
  }
}

// Initialize on DOM content loaded
document.addEventListener("DOMContentLoaded", () => {
  new ProductsGallery();
});
