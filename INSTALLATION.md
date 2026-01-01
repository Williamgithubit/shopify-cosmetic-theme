# Installation Guide - Cosmetic Beauty Theme

This guide will walk you through installing the Cosmetic Beauty theme on your Shopify store.

## Prerequisites

- A Shopify store (any plan)
- Admin access to your Shopify store
- Basic understanding of Shopify (helpful but not required)

## Installation Methods

### Method 1: Direct Upload (Recommended for Beginners)

1. **Download the Theme**
   - Download the entire `COSMETIC-THEME` folder
   - Compress it into a `.zip` file (right-click > Send to > Compressed folder)

2. **Upload to Shopify**
   - Log in to your Shopify admin panel
   - Navigate to **Online Store > Themes**
   - Scroll down to the "Theme library" section
   - Click **Upload theme**
   - Select your `.zip` file
   - Wait for the upload to complete

3. **Activate the Theme**
   - Once uploaded, you'll see "Cosmetic Beauty" in your theme library
   - Click **Actions > Publish** to make it live
   - Or click **Customize** to edit before publishing

### Method 2: Shopify CLI (For Developers)

1. **Install Shopify CLI**
   ```bash
   npm install -g @shopify/cli @shopify/theme
   ```

2. **Navigate to Theme Directory**
   ```bash
   cd COSMETIC-THEME
   ```

3. **Connect to Your Store**
   ```bash
   shopify theme dev --store your-store.myshopify.com
   ```
   - This opens a development preview
   - Changes sync in real-time

4. **Push to Your Store**
   ```bash
   shopify theme push
   ```
   - Uploads the theme to your store
   - Follow prompts to confirm

## Post-Installation Setup

### Step 1: Configure Theme Settings

1. Go to **Online Store > Themes**
2. Click **Customize** on the Cosmetic Beauty theme
3. Click **Theme settings** in the left sidebar
4. Configure:
   - **Logo**: Upload your logo (recommended: PNG, 180-300px wide)
   - **Favicon**: Upload favicon (32x32px)
   - **Colors**: Set your brand colors
   - **Typography**: Choose your fonts

### Step 2: Set Up Navigation

1. Go to **Online Store > Navigation**
2. Edit **Main menu**:
   - Add links to your collections
   - Add links to important pages (About, Contact)
   - Recommended structure:
     ```
     Home
     Shop (dropdown with collections)
     About
     Blog
     Contact
     ```

3. Edit **Footer menu**:
   - Add policy pages (Shipping, Returns, Privacy)
   - Add FAQ or other helpful links

### Step 3: Add Homepage Content

1. Click **Customize** on your theme
2. On the homepage, you'll see these sections:
   - **Hero Banner**: Add a banner image and headline
   - **Featured Collections**: Select 3 collections to showcase
   - **Featured Products**: Choose a collection to display products from
   - **Image with Text**: Add your brand story
   - **Testimonials**: Add customer reviews
   - **Newsletter**: Configure email signup

3. Customize each section:
   - Click on the section
   - Edit settings in the right sidebar
   - Add images, text, and links
   - Preview changes before saving

### Step 4: Add Products

1. Go to **Products > Add product**
2. For each product, add:
   - **Title**: Clear, descriptive name
   - **Description**: Benefits, ingredients, usage
   - **Images**: High-quality photos (at least 2048x2048px)
   - **Price**: Regular and compare-at price
   - **Variants**: Sizes, colors, etc.
   - **Collections**: Assign to relevant collections

#### Product Image Tips
- Use consistent lighting and backgrounds
- Show product from multiple angles
- Include lifestyle/usage shots
- Optimize images before uploading (compress to under 500KB)

### Step 5: Create Collections

1. Go to **Products > Collections**
2. Create collections like:
   - Skincare
   - Makeup
   - Beauty Tools
   - Best Sellers
   - New Arrivals

3. For each collection:
   - Add a clear title
   - Write a description
   - Upload a collection image
   - Add products (manual or automated)

### Step 6: Add Pages

1. Go to **Online Store > Pages**
2. Create essential pages:
   - **About Us**: Your brand story
   - **Contact**: Contact form and information
   - **FAQ**: Common questions
   - **Shipping & Returns**: Your policies

### Step 7: Configure Social Media

1. Go to **Theme settings > Social Media**
2. Add your social media URLs:
   - Facebook
   - Instagram
   - Twitter
   - Pinterest
   - YouTube

