# VELORA COVE — design direction

Fictional hospitality portfolio concept. Supplied stock media illustrates the mood; it does not document one operating property. No location, rates, amenities, reviews or booking claims.

## Research before implementation

Inspected every unique supplied photograph and four distributed frames per film (including beginning/end). `research/contact-*.jpg` preserves the visual audit. All three exterior MP4s are byte-identical duplicates of the video folder. No exterior JPGs, cliffside photograph or sunset-pool photograph were supplied. Originals remain intact. Extracted film frames stand in for exterior photography; the light-change chapter uses the low-sun aerial frame, not a fabricated sunset.

- [One&Only Aesthesis](https://www.oneandonlyresorts.com/aesthesis/aesthesis-home): observed oversized editorial serif title, asymmetrical copy/film split, large images, clear space between chapters, slender CTAs. Borrow the scale relationships and quiet utility, not the layouts.
- [Soneva](https://soneva.com/): observed immersive background film, minimal centered identity, warm paper surface after the hero, scroll-progress text treatment. Measured Moulin Trial display at 48px and section type at 40px in the research viewport. The currently served homepage did not expose a separate timed entry to reproduce; Velora's 4.6-second opening is an original design.
- [Aman](https://www.aman.com/): observed warm ivory, minimal dark utility, unequal editorial columns, generous section gaps. Measured Lyon section display at about 31px. Borrow restraint, not fonts/assets.
- [Six Senses](https://www.sixsenses.com/en/): observed film → property exploration → wellness → values → stories. Transfer the progressive chapter structure without unsupported hospitality claims.

Installed design skills already cover the requested Jakub Krehel and shadcn collections: better UI, type, layout, colors, accessibility, writing, better-interface, explain-interface, variant, and interface-review. No duplicate installation needed. Applied explain-interface measurement/evidence rules. Considered three composition directions: centered full-bleed, asymmetrical film/wordmark, and framed film. Selected full-bleed for the opening and asymmetry for subsequent chapters. No variant picker enters the finished visitor experience. Native dialog/buttons suffice; shadcn does not set the visual language.

## Visual system

Sun-washed paper #f3f0e8; limestone #e5dfd2; charcoal #262b25; secondary text #5e6258; deep olive #30392f; dusk #20261f. Muted clay appears only in editorial notation if needed. No gold, shadows, rounded cards, ornament stacks or glass effects. A small original linear horizon mark accompanies the wordmark.

## Typography

Self-hosted Cormorant Garamond Latin 400/400 italic for display; Manrope Latin 400/500 for utility and body. Hero brand is architectural tracked capitals. Tagline uses a generous serif with italic emphasis. Section headings 48–80px desktop / 38–48px mobile, 1.1 line height, balanced wrapping. Body 16px / 1.65, captions/utility 12px / 1.5 with positive tracking. Three-line display headings use looser leading. No paragraph over 45ch.

## Spacing and composition

8px base: 8 / 16 / 24 / 32 / 48 / 64 / 96 / 144. Desktop side margins fluid 40–88px, content width 1440px. Mobile 24px margins (20px at 320), section gaps 80–96px. Text/images share edges.

Desktop: near-fullscreen portrait hero cropped at a lower focal point; centered wordmark above headline, spare navigation, bottom film control and scroll cue. Arrival has large left copy and a staggered photographic diptych. Stay uses one large photograph with a numbered vertical room selector and one changing description. Balcony is an immersive film interlude. Cove uses asymmetrical architectural frames. Slow living is a quiet uneven photo essay. Aerial resets the page. Closing fades spatially into olive and dusk, ending with a large typographic invitation.

Mobile: tall hero respects the supplied portrait film; brand shrinks intentionally, menu becomes a native dialog, CTA stays accessible. Arrival/Cove diptychs become single-column with a narrower inset detail. Stay selector precedes its photograph, with no horizontal scrolling. Balcony keeps horizon and door framing at 60% crop. Aerial remains a wide 4:3 window instead of an extreme portrait crop. Long copy stays short; all targets at least 44px.

## Motion system

Original 4.6-second entry: olive → line/horizon → masked wordmark and tagline → clean opacity dissolve onto the already visible hero. Immediate skip; refresh replays; no fake loading counter. Reduced motion bypasses entry.

GSAP/ScrollTrigger reveals run once, 0.9–1.3s, power2.out, 0.10s line staggering. A few desktop photographs drift by at most 4% over a viewport. No mobile parallax. Room changes use gentle 0.45s crossfades. Lenis desktop wheel smoothing only; native touch. Contexts/observers/listeners cleaned up. Motion is opt-in and changes in the media preference are handled live.

Rhythm: cinematic entry/hero → quiet arrival → editorial stay → cinematic balcony → architectural cove → still photo essay → immersive aerial → quiet dusk → typographic closing.

## Media policy

WebP sizes 640 / 1100 / 1800, frame posters, MP4 H.264 no audio, faststart, mobile source variants. Attach hero source only when motion/data preferences allow; other sources attach within 500px of the viewport. Playback pauses offscreen, in hidden tabs, or on visible pause control. Reduced motion/save-data default to posters with an explicit play option. Videos use muted/inline/loop/autoplay and no native controls. Originals never changed. Failed playback falls back to a visible poster.

## Interaction

STAY / EXPERIENCE / THE COVE scroll to chapters. JOURNAL opens a small native dialog with three original conceptual notes. PLAN YOUR ESCAPE opens a clearly labelled concept interaction; choosing a room returns to its section, with no form submission or booking infrastructure. Footer explains fiction and credits Ayyoweb3.

## Validation plan

Build/typecheck, all requested viewport widths plus 320px, desktop/tablet/mobile screenshots and per-section crops, intro normal/skip/reload, menu/dialog keyboard and focus restoration, room changes, autoplay/pause/resume/lazy attachment, live reduced-motion and save-data, crop checks, document overflow, type wraps, color measurements, interface review. Document any unavailable verification explicitly.
