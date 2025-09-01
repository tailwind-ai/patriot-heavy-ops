# Hero Images

This directory contains the hero background images for the Patriot Heavy Ops website.

## Image Requirements

### hero-desktop.webp
- **Purpose**: Desktop hero background image
- **Dimensions**: 1920x1080px minimum (16:9 aspect ratio)
- **Content**: Military personnel in fatigues standing beside a yellow bulldozer with military transport aircraft (C-17) in background
- **Lighting**: Sunset/sunrise with orange/yellow sky
- **Format**: WebP, optimized for web (max 300KB)

### hero-mobile.webp
- **Purpose**: Mobile hero background image
- **Dimensions**: 1080x1920px minimum (9:16 aspect ratio)
- **Content**: Person in military flight suit leaning against construction vehicle blade with military transport aircraft in background
- **Lighting**: Sunset/sunrise with golden/orange sky
- **Format**: WebP, optimized for web (max 200KB)

## Implementation Notes

- Images are loaded responsively using Next.js Image component
- Desktop image shows on screens md (768px) and larger
- Mobile image shows on screens smaller than md
- Semi-transparent overlay (bg-black/40) ensures text readability
- Images use `object-cover` to maintain aspect ratio while filling container
- Priority loading enabled for better performance
- WebP format provides better compression and faster loading than JPG

## Current Status

✅ **Images Added** - WebP format images are now being used for optimal performance.
