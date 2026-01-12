# Products Gallery Page - Instagram-Style Photo Gallery

This guide explains how to use the new Products Gallery page template that creates a visually stunning, Instagram-style photo gallery for your cosmetics products.

## Features

- **Masonry Grid Layout**: Pinterest-style staggered grid that showcases your product images beautifully
- **Elegant Hover Effects**: Subtle zoom, secondary image reveal, and overlay effects on hover
- **Category Filters**: Pill-style category filters at the top for easy navigation
- **Infinite Scroll**: Load more products as users scroll down the page
- **Responsive Design**: Optimized for all devices (3-4 columns on desktop, 2 on tablet, 1 on mobile)
- **Minimal Text Display**: Focus on beautiful product photography with minimal text distraction
- **Smooth Animations**: Fade-in effects when scrolling and filtering

## How to Use

### 1. Create a Page in Shopify Admin

1. Go to your Shopify admin → Online Store → Pages
2. Click "Add page"
3. Set the title to "Products" (or any title you prefer)
4. In the "Template" dropdown at the right sidebar, select "page.products"
5. Click "Save"

### 2. Customize the Page

1. Go to your Shopify admin → Online Store → Themes
2. Click "Customize" on your current theme
3. In the theme editor, navigate to the "Products" page you just created
4. You'll see customization options in the sidebar:
   - Heading text and size
   - Number of columns
   - Image ratio (portrait, square, landscape)
   - Hover effects
   - Category filters
   - Pagination settings

### 3. Prepare Your Product Images

For the best visual impact, we recommend:

- **High-quality images**: Use images at least 1000px wide
- **Consistent aspect ratio**: Maintain consistent dimensions for a cleaner grid
- **Multiple images per product**: Add at least 2 images to enable the hover effect
- **Visual variety**: Mix product shots, lifestyle images, texture close-ups, and ingredient photos
- **Light backgrounds**: Images with white/light backgrounds work best with the design

### 4. Set Product Categories

The category filters use your product types. Make sure your products have appropriate product types assigned:

1. Go to Shopify admin → Products
2. Edit each product and set its "Product type" to match one of your filter categories
3. Common categories for cosmetics: Skincare, Makeup, Haircare, Fragrance, etc.

### 5. Add Custom Badges (Optional)

To add "New" badges to products:
1. Go to Shopify admin → Products
2. Edit the product and add "new" as a tag

To add custom badges (like "Bestseller" or "Vegan"):
1. Go to Shopify admin → Products
2. Edit the product
3. Under "Metafields", add a metafield:
   - Namespace: custom
   - Key: badge
   - Value: Your badge text (e.g., "Bestseller")

## Customization Tips

### Changing Colors

To modify the color scheme, edit the CSS variables in the `products-gallery.css` file:

```css
:root {
  --color-gallery-bg: #FFFFFF;        /* Background color */
  --color-gallery-accent: #D4A373;    /* Accent color (gold) */
  --color-gallery-accent-light: #F5EDE6; /* Light accent color */
  --color-gallery-text: #2C2C2C;      /* Text color */
  --color-gallery-text-light: #666666; /* Light text color */
  --color-gallery-border: #E8DDD4;    /* Border color */
  --color-gallery-overlay: rgba(44, 44, 44, 0.3); /* Overlay color */
}
```

### Adding More Categories

To add or change the category filters:
1. Go to your Shopify admin → Online Store → Themes → Customize
2. Navigate to the Products page
3. Find the "Filter categories" setting
4. Edit the comma-separated list of categories

## Technical Notes

- The gallery uses CSS columns for the masonry layout rather than JavaScript for better performance
- Infinite scroll is implemented with a "Load more" button that fetches additional products via AJAX
- The page is designed to work with all product types and collections
- The design prioritizes image quality and visual impact over detailed product information

## Need Help?

If you need assistance with your Products Gallery page, please contact your theme developer or Shopify support.

---

Enjoy your beautiful new product gallery page!
