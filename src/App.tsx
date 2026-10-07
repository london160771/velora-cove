import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)
const base = '/assets/optimized/'
const rooms = [
  { name: 'Ocean Suite', image: 'room-03', note: 'A softer start to the day.', copy: 'Low light, natural textures, and room to let the morning unfold.', alt: 'A softly lit bed beside corner windows framed by tropical foliage.' },
  { name: 'Garden Suite', image: 'room-02', note: 'Close to the green.', copy: 'Warm walls. Woven light. A quiet conversation between inside and out.', alt: 'Linen bed and woven pendant lamps against a warm wall, with palms outside.' },
  { name: 'Horizon Villa', image: 'room-01', note: 'Space to simply be.', copy: 'An open outlook, a gentle breeze, and nothing that needs to happen next.', alt: 'A bed in the foreground of wide windows looking into dense palms.' },
]
const links = [['Stay', '#stay'], ['Experience', '#experience'], ['The Cove', '#cove']] as const

function Arrow({ down = false }: { down?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className={down ? 'arrow down' : 'arrow'}><path d="M4 12h15m-6-6 6 6-6 6" /></svg>
}
function Horizon({ className = '' }: { className?: string }) {
  return <svg className={`horizon-mark ${className}`} aria-hidden="true" viewBox="0 0 88 44"><path d="M3 26h82M30 26a14 14 0 0 1 28 0M15 34h58M28 41h32" /></svg>
}
function Image({ name, alt, className = '', sizes = '100vw', eager = false }: { name: string; alt: string; className?: string; sizes?: string; eager?: boolean }) {
  const portraitFilm = ['hero-poster', 'pool', 'terrace'].includes(name)
  return <img data-parallax={className.includes('parallax-image') || undefined} className={className} src={`${base}${name}-1100.webp`} srcSet={`${base}${name}-640.webp 640w, ${base}${name}-1100.webp ${portraitFilm ? 1080 : 1100}w${portraitFilm ? '' : `, ${base}${name}-1800.webp 1800w`}`} sizes={sizes} width={portraitFilm ? 1080 : name === 'bathroom-detail' ? 1100 : 1800} height={portraitFilm ? 1920 : name === 'bathroom-detail' ? 1648 : name.startsWith('room') ? 1200 : 1013} alt={alt} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async" />
}

type Connection = EventTarget & { saveData?: boolean }
const connection = () => (navigator as Navigator & { connection?: Connection }).connection
const forcedMotion = () => new URLSearchParams(location.search).get('motion') === 'reduce'
const forcedData = () => new URLSearchParams(location.search).get('data') === 'save'
function useMediaPolicy() {
  const [reduced, setReduced] = useState(() => forcedMotion() || matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [saveData, setSaveData] = useState(() => forcedData() || !!connection()?.saveData)
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    const motion = () => setReduced(forcedMotion() || mq.matches)
    const data = () => setSaveData(forcedData() || !!connection()?.saveData)
    mq.addEventListener('change', motion)
    connection()?.addEventListener('change', data)
    return () => { mq.removeEventListener('change', motion); connection()?.removeEventListener('change', data) }
  }, [])
  return { reduced, saveData }
}

