# Photography credits and asset policy — Senada Demos

## Stock photography added to all interactive demonstrations

The demo sites are fictional brands and contain **illustrative stock photos**, not photographs of products actually sold by Senada Supply, items served at Senada Coffee, products of Senada Bloom, staff or offices of Senada Prime, or achievements of Senada Prime.

- **Senada Coffee:** real coffee/food photos in the hero, menu cards, small cart previews, and story section.
- **Senada Bloom:** real skincare/beauty product photos in the hero, collection cards, and story section.
- **Senada Prime:** real office building and workspace/team photos in the hero and sample case studies.
- **Senada Supply:** real clothing/fashion photos in the hero, product cards, selected product detail, cart previews, and lookbook.
- **Senada Journey:** real destination photos from Wikimedia Commons in the hero, travel cards, itinerary detail, with separate author and license crediting. See [TRAVEL-PHOTO-CREDITS.md](TRAVEL-PHOTO-CREDITS.md).

The first four use image files hosted by [Unsplash](https://unsplash.com/) and are subject to the [Unsplash License](https://unsplash.com/license). Images from Unsplash may be used in personal or commercial projects under their terms. Photographer attribution is appreciated but not mandatory under the free Unsplash License. Note that special permissions may be necessary where identifiable people, brand marks or other protected elements are depicted.

### Implementation

- Shared CSS and JS: `demo-real-photos.css`, `demo-real-photos.js`.
- Main studio preview cards: `../demo-card-photos.css`, `../demo-card-photos.js`.
- The photo IDs and descriptions are defined in these JS files so images may be replaced without touching storefront business logic.
- Photos are loaded remotely and cropped with `object-fit:cover` and responsive CSS. External photo URLs can change or fail. When load fails, existing SVG/CSS graphics remain.
- All order, coupon, inventory, pricing, and booking flows remain **demonstrations only**.

**For final production websites**, use photos licensed for that specific business and accurately depicting the goods, places, employees, and services being represented. Prefer optimized WebP/AVIF assets stored in a controlled asset folder or trusted CDN for reliability.
