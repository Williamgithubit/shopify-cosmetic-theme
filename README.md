# Cosmetic Beauty - FREE Shopify Theme

A modern, clean, and elegant FREE Shopify theme specifically designed for cosmetic and beauty stores. Perfect for skincare brands, makeup sellers, beauty salons, and cosmetic entrepreneurs.

## 🎯 Features

### Design
- **Clean & Elegant**: Soft colors and generous spacing create a premium beauty-focused aesthetic
- **Mobile-First**: Fully responsive design optimized for all devices
- **Fast Performance**: Lightweight code with lazy-loading images and optimized assets
- **Accessible**: WCAG compliant with semantic HTML and keyboard navigation support

### Homepage Sections
- **Hero Banner**: Eye-catching hero section with image/video support
- **Featured Collections**: Showcase your product categories beautifully
- **Featured Products**: Highlight your best-sellers or new arrivals
- **Image with Text**: Tell your brand story with rich content
- **Testimonials**: Build trust with customer reviews
- **Newsletter**: Grow your email list with integrated signup

### Product Pages
- **Image Gallery**: Multiple product images with thumbnail navigation
- **Variant Selection**: Button or dropdown style variant pickers
- **Collapsible Tabs**: Organized product information (Ingredients, How to Use, Shipping)
- **Cosmetic-Specific**: Dedicated sections for ingredients and usage information
- **Sticky Add-to-Cart**: Mobile-optimized sticky cart button
- **Social Sharing**: Share products on Facebook, Twitter, and Pinterest

### Collection Pages
- **Responsive Grid**: 2-5 column layouts for desktop, optimized for mobile
- **Filtering**: Price range and attribute filters
- **Sorting**: Multiple sorting options (price, name, date, etc.)
- **Pagination**: Clean pagination for easy navigation

### Customization
- **Theme Settings**: Comprehensive customization options
- **Color Scheme**: Fully customizable colors (primary, secondary, accent, background, text)
- **Typography**: Choose from Shopify's font library
- **Logo Upload**: Custom logo and favicon support
- **Social Media**: Integrated social media links

## 📦 Installation

### Method 1: Upload to Shopify

1. Download or clone this repository
2. Compress the theme folder into a `.zip` file
3. In your Shopify admin, go to **Online Store > Themes**
4. Click **Upload theme** and select your `.zip` file
5. Once uploaded, click **Customize** to start editing

### Method 2: Shopify CLI (Recommended for Developers)

```bash
# Install Shopify CLI
npm install -g @shopify/cli @shopify/theme

# Navigate to your theme directory
cd COSMETIC-THEME

# Connect to your store
shopify theme dev --store your-store.myshopify.com

# Push theme to your store
shopify theme push
```

## 🎨 Customization Guide

### Theme Settings

Access theme settings by going to **Online Store > Themes > Customize**.

#### Colors
1. Navigate to **Theme settings > Colors**
2. Customize:
   - Primary color (buttons, links)
   - Secondary color (hover states)
   - Accent color (sale badges)
   - Background color
   - Text color
   - Border color

#### Typography
1. Navigate to **Theme settings > Typography**
2. Select fonts for:
   - Headings
   - Body text

#### Logo
1. Navigate to **Theme settings > Logo**
2. Upload your logo image (recommended: PNG with transparent background)
3. Upload favicon (32x32px)

#### Social Media
1. Navigate to **Theme settings > Social Media**
2. Add your social media profile URLs

### Homepage Customization

#### Adding Sections
1. Click **Add section** at the bottom of any page
2. Choose from available sections:
   - Hero Banner
   - Featured Collections
   - Featured Products
   - Image with Text
   - Testimonials
   - Newsletter

#### Reordering Sections
- Drag and drop sections to reorder them

#### Removing Sections
- Click on a section and select **Remove section**

### Product Page Setup

The product page includes these blocks by default:
- Title
- Price
- Variant Picker
- Quantity Selector
- Buy Buttons
- Description
- Collapsible Tabs (Ingredients, How to Use, Shipping)

#### Adding Product Information

1. **Ingredients**: 
   - In the product page customization, find the "Ingredients" collapsible tab
   - Add your ingredient list in the content field
   - Or link to a page with detailed ingredient information

2. **How to Use**:
   - Add usage instructions in the "How to Use" tab
   - Include application tips and recommendations

3. **Shipping & Returns**:
   - Add your shipping and return policies
   - Or link to your policy pages

### Collection Page Setup

1. Navigate to **Online Store > Themes > Customize**
2. Select a collection from the page selector
3. Customize:
   - Products per page (8-24)
   - Number of columns (2-5)
   - Enable/disable filtering
   - Enable/disable sorting

## 🛍️ Setting Up Your Store

### Creating Collections

1. Go to **Products > Collections**
2. Click **Create collection**
3. Add a title (e.g., "Skincare", "Makeup", "Beauty Tools")
4. Add a description
5. Upload a collection image
6. Set collection type (Manual or Automated)
7. Add products to your collection

### Adding Products