function Film({ name, poster, label, children, className = '', critical = false, reduced, saveData }: { name: string; poster: string; label: string; children?: ReactNode; className?: string; critical?: boolean; reduced: boolean; saveData: boolean }) {
  const wrapper = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const playback = useRef({ request: 0, pending: false, source: '', blocked: false })
  const bindVideo = useCallback((element: HTMLVideoElement | null) => {
    video.current = element
    if (element) { element.defaultMuted = true; element.muted = true }
  }, [])
  const [near, setNear] = useState(critical && ['', '#home', '#main'].includes(location.hash))
  const [visible, setVisible] = useState(critical && ['', '#home', '#main'].includes(location.hash))
  const [attached, setAttached] = useState(false)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const [manual, setManual] = useState(false)
  const [hidden, setHidden] = useState(document.hidden)
  const [failed, setFailed] = useState(false)
  const [mobile, setMobile] = useState(() => matchMedia('(max-width: 700px)').matches)
  const allowed = manual || (!reduced && !saveData)
  const playVideo = useCallback((el: HTMLVideoElement) => {
    const request = ++playback.current.request
    playback.current.pending = true
    playback.current.source = el.getAttribute('src') || ''
    el.defaultMuted = true
    el.muted = true
    el.playsInline = true
    el.loop = true
    const rejected = () => {
      if (request !== playback.current.request) return
      playback.current.pending = false
      playback.current.blocked = true
      setPlaying(false)
      setFailed(true)
      setReady(false)
    }
    try {
      // Keep this call synchronous: manual playback must retain the tap gesture.
      el.play().then(() => {
        if (request !== playback.current.request) return
        playback.current.pending = false
        playback.current.blocked = false
        setFailed(false)
        setPlaying(!el.paused)
        setReady(el.readyState >= 2)
      }, rejected)
    } catch { rejected() }
  }, [])
  const pauseVideo = useCallback((el: HTMLVideoElement) => {
    ++playback.current.request
    playback.current.pending = false
    el.pause()
    setPlaying(false)
  }, [])
  useEffect(() => {
    const mq = matchMedia('(max-width: 700px)')
    const update = () => { setMobile(mq.matches); setReady(false) }
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const load = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: '500px' })
    const play = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .12 })
    load.observe(wrapper.current!); play.observe(wrapper.current!)
    const visibility = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', visibility)
    return () => { load.disconnect(); play.disconnect(); document.removeEventListener('visibilitychange', visibility) }
  }, [])
  useEffect(() => { if (near && allowed) setAttached(true) }, [near, allowed])
  useEffect(() => { setManual(false) }, [reduced, saveData])
  useEffect(() => {
    const el = video.current
    if (!el) return
    const source = `${base}${name}-${mobile ? 'mobile' : 'desktop'}.mp4`
    if (attached && el.getAttribute('src') !== source) {
      ++playback.current.request
      playback.current.pending = false
      setReady(false)
      el.src = source
    }
    if (attached && allowed && visible && !paused && !hidden) {
      if (!playback.current.blocked && (!playback.current.pending || playback.current.source !== el.getAttribute('src')) && el.paused) playVideo(el)
    } else pauseVideo(el)
  }, [attached, allowed, visible, paused, hidden, mobile, name, playVideo, pauseVideo])
  useEffect(() => () => {
    ++playback.current.request
    playback.current.pending = false
    video.current?.pause()
  }, [])

  const toggle = () => {
    const el = video.current
    if (!el) return
    if (!el.paused) { setPaused(true); pauseVideo(el); return }
    const source = `${base}${name}-${matchMedia('(max-width: 700px)').matches ? 'mobile' : 'desktop'}.mp4`
    // Attach/load within the same interaction; never wait for a render or canplay.
    el.defaultMuted = true
    el.muted = true
    el.playsInline = true
    if (el.getAttribute('src') !== source || el.error) {
      setReady(false)
      el.src = source
      el.load()
    }
    setManual(true)
    setPaused(false)
    setFailed(false)
    setAttached(true)
    playback.current.blocked = false
    playVideo(el)
  }
  return <div ref={wrapper} className={`film ${className}`}>
    <Image name={poster} alt="" className="film-poster" eager={critical} />
    <video ref={bindVideo} className={ready && allowed ? 'is-ready' : ''} autoPlay={allowed && visible && !paused && !hidden && !failed} muted playsInline loop preload={critical && allowed ? 'auto' : 'none'} poster={`${base}${poster}-1100.webp`} onCanPlay={() => { if (!playback.current.blocked) setReady(true) }} onPlaying={() => { setPlaying(true); setFailed(false) }} onPause={() => setPlaying(false)} onError={() => { ++playback.current.request; playback.current.pending = false; playback.current.blocked = true; setPlaying(false); setFailed(true); setReady(false) }} aria-hidden="true" />
    {children}
    <button type="button" onClick={toggle} className="film-control" aria-label={`${playing ? 'Pause' : failed ? 'Retry' : 'Play'} ${label} film`}>
      <span className={playing ? 'pause-icon' : 'play-icon'} aria-hidden="true" />
      <span>{playing ? 'Pause film' : failed ? 'Retry film' : 'Play film'}</span>
    </button>
  </div>
}