### Step 8: Set Up Footer

1. In theme customization, scroll to **Footer**
2. Configure:
   - Footer text
   - Contact information
   - Social media icons
   - Payment icons

## Customization Tips

### Changing Colors

The theme uses a beauty-focused color palette by default:
- Primary: `#d4a574` (warm gold)
- Secondary: `#b8956a` (darker gold)
- Accent: `#e8b4b8` (soft pink)

To change:
1. Go to **Theme settings > Colors**
2. Click on any color to open the color picker
3. Choose your brand colors
4. Save changes

### Adjusting Layout

1. **Page Width**: Theme settings > Layout > Page width (1000-1600px)
2. **Button Style**: Theme settings > Layout > Button border radius
3. **Grid Columns**: Each section has column settings

### Adding Custom CSS

For advanced customization:
1. Edit `assets/theme.css`
2. Add your custom styles at the bottom
3. Use CSS variables for consistency:
   ```css
   .my-custom-class {
     color: var(--color-primary);
     font-family: var(--font-heading-family);
   }
   ```

## Troubleshooting

### Theme Not Displaying Correctly

**Problem**: Theme looks broken or unstyled
**Solution**: 
- Clear your browser cache (Ctrl+Shift+Delete)
- Try a different browser
- Check if theme is published (not just in preview)

### Images Not Loading

**Problem**: Product or section images not showing
**Solution**:
- Check image file size (should be under 2MB)
- Ensure images are in supported formats (JPG, PNG, WebP)
- Re-upload images if necessary

### Sections Not Appearing

**Problem**: Added sections don't show on the page
**Solution**:
- Make sure you clicked "Save" after adding the section
- Check if the section has required content (images, collections, etc.)
- Refresh the page

### Mobile View Issues

**Problem**: Theme doesn't look right on mobile
**Solution**:
- Use the mobile preview in theme customization
- Check image sizes (large images may cause issues)
- Test on actual mobile devices

### Colors Not Changing

**Problem**: Theme colors aren't updating
**Solution**:
- Save theme settings after making changes
- Clear browser cache
- Check if you're editing the correct theme (not a draft)

## Performance Optimization

### Image Optimization

1. **Compress Images**: Use tools like TinyPNG or Squoosh
2. **Recommended Sizes**:
   - Product images: 2048x2048px
   - Collection images: 1500x1500px
   - Hero banner: 2400x1200px
   - Thumbnails: Auto-generated by Shopify

3. **Format**: Use WebP when possible, JPG for photos, PNG for graphics

### Speed Tips

1. Limit products per page to 16-24
2. Use lazy loading (built into theme)
3. Minimize number of apps
4. Optimize all images before uploading
5. Use Shopify's CDN (automatic)

## Getting Help

### Resources

- **Shopify Help Center**: help.shopify.com
- **Theme Documentation**: See README.md
- **Shopify Community**: community.shopify.com
- **Liquid Documentation**: shopify.dev/api/liquid

### Common Questions

**Q: Can I use this theme on multiple stores?**
A: Yes, this is a free theme with no restrictions.

**Q: Will this theme work with Shopify apps?**
A: Yes, it's compatible with most Shopify apps. Some apps may require theme modifications.

**Q: Can I customize the code?**
A: Yes, you have full access to all theme files. Basic HTML/CSS knowledge recommended.

**Q: Is this theme suitable for large catalogs?**
A: This theme is optimized for small to medium catalogs (10-200 products). For larger catalogs, consider pagination and filtering strategies.

**Q: Does this theme support multiple languages?**
A: The theme structure supports Shopify's multi-language features. You'll need to add translations in the locales folder.

## Next Steps

After installation:

1. ✅ Add at least 10 products
2. ✅ Create 3-5 collections
3. ✅ Customize homepage sections
4. ✅ Set up navigation menus
5. ✅ Add essential pages (About, Contact, Policies)
6. ✅ Configure theme colors and fonts
7. ✅ Test on mobile devices
8. ✅ Set up social media links
9. ✅ Add customer testimonials
10. ✅ Launch your store!

## Support

For theme-specific issues, please refer to:
- README.md for general documentation
- GitHub Issues (if available)
- Shopify Community forums

---

**Congratulations on installing the Cosmetic Beauty theme!** 🎉

Your beautiful online beauty store is ready to launch. Take your time customizing it to match your brand, and don't hesitate to experiment with different layouts and settings.