1. Go to **Products > Add product**
2. Add product details:
   - Title
   - Description (include benefits, ingredients, usage)
   - Images (high-quality, well-lit photos)
   - Price
   - Variants (size, color, etc.)
   - SKU and inventory

#### Product Image Tips for Beauty Products
- Use high-resolution images (at least 2048x2048px)
- Show product from multiple angles
- Include lifestyle/usage shots
- Use consistent lighting and backgrounds
- Show product texture and color accurately

### Navigation Setup

#### Header Menu
1. Go to **Online Store > Navigation**
2. Edit the "Main menu"
3. Add links to:
   - Collections
   - Pages (About, Contact)
   - Products

#### Footer Menu
1. Edit the "Footer menu"
2. Add links to:
   - Shipping & Returns
   - Privacy Policy
   - Terms of Service
   - FAQ

## 🎯 Best Practices for Beauty Stores

### Product Descriptions
- Highlight key ingredients and benefits
- Include skin type recommendations
- Add usage instructions
- Mention certifications (cruelty-free, vegan, organic)
- **Important**: Avoid medical or health claims

### Product Photography
- Use natural lighting
- Show product size/scale
- Include before/after images (if applicable)
- Show product texture and consistency
- Use models with diverse skin tones

### Trust Building
- Add customer testimonials
- Display certifications and badges
- Include ingredient transparency
- Show real customer photos
- Provide detailed product information

## 📱 Mobile Optimization

This theme is mobile-first and includes:
- Touch-friendly navigation
- Optimized images for mobile
- Sticky add-to-cart on product pages
- Mobile-friendly filters and sorting
- Fast loading times

## ♿ Accessibility Features

- Semantic HTML structure
- Proper heading hierarchy
- Alt text support for images
- Keyboard navigation
- Skip-to-content link
- ARIA labels and roles
- Focus indicators

## 🚀 Performance

### Optimization Features
- Lazy-loading images
- Minimal JavaScript (vanilla JS only)
- Optimized CSS
- No external dependencies
- Fast page load times

### Performance Tips
1. Compress images before uploading
2. Use WebP format when possible
3. Limit the number of products per page
4. Minimize the use of large videos

## 🆘 Support & Documentation

### Common Issues

**Issue**: Theme not displaying correctly
- **Solution**: Clear your browser cache and refresh

**Issue**: Images not loading
- **Solution**: Check image file sizes (should be under 2MB)

**Issue**: Colors not updating
- **Solution**: Save theme settings and refresh the page

### Getting Help

For issues or questions:
1. Check this README first
2. Review Shopify's theme documentation
3. Contact theme support (if available)

## 📄 File Structure

```
COSMETIC-THEME/
├── assets/
│   ├── theme.css          # Main stylesheet
│   └── theme.js           # JavaScript functionality
├── config/
│   ├── settings_data.json # Theme configuration
│   └── settings_schema.json # Theme settings structure
├── layout/
│   └── theme.liquid       # Main layout file
├── locales/
│   └── en.default.json    # English translations
├── sections/
│   ├── header.liquid      # Header section
│   ├── footer.liquid      # Footer section
│   ├── hero.liquid        # Hero banner
│   ├── featured-collections.liquid
│   ├── featured-products.liquid
│   ├── image-with-text.liquid
│   ├── testimonials.liquid
│   ├── newsletter.liquid
│   ├── product-main.liquid
│   ├── collection-grid.liquid
│   └── ...
├── snippets/
│   ├── product-card.liquid
│   ├── price.liquid
│   ├── icons.liquid
│   └── ...
├── templates/
│   ├── index.json         # Homepage template
│   ├── product.json       # Product page template
│   ├── collection.json    # Collection page template
│   ├── cart.json          # Cart page template
│   └── ...
└── README.md
```

## 🔄 Updates & Changelog

### Version 1.0.0 (Initial Release)
- Complete theme structure
- Homepage sections
- Product page with cosmetic-specific features
- Collection filtering and sorting
- Mobile-responsive design
- Accessibility features
- Performance optimizations

## 📝 License

This theme is free to use for personal and commercial projects.

## 🙏 Credits

- Icons: Feather Icons
- Fonts: Shopify Font Library
- Built following Shopify theme best practices

## 💡 Tips for Success

1. **High-Quality Images**: Invest in professional product photography
2. **Detailed Descriptions**: Provide comprehensive product information
3. **Customer Reviews**: Enable and showcase customer testimonials
4. **SEO Optimization**: Use descriptive titles and meta descriptions
5. **Mobile Testing**: Always test on real mobile devices
6. **Fast Loading**: Optimize all images before uploading
7. **Clear Navigation**: Keep your menu structure simple and intuitive
8. **Trust Signals**: Display security badges and certifications

## 🎓 Learning Resources

- [Shopify Theme Documentation](https://shopify.dev/themes)
- [Liquid Template Language](https://shopify.dev/api/liquid)
- [Shopify Design Guidelines](https://polaris.shopify.com/)

---

**Built with ❤️ for beauty entrepreneurs**

For the latest updates and support, visit our GitHub repository.
