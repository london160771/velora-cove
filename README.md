# VELORA COVE

A fictional coastal hospitality concept designed and developed as a portfolio project by **Ayyoweb3**.

## Run

```sh
npm install
npm run dev
```

Development: http://127.0.0.1:5174

```sh
npm run build
npm run preview
```

Production preview: http://127.0.0.1:4174. `dist/` is a static build suitable for static hosting. No deployment was performed.

## Stack

React, TypeScript, Vite, Tailwind CSS, GSAP/ScrollTrigger, Lenis. Cormorant Garamond and Manrope are self-hosted; font licenses are included in `public/licenses/`. Native buttons, radio inputs and dialogs provide the interaction primitives.

## Experience

A 4.6-second skippable entry leads into a muted pool/sea film. The page progresses through Arrival, Stay, a morning film, The Cove, Slow Living, an aerial film, Last Light, and a closing invitation. The room selector presents three fictional categories. Journal and Plan Your Escape open concept dialogs. Choosing a room returns to that category, with keyboard focus on its selector.

Fiction is stated in the opening, hero, accommodation content, modal and footer. The supplied stock media illustrates the concept and does not document a single operating property.

## Assets

All imagery comes from the supplied stock files. No resort imagery was generated and no reference-site media was copied.

The exterior folder contains byte-identical duplicates of the three films. The expected cliffside-resort.jpg, villa-pool.jpg and sunset-pool.jpg were absent. Exterior stills and posters are extracted from the supplied films; Last Light uses the aerial's low sunlight rather than inventing a sunset photograph.

Originals are preserved locally under `public/assets/rooms`, `video`, and `exterior`. The repository includes the canonical room and video originals; byte-identical exterior film copies and local research artifacts are ignored. The website requests only the derivatives in `public/assets/optimized`.

- WebP stills at 640, 1100 and 1800 output tiers (portrait source frames remain at their original 1080px maximum width).
- Silent H.264 MP4s at 25fps with faststart, separate desktop/mobile sizes.
- Original-to-derivative mappings, dimensions and byte sizes: `public/assets/optimized/manifest.json`.
- Reproducible generation: `scripts/prepare-media.py` (requires Pillow and ffmpeg on PATH).
- Full visual audit: `research/contact-*.jpg` and `DESIGN.md`.

## Media and motion

Only the hero attaches immediately. The other film sources attach within 500px of the viewport, pause offscreen or in hidden tabs, and have visible play/pause controls. Responsive sources update when the viewport crosses 700px. Reduced motion disables the opening, Lenis, ScrollTrigger reveals, parallax and automatic playback. Save-data disables automatic film attachment/playback. Both allow explicit playback. Every film has a poster and a retry/fallback state.

ScrollTrigger contexts, Lenis ticker callbacks, media listeners and intersection observers are cleaned up. Touch scrolling stays native. Mobile removes parallax and simplifies the image compositions.

## Review routes

These routes exercise the same state used by browser preferences; they do not change the operating system:

- `/?motion=reduce` — static layout, no entry, no automatic film source attachment.
- `/?data=save` — data-saving film policy, with the opening retained.

Review results and remaining physical-device verification limits: `INTERFACE-REVIEW.md`.