function Entry({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ onComplete: onDone })
        .from('.entry-mark', { opacity: 0, duration: .9 }, .15)
        .from('.entry-title span', { yPercent: 105, opacity: 0, duration: 1.4, ease: 'power2.out', stagger: .12 }, .65)
        .from('.entry-tagline', { opacity: 0, y: 10, duration: 1 }, 1.6)
        .to(ref.current, { opacity: 0, duration: 1.1, ease: 'power2.inOut' }, 3.5)
    }, ref)
    return () => ctx.revert()
  }, [onDone])
  return <div ref={ref} className="entry" role="dialog" aria-modal="true" aria-label="Welcome to Velora Cove">
    <div className="entry-center"><Horizon className="entry-mark" /><p className="entry-title"><span>VELORA</span> <span>COVE</span></p><p className="entry-tagline">Where the coast slows down.</p></div>
    <span className="entry-footnote">A fictional coastal retreat</span>
    <button type="button" className="entry-skip" onClick={onDone} autoFocus>Skip opening <Arrow /></button>
  </div>
}

function Modal({ kind, onClose, selectRoom, openModal }: { kind: 'plan' | 'journal' | 'menu'; onClose: () => void; selectRoom: (n: number) => void; openModal: (kind: 'plan' | 'journal') => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    dialog.current?.showModal()
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = oldOverflow; previous?.focus({ preventScroll: true }) }
  }, [])
  const goRoom = (n: number) => { selectRoom(n); dialog.current?.close(); requestAnimationFrame(() => { document.getElementById('stay')?.scrollIntoView({ behavior: forcedMotion() || matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); document.querySelector<HTMLInputElement>('input[name=room]:checked')?.focus({ preventScroll: true }) }) }
  return <dialog ref={dialog} className={`concept-dialog ${kind === 'menu' ? 'menu-dialog' : ''}`} aria-labelledby="dialog-title" onClose={onClose} onKeyDown={e => {
    if (e.key !== 'Tab') return
    const targets = [...e.currentTarget.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex="0"]')].filter(el => el.getClientRects().length)
    const first = targets[0], last = targets[targets.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus() }
  }} onClick={e => { if (e.target === e.currentTarget) dialog.current?.close() }}>
    <div className="dialog-inner" data-lenis-prevent>
      <button type="button" className="dialog-close" onClick={() => dialog.current?.close()} aria-label="Close dialog"><span aria-hidden="true">×</span></button>
      <Horizon />
      {kind === 'menu' ? <><p className="eyebrow">Velora Cove</p><h2 id="dialog-title" className="sr-only">Explore Velora Cove</h2><nav aria-label="Mobile navigation">{links.map(([name, href]) => <a key={href} href={href} onClick={() => dialog.current?.close()}>{name}<Arrow /></a>)}<button onClick={() => { dialog.current?.close(); setTimeout(() => openModal('journal'), 0) }}>Journal<Arrow /></button><button onClick={() => { dialog.current?.close(); setTimeout(() => openModal('plan'), 0) }}>Plan your escape<Arrow /></button></nav><p className="dialog-note">A fictional hospitality concept.</p></>
      : kind === 'plan' ? <><p className="eyebrow">An imagined escape</p><h2 id="dialog-title">Which quiet<br />feels like <em>yours?</em></h2><p>VELORA COVE is a fictional hospitality concept. Explore an imagined stay below.</p><div className="plan-options">{rooms.map((room, i) => <button key={room.name} onClick={() => goRoom(i)}><span className="eyebrow">0{i + 1}</span><span>{room.name}</span><Arrow /></button>)}</div><p className="dialog-note">Portfolio demonstration · No reservations or inquiries are sent.</p></>
      : <><p className="eyebrow">Field notes / A concept journal</p><h2 id="dialog-title">A few things<br />worth <em>noticing.</em></h2><div className="journal-notes"><article><span className="eyebrow">01 / Light</span><h3>The shape of a morning</h3><p>A room changes before we do. First the window. Then the wall. Then the linen.</p></article><article><span className="eyebrow">02 / Material</span><h3>Warm to the touch</h3><p>Stone, wood, woven shade. The small things that make a space feel close to the landscape.</p></article><article><span className="eyebrow">03 / Rhythm</span><h3>An unplanned afternoon</h3><p>Watch the water. Leave the next hour open. Some days need very little.</p></article></div><p className="dialog-note">Original editorial notes for a fictional concept.</p></>}
    </div>
  </dialog>
}

