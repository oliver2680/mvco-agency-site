## What we’re building
- Static marketing site for MVCO Agency showcasing hero, client logos, services cards, case studies, etc.

## Current problem / objective
- Maintain smooth hero animation, marquee logo loop, and new services card UI; future tasks should pick up from current layout.

## What we tried + outcomes
- Converted client showcase into auto-scrolling marquee with duplicated logos; reduced logo sizes and added gradient effects.  
- Replaced services accordion with three-card layout using hover overlays and fixed card height.  
- Ensured hero text alignment, scroll locking during animation, and new SVG logos load correctly.

## Key files + paths
- `index.html` – main one-page markup (hero, clients, services, case studies).  
- `assets/css/main.css` – global styles plus hero, marquee, services card rules, animations.  
- `assets/js/main.js` – hero animation helpers, scroll locking, gradient interactions.  
- `assets/img/clients/*.svg` – client logos for marquee.  
- `assets/img/services/*.avif` – service card imagery.

## Commands to run
- `npx serve` (or any static server) if you need a quick local preview.

## Definitions / conventions
- “Hero” = top section with MV & Co. logo animation.  
- “Client marquee” refers to the auto-scrolling logo strip under the hero.  
- “Service cards” are the three hoverable tiles replacing the old accordion.
