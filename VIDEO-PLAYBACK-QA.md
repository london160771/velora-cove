# Film playback recovery

## Root cause

The previous Film button only updated React state. `video.play()` happened later in an effect, outside the direct tap call stack. After autoplay rejection, a browser requiring a user gesture could reject that deferred request too. The rejection was swallowed without a retry state.

Manual play now calls `video.play()` synchronously from the button handler. It attaches the current mobile/desktop source and loads it when needed within that same interaction. Source attachment has one imperative owner: React must not rewrite `src` after a manual request, because that can abort the first play while media is loading.

Playback promises are handled explicitly. Rejection exposes Retry Film, blocks automatic repeated attempts, and leaves manual retry available. Request IDs discard stale results after pause, source changes, or unmount. Observer and visibility effects avoid duplicating a pending manual play. Pause also calls the native media method directly.

## Regression checks before commit

Checked in installed desktop Chrome and its 390 × 844 viewport, using the actual Film component and supplied MP4s. A local, Git-ignored harness injected `NotAllowedError` into automatic/manual play calls and recorded whether `play()` occurred within the button handler call stack.

- Normal desktop and mobile autoplay: playing; lower films initially have no source.
- Rejected autoplay: Retry Film; a manual retry calls play directly and succeeds, including the mobile encode.
- Rejected manual play: Retry Film; the next tap succeeds.
- Manual pause/resume: native paused state and button label agree.
- First tap without an attached source: correct mobile MP4 plays under both `/?motion=reduce` and `/?data=save`; no delayed-render AbortError.
- Scroll to morning: hero pauses; balcony attaches and plays; aerial remains deferred. Scroll home: hero resumes and balcony pauses.
- Visibility handler: simulated `document.hidden` plus `visibilitychange` pauses all films and resumes eligible playback; a manually paused film remains paused.
- Muted, playsInline, loop, posters and responsive source selection retained; no CSS, crop, layout, animation, metadata, or other interaction changes.
- `npm run build`: TypeScript and production Vite build pass.

Physical iPhone Chrome/Safari permission behavior and a native OS/browser tab visibility transition were not verified here. Mobile viewport testing and injected rejection cover the app control flow, not the iOS browser engine. On the deployed build, verify Play/Retry after blocked autoplay on iPhone Chrome and repeat pause/resume, scrolling away/back, and switching tabs.
