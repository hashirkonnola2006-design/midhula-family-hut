# Midhula Farm Hut — Official Website

> **"ADIPOLI GUPPIES"**  
> Bold 3D clay-styled front-end homepage for **Midhula Farm Hut**, an ornamental fish farm based in Nooluvally, Thrissur, Kerala.

Built for the website competition, engineered with tactile pressed-clay aesthetics, light palettes, fluid responsive typography, and optimized for ultra-smooth performance on mobile and desktop.

---

## Design System & Art Direction

The aesthetic is inspired by tactile clay animation and bold poster typography:
- **Warm Butter-Yellow Canvas**: `#FFE9A8` with a subtle central radial glow.
- **Alternating Section Surfaces**: Light butter-yellow, soft aqua (`#BFEFF5`), and warm cream (`#FFF6E3`), separated by soft wavy clay-style dividers.
- **Electric Cobalt Blue Clay Typography**: `#1F4BFF` with layered soft bevel highlights, rounded darker extrusion shading, and ambient drop shadows.
- **Tactile Clay Tiles**: `28px` rounded corners, subtle inner highlights, soft drop shadows, and responsive squash-and-press physics on hover and tap.
- **Signature Orange Buttons**: `#FF6A1A` clay pill action buttons with white icons and subtle inner gloss.
- **Interactive Water Physics**: Soft canvas-drawn clay ripple rings on movement/click with gentle letter displacement squishing, sinking clay food pellets, and fish feeding reactions.

---

## Sections Architecture

1. **Sticky Clay Navbar**:
   - Brand logo in a soft cream circular badge with subtle rim shadow.
   - Dark navy navigation links (`Fish`, `Farm`, `Shipping`, `Contact`).
   - Bilingual `EN | മലയാളം` instant toggle.
   - Orange `#FF6A1A` pill `"WhatsApp"` button and full-screen clay mobile drawer.
2. **Hero: "ADIPOLI GUPPIES" Clay Poster**:
   - Giant fluid clay headline in electric blue (`clamp(4.2rem, 13.2vw, 11.2rem)`).
   - Calm, realistic clay guppy fauna (Orange fan tail, Pink, Blue peeking inside `"O"`, Small orange, Swordtail).
   - Bottom-corner stacked grey clay rocks, green seaweed ribbons, and red clay crayfish.
   - Sinking clay pellets and expanding tactile ripple rings with letter squish displacement.
   - Location pill: `"📍 Nooluvally, Thrissur - Kerala"`, subtitle, and clay action buttons.
3. **"Our Fish" Species Tiles**:
   - 5 clay tiles (Guppy, Platy, Swordtail, Crayfish, Shrimp).
   - Real farm photos in rounded frames, care tags, and species-specific pre-filled WhatsApp inquiry links.
4. **"Inside the Farm"**:
   - Split section with Nooluvally open-air mineral water breeding story, photo switcher collage, and YouTube walkthrough popup modal.
5. **Stats Row**:
   - Scroll-triggered count-up badges: **28.7K+** Instagram family, **75K+** YouTube subscribers, **1,500+** educational reels, and **100%** Live Arrival Guarantee across India.
6. **"How We Ship Live Fish"**:
   - 4 steps (Choose, Pack, Ship, Delivered) along a wavy clay path with clay icons and packing photos.
7. **"Happy Customers"**:
   - Horizontally scrollable row of rounded photo cards with scroll-snap, star ratings, and verified buyer locations.
8. **Final CTA Band**:
   - Electric blue background (`#1F4BFF`) with white clay headline `"Ready to fill your tank?"` and orange WhatsApp button.
9. **Footer**:
   - Cream circular logo badge, location details, social links, and founder's note (with client confirmation `TODO`).

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animation**: `framer-motion` (hardware-accelerated transforms & spring physics)
- **Icons**: `lucide-react`
- **Zero Heavy 3D Dependencies**: Lightweight, fast-loading, pure SVG and Canvas architecture.

---

## Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node v24)
- npm or pnpm

### 2. Installation
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## Deploying to Vercel

### Option 1: Vercel Dashboard (Recommended)
1. Push code to GitHub / GitLab / Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel automatically detects Next.js settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. Click **Deploy**.

### Option 2: Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## Project Structure

```
midhula-farm-hut/
├── app/
│   ├── globals.css              # Clay design tokens, text-shadows, animations
│   ├── layout.tsx               # Font loading (Baloo 2, Fredoka, Poppins, Noto Sans Malayalam)
│   └── page.tsx                 # Main layout with wavy clay section dividers
├── components/
│   ├── ClayWaveDivider.tsx      # Smooth rounded clay-style transition waves
│   ├── Navbar.tsx               # Sticky cream pill navbar & mobile clay menu
│   ├── VideoModal.tsx           # Malayalam farm tour video popup
│   ├── hero/
│   │   ├── Hero.tsx             # Clay headline, microcopy & action buttons
│   │   ├── ClayFish.tsx         # Articulated inline SVG clay fish (orange, pink, blue, swordtail, peek)
│   │   ├── ClayProps.tsx        # Seaweed, rocks, red crayfish, bubbles, droplets & star
│   │   ├── ClayRipples.tsx      # Interactive ripple rings & sinking clay food pellets
│   │   └── FishField.tsx        # Multi-depth swimming lanes, tail wags, feeding & avoidance
│   └── sections/
│       ├── SpeciesSection.tsx   # "Our Fish" 5 clay tiles with WhatsApp deep-links
│       ├── FarmSection.tsx      # "Inside the Farm" story collage & YouTube preview
│       ├── StatsSection.tsx     # Animated count-up clay stat tiles
│       ├── ShippingSection.tsx  # 4-step live shipping pipeline along wavy clay path
│       ├── ReviewsSection.tsx   # "Happy Customers" horizontal scrollable photo cards
│       ├── CtaSection.tsx       # Electric blue CTA banner with white clay headline
│       └── Footer.tsx           # Cream footer with circular emblem badge
├── lib/
│   └── content.ts               # Central bilingual copy, contacts, species & shipping config
└── public/
    ├── logo.png                 # Official circular dark emblem
    ├── reference/
    │   └── hero.png             # Target reference composition
    └── photos/                  # Local optimized photos for species, tubs & packaging
```