export default function App() {
  const { reduced, saveData } = useMediaPolicy()
  const [intro, setIntro] = useState(() => !forcedMotion() && !matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [activeRoom, setActiveRoom] = useState(0)
  const [modal, setModal] = useState<'plan' | 'journal' | 'menu' | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const page = useRef<HTMLDivElement>(null)
  const roomImage = useRef<HTMLDivElement>(null)
  const room = rooms[activeRoom]
  const done = useCallback(() => setIntro(false), [])
  const close = useCallback(() => setModal(null), [])

  useLayoutEffect(() => {
    const target = location.hash.slice(1)
    if (!target) return
    const frame = requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView({ behavior: 'instant' }))
    return () => cancelAnimationFrame(frame)
  }, [intro])

  useEffect(() => { if (reduced) setIntro(false) }, [reduced])
  useEffect(() => {
    if (!intro) return
    const old = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = old }
  }, [intro])
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 80)
    update(); addEventListener('scroll', update, { passive: true })
    return () => removeEventListener('scroll', update)
  }, [])

  useLayoutEffect(() => {
    if (intro || reduced) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el => {
        gsap.from(el, { opacity: 0, y: 24, duration: 1.15, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } })
      })
      gsap.utils.toArray<HTMLElement>('.reveal-line').forEach(el => {
        gsap.from(el, { yPercent: 105, duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: el.parentElement, start: 'top 94%', once: true } })
      })
      if (matchMedia('(min-width: 900px)').matches) {
        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach(el => {
          gsap.fromTo(el, { yPercent: -3, scale: 1.07 }, { yPercent: 3, scale: 1.03, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1.6 } })
        })
      }
      ScrollTrigger.refresh()
    }, page)
    return () => ctx.revert()
  }, [intro, reduced])

  useEffect(() => {
    if (reduced || intro || modal || matchMedia('(pointer: coarse)').matches) return
    const lenis = new Lenis({ duration: 1.35, smoothWheel: true, syncTouch: false, anchors: { offset: -88 } })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    return () => { gsap.ticker.remove(raf); lenis.destroy() }
  }, [reduced, intro, modal])

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.room-photo.is-active', { opacity: 0 }, { opacity: 1, duration: .6, ease: 'power1.out' })
    }, roomImage)
    return () => ctx.revert()
  }, [activeRoom, reduced])

  return <>
    {intro && <Entry onDone={done} />}
    <div ref={page} className="site" data-motion={reduced ? "reduced" : "full"} inert={intro}>
      <a href="#main" className="skip-link">Skip to content</a>
      <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
        <a className="wordmark" href="#home" aria-label="Velora Cove home">VELORA <span>COVE</span></a>
        <nav className="desktop-nav" aria-label="Main navigation">{links.map(([name, href]) => <a key={href} href={href}>{name}</a>)}<button data-journal onClick={() => setModal('journal')}>Journal</button></nav>
        <button className="header-plan" onClick={() => setModal('plan')}>Plan your escape <Arrow /></button>
        <button className="menu-toggle" onClick={() => setModal('menu')} aria-label="Open navigation menu"><span /><span /></button>
      </header>

      <main id="main">
        <section id="home" className="hero" aria-labelledby="hero-title">
          <Film name="hero-villa" poster="hero-poster" label="coastal arrival" critical reduced={reduced} saveData={saveData} className="hero-film">
            <div className="hero-shade" />
            <div className="hero-content"><Horizon /><h1 id="hero-title">VELORA COVE</h1><p className="hero-tagline">Where the coast<br /><em>slows down.</em></p><p className="hero-description">A quiet retreat shaped by sea, light and open air.</p><div className="hero-actions"><a className="button button-light" href="#stay">Explore the Stay <Arrow /></a><a className="text-link light-link" href="#arrival">Discover Velora <Arrow /></a></div></div>
            <div className="hero-bottom"><span className="eyebrow">An imagined place. A different pace.</span><a className="scroll-link" href="#arrival"><span>Scroll to arrive</span><Arrow down /></a><span className="hero-concept">Fictional hospitality concept</span></div>
          </Film>
        </section>

        <section id="arrival" className="arrival section-pad" aria-labelledby="arrival-title">
          <div className="arrival-heading"><p className="eyebrow" data-reveal>01 — Arrival</p><h2 id="arrival-title"><span className="line-mask"><span className="reveal-line">Arrive somewhere</span></span><span className="line-mask"><em className="reveal-line">quieter.</em></span></h2><div className="arrival-copy" data-reveal><p>Open skies. Warm stone.<br />The ocean always within reach.</p><span className="tiny-note">The art of doing a little less.</span></div></div>
          <div className="arrival-images"><figure className="arrival-main" data-reveal><div className="image-window"><Image name="arrival" alt="Open glass doors frame a shaded terrace, an infinity pool and the sea." sizes="(max-width: 700px) 100vw, 65vw" className="parallax-image" /></div><figcaption><span>A view to come back to.</span><span>VELORA / 01</span></figcaption></figure><figure className="arrival-detail" data-reveal><div className="image-window"><Image name="pool" alt="An infinity pool meets a blue sea beyond tropical trees." sizes="(max-width: 700px) 70vw, 30vw" /></div><figcaption>Water. Sky. A little space between.</figcaption></figure></div>
        </section>

        <section id="stay" className="stay section-pad" aria-labelledby="stay-title">
          <div className="section-heading" data-reveal><div><p className="eyebrow">02 — The Stay</p><h2 id="stay-title">Rooms shaped<br />by light.</h2></div><p>Natural textures.<br />Soft edges.<br />Space for your own rhythm.</p></div>
          <div className="stay-layout"><div className="room-editorial"><fieldset className="room-selector"><legend className="sr-only">Explore fictional room categories</legend>{rooms.map((r, i) => <label className={`room-choice ${activeRoom === i ? 'selected' : ''}`} key={r.name}><input type="radio" name="room" value={i} checked={activeRoom === i} onChange={() => setActiveRoom(i)} /><span className="room-index">0{i + 1}</span><span>{r.name}</span><Arrow /></label>)}</fieldset><div className="room-description" aria-live="polite" aria-atomic="true"><p className="eyebrow">{room.note}</p><p>{room.copy}</p><span className="tiny-note">An imagined room category.</span></div><button className="text-link" onClick={() => setModal('plan')}>Imagine your stay <Arrow /></button></div>
          <div ref={roomImage} className="room-image-wrap"><div className="room-images">{rooms.map((r, i) => <Image key={r.name} name={r.image} alt={i === activeRoom ? r.alt : ''} className={`room-photo ${i === activeRoom ? 'is-active' : ''}`} sizes="(max-width: 700px) 100vw, 65vw" />)}</div><div className="room-caption"><span>{room.name}</span><span>0{activeRoom + 1} / 03</span></div></div></div>
        </section>

        <section id="morning" className="morning" aria-labelledby="morning-title"><Film name="ocean-balcony" poster="balcony-poster" label="morning balcony" reduced={reduced} saveData={saveData}><div className="film-shade" /><div className="morning-copy" data-reveal><p className="eyebrow">Wake up here</p><h2 id="morning-title">Mornings,<br /><em>uninterrupted.</em></h2></div><span className="film-footnote eyebrow">No agenda. Just the horizon.</span></Film></section>

        <section id="cove" className="cove section-pad" aria-labelledby="cove-title"><div className="cove-top"><p className="eyebrow" data-reveal>03 — The Cove</p><div data-reveal><h2 id="cove-title">Built around<br />the horizon.</h2><p>Light, air and water<br />shape every space.</p></div><Horizon /></div><div className="cove-images"><figure className="cove-tall" data-reveal><div className="image-window"><Image name="terrace" alt="Parasols and stone loungers on a sunlit pool terrace, with palms and sea beyond." sizes="(max-width:700px) 100vw, 43vw" className="parallax-image" /></div><figcaption>01 / Open-air living</figcaption></figure><div className="cove-right"><figure data-reveal><div className="image-window"><Image name="arrival" alt="Dark architectural door frames open onto a bright pool and distant horizon." sizes="(max-width:700px) 100vw, 48vw" className="parallax-image" /></div><figcaption>02 / A frame for the sea</figcaption></figure><p className="cove-note" data-reveal>The inside opens out.<br /><em>The outside settles in.</em></p></div></div></section>

        <section id="experience" className="slow section-pad" aria-labelledby="slow-title"><div className="slow-heading" data-reveal><p className="eyebrow">04 — Slow Living</p><h2 id="slow-title">Nothing here asks<br />you to <em>hurry.</em></h2><p>A few ways to spend a day.<br />And permission to leave it unplanned.</p></div><div className="slow-grid"><figure className="slow-swim" data-reveal><div className="image-window"><Image name="pool" alt="Blue infinity pool framed by trees and the open sea." sizes="(max-width:700px) 100vw, 42vw" /></div><figcaption><span className="eyebrow">Swim</span><span>Follow the water.</span></figcaption></figure><figure className="slow-rest" data-reveal><div className="image-window"><Image name="room-02" alt="A linen-covered bed with textured cushions and soft woven lamps." sizes="(max-width:700px) 100vw, 40vw" /></div><figcaption><span className="eyebrow">Rest</span><span>Leave the afternoon open.</span></figcaption></figure><figure className="slow-detail" data-reveal><div className="image-window"><Image name="bathroom-detail" alt="Warm stone bathroom with tropical leaves visible through the window." sizes="(max-width:700px) 60vw, 25vw" /></div><figcaption><span className="eyebrow">Wander</span><span>Notice the small things.</span></figcaption></figure><div className="slow-thought" data-reveal><Horizon /><p>Watch the light change.<br /><em>That’s enough.</em></p><span className="eyebrow">A slower kind of day</span></div></div></section>

        <section id="aerial" className="aerial" aria-labelledby="aerial-title"><Film name="aerial-resort" poster="aerial-poster" label="aerial landscape" reduced={reduced} saveData={saveData}><div className="film-shade" /><div className="aerial-copy" data-reveal><h2 id="aerial-title">Between land and sea.</h2></div></Film></section>

        <section id="last-light" className="last-light section-pad" aria-labelledby="light-title"><div className="last-light-heading" data-reveal><p className="eyebrow">05 — The Last Light</p><h2 id="light-title">Stay until<br />the light <em>changes.</em></h2></div><div className="last-light-layout"><figure data-reveal><div className="image-window"><Image name="last-light" alt="Low sunlight falls across resort roofs and pools beneath distant mountains, in supplied stock footage." sizes="(max-width:700px) 100vw, 65vw" /></div><figcaption>A different rhythm from above.</figcaption></figure><p data-reveal>Some places are best remembered by how they made <em>time feel.</em></p></div></section>

        <section id="escape" className="final-cta section-pad" aria-labelledby="final-title"><Horizon /><p className="eyebrow" data-reveal>Let the world wait a little.</p><h2 id="final-title" data-reveal>Your quiet place<br /><em>by the sea.</em></h2><div className="final-actions" data-reveal><a className="button button-light" href="#stay">Explore the Stay <Arrow /></a><button className="text-link light-link" onClick={() => setModal('plan')}>Plan your escape <Arrow /></button></div><p className="final-concept">An imagined retreat. A real invitation to slow down.</p></section>
      </main>

      <footer className="footer"><div className="footer-top"><a href="#home" className="footer-wordmark">VELORA COVE</a><a href="#home" className="text-link light-link">Back to the beginning <Arrow down /></a></div><div className="footer-bottom"><p>A fictional hospitality concept designed and developed as a portfolio project.<br /><span>Stock photography and films illustrate the concept.</span></p><p>Designed &amp; Developed by <strong>Ayyoweb3</strong></p></div></footer>
    </div>
    {modal && <Modal kind={modal} onClose={close} selectRoom={setActiveRoom} openModal={setModal} />}
  </>
}
