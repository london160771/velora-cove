# VELORA COVE — interface review

## Scope and coverage

Reviewed the complete new landing page, entry, three room states, mobile navigation, concept escape dialog, journal, film controls and reduced-motion/save-data states. Stack: React/TypeScript/Vite, Tailwind semantic tokens with editorial component CSS, GSAP/ScrollTrigger and Lenis. There was no existing interface, package, Git history or AGENTS.md in the starting workspace. `DESIGN.md` is the project's design convention source. Consequently this is a complete new-interface audit against the brief, rather than a historical regression diff. The installed interface-review scope rules and better-interface consolidation rules were applied; there are no pre-existing interface findings.

Applied all six installed owning skills and the explain-interface evidence rules.

| Domain | Evidence inspected | Result |
| --- | --- | --- |
| Accessibility | Native elements, AX snapshots, named controls, focus outlines, radio keyboard behavior, dialog focus loop/Escape/restoration, intro inert boundary, video pause controls, preference policies | Clear within tested browser scope |
| Layout | Full desktop page, tablet room composition, mobile chapters and films, geometry checks at 320/375/390/430/768/1024/1280/1440/1920, content/controls within margins | Clear |
| Writing | Every label/action pairing, conceptual room descriptions, all journal notes, fictional disclosures, CTA destinations | Clear |
| Typography | Self-hosted genuine regular/italic faces, body measure, display wrapping at requested widths, smallest-width closing adjustment, readable utility scale | Clear |
| Colors | Token contrast calculation plus sampled source-frame compositions using measured browser text bounds, desktop and mobile hero, balcony text, dusk surfaces | Clear for measured samples |
| UI | Room changes, menu/dialog states, film play/pause/resume, intro/skip/replay, chapter choreography, light/olive/dusk rhythm | Clear |

No actionable interface findings remain in the inspected scope.

## Findings resolved during review

| Domain | Location | Observed issue | Implemented correction |
| --- | --- | --- | --- |
| Typography | src/styles.css:263 | Mobile tagline broke into three lines | Reduced the mobile display step; retained two deliberate lines |
| Colors | src/styles.css:76, src/styles.css:260 | Bright film frames passed beneath low-contrast text | Adjusted cinematic scrims from the sampled frame measurements |
| Accessibility | src/App.tsx:134 | Native dialog Tab behavior allowed focus to leave the document at the final control | Added explicit forward/reverse focus wrapping; Escape and trigger restoration retained |
| Layout | src/App.tsx:163 | Initial hash navigation could precede React's section render/intro completion | Restored the requested section after layout and intro state changes |
| Accessibility | src/App.tsx:172 | Intro and modal body locks could overlap during cleanup | Intro and dialog now each own their separate lifecycle; verified scrolling restored after close |
| UI / performance | src/App.tsx:62 | Resize testing retained the initial desktop media variant | Responsive media query listener changes the encode and returns to its poster while the new source becomes ready |
| Layout | src/styles.css:333 | Mobile aerial window's old minimum height overrode its intended wide crop | Removed the conflicting minimum height; retained a 4:3 mobile visual reset |

## Verification

Passed:

- `npm run build` — TypeScript and production Vite build succeed. Approximately 125KB compressed application + motion JS, 7KB compressed CSS. The four WOFF2 faces total about 75KB; only needed files load.
- `npm install` — 46 packages audited, zero reported vulnerabilities at installation.
- Local development and production preview both served successfully. Production tested through `http://127.0.0.1:4174/`.
- Every supplied unique photograph and film inspected via contact sheets; three exterior duplicates verified byte-for-byte. Originals preserved.
- Full desktop and mobile scroll walks and full-page screenshots, plus individual desktop/tablet/mobile section and interaction screenshots. Short mobile at 375 × 667 keeps the hero film control inside the viewport.
- Geometry at 320, 375, 390, 430, 768, 1024, 1280, 1440 and 1920px: no horizontal document overflow; no unnamed buttons.
- Fresh production runtime checked separately from an earlier development-only hot-reload warning after an effect dependency signature was changed.
- Room radio selection changes image, descriptive alt text, label, count and live copy. Native keyboard selection path preserved.
- Dialog initial focus, Tab/Shift+Tab wrapping, Escape, trigger restoration, body overflow restoration and concept-room selection.
- Intro visible/inert page on refresh; skip clears the intro/body lock; timeline is 4.6 seconds.
- Hero autoplay and the production mobile encode confirmed; muted playback state and playsInline/loop/no-native-controls attributes inspected. Lower films initially have no source.
- Balcony automatic playback, visible pause, explicit resume, and source deferral observed. Offscreen and hidden-tab pause policies inspected in source.
- Reduced-motion route has no intro or automatically attached film sources; explicit play works. Reduced-motion state also suppresses CSS transitions.
- Token contrast: ink/paper 12.68:1; secondary/paper 5.48:1; secondary/limestone 4.70:1; paper/olive 10.53:1; secondary/dusk 10.25:1.
- Conservative sampled source-frame bounds after scrims: desktop hero small copy at least 5.13:1, large display at least 3.47:1; mobile hero small supporting copy at least 4.78:1, brand at least 3.22:1. Balcony sample text regions exceed their requirements. These measurements use actual source frames, measured DOM positions and declared compositing; they do not claim every pixel of every movie frame was sampled.

Not verified:

- A physical iOS/Android device, Safari/Firefox, NVDA/VoiceOver, forced-colors OS mode, actual system preference toggling and live browser save-data toggling. The preference code and the corresponding review routes are covered; actual OS/device integrations remain unverified.
- Browser zoom at exactly 200% and RTL mirroring. 320px reflow was checked, but is not a claim of an actual 200% zoom test.
- Movie/reveal choreography slowed to exactly 10% in DevTools; normal-speed choreography and source timing were reviewed.
- A Lighthouse/network-throttling score. Media attachment strategy, asset sizes, build output and rendered playback were inspected instead.

## Verdict

**Approve** for the documented local Chromium, source and responsive review scope. Physical-device and assistive-technology checks remain explicit coverage limits.
