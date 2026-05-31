import { useState, useEffect } from 'react'
import benFranklin from './assets/ben-franklin-portrait.png'

const CAL_URL = 'https://cal.com/david-peterson-40s7lw/free-workflow-audit?embed=true&embedType=inline&theme=dark'

const workflows = [
  {
    name: 'AI Chatbot & Client Intake',
    desc: 'Capture every lead, 24/7. New clients get welcomed, qualified, and routed, with no manual follow-up.',
  },
  {
    name: 'Appointment Scheduling & Reminders',
    desc: 'Clients book themselves. Automatic reminders cut no-shows before they happen.',
  },
  {
    name: 'Document Collection & Follow-Up',
    desc: 'Stop chasing paperwork. Forms, contracts, and files arrive on time, without you sending a single reminder.',
  },
  {
    name: 'Ongoing Client Communication',
    desc: 'Reviews, renewals, and check-ins, all handled. Every client stays in the loop, and the happy ones leave you 5 stars.',
  },
]

// ── Styles ─────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-family: 'Inter', sans-serif; }
  body { background: #070f24; color: #ffffff; overflow-x: hidden; }

  /* ── Workflow grid ── */
  .workflow-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    width: 100%;
    max-width: 820px;
    margin: 0 auto;
  }
  .workflow-tile {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(96,165,250,0.18);
    border-radius: 16px;
    padding: 28px 20px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition: border-color 0.25s, background 0.25s;
  }
  .workflow-tile:hover {
    background: rgba(96,165,250,0.06);
    border-color: rgba(96,165,250,0.4);
  }
  .tile-name {
    font-family: 'Playfair Display', serif;
    font-size: clamp(14px, 1.8vw, 17px);
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 10px;
    line-height: 1.3;
  }
  .tile-desc { font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.6; }

  /* ── Section heading ── */
  .section-heading {
    font-family: 'Playfair Display', serif;
    font-size: clamp(36px, 5vw, 56px);
    font-weight: 800;
    color: #60a5fa;
    line-height: 1;
    pointer-events: none;
    margin-bottom: clamp(20px, 3vw, 32px);
  }

  /* ── Pricing card ── */
  .pricing-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(96,165,250,0.18);
    border-radius: 16px;
    overflow: hidden;
    max-width: 480px;
    width: 100%;
  }
  .pricing-top { padding: 32px 36px 24px; }
  .pricing-label {
    font-size: 11px; font-weight: 700; letter-spacing: 3px;
    text-transform: uppercase; color: #60a5fa; margin-bottom: 18px;
  }
  .pricing-numbers { display: flex; align-items: center; justify-content: center; gap: 20px; flex-wrap: wrap; }
  .pricing-amount {
    font-family: 'Playfair Display', serif;
    font-size: clamp(28px, 4vw, 44px);
    font-weight: 800; color: #ffffff; line-height: 1;
  }
  .pricing-mo { font-size: 0.52em; font-weight: 400; color: rgba(255,255,255,0.6); }
  .pricing-period { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 6px; letter-spacing: 0.3px; }
  .pricing-plus { font-size: 24px; color: rgba(255,255,255,0.25); font-weight: 300; line-height: 1; }
  .pricing-footer {
    background: rgba(96,165,250,0.06);
    border-top: 1px solid rgba(96,165,250,0.12);
    padding: 14px 36px; font-size: 13px; color: rgba(255,255,255,0.45); letter-spacing: 0.2px;
  }

  /* ── About card ── */
  .about-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(96,165,250,0.18);
    border-radius: 16px;
    padding: 32px 36px;
    max-width: 660px; width: 100%; text-align: center;
  }
  .about-role { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #60a5fa; margin-bottom: 18px; }
  .about-name { font-family: 'Playfair Display', serif; font-size: clamp(20px, 2.5vw, 26px); font-weight: 700; color: #ffffff; margin-bottom: 8px; }
  .about-bio p { font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.8; margin-bottom: 12px; text-align: center; }
  .about-bio p:last-child { margin-bottom: 0; }

  /* ── CTA Button ── */
  .cta-btn {
    display: inline-block; background: #ffffff; color: #60a5fa;
    padding: 14px 32px; border-radius: 7px; font-size: 15px; font-weight: 700;
    font-family: 'Inter', sans-serif; letter-spacing: 0.3px; border: none; cursor: pointer; transition: background 0.2s;
  }
  .cta-btn:hover { background: #e2e8f0; }

  /* ── Cal modal ── */
  .cal-overlay {
    display: none; position: fixed; inset: 0; z-index: 9999;
    background: rgba(7,15,36,0.90); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    align-items: center; justify-content: center; padding: 20px;
  }
  .cal-overlay.open { display: flex; }
  .cal-box {
    position: relative; background: #0d1b3e; border: 1px solid rgba(96,165,250,0.25);
    border-radius: 16px; width: 100%; max-width: 820px; height: min(680px, 88vh);
    overflow: hidden; box-shadow: 0 32px 80px rgba(0,0,0,0.6); display: flex; flex-direction: column;
  }
  .cal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); flex-shrink: 0;
  }
  .cal-header-label { font-size: 13px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #60a5fa; }
  .cal-close { background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.5); font-size: 24px; line-height: 1; padding: 0 4px; transition: color 0.2s; }
  .cal-close:hover { color: #ffffff; }
  .cal-iframe-wrap { flex: 1; overflow: hidden; }
  .cal-iframe-wrap iframe { width: 100%; height: 100%; border: none; display: block; background: #ffffff; border-radius: 0 0 16px 16px; }

  /* ── Hero layout ── */
  .hero-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(32px, 5vw, 64px);
    align-items: center;
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 clamp(20px, 4vw, 48px);
  }
  .hero-eyebrow {
    font-size: 11px; font-weight: 700; letter-spacing: 3px;
    text-transform: uppercase; color: #60a5fa; margin-bottom: 20px; display: block;
  }
  .hero-headline {
    font-family: 'Playfair Display', serif;
    font-size: clamp(36px, 5vw, 68px);
    font-weight: 800; color: #ffffff;
    line-height: 1.1; letter-spacing: -0.5px; margin-bottom: 20px;
  }
  .hero-headline em { font-style: normal; color: #60a5fa; }
  .hero-sub {
    font-size: clamp(15px, 1.6vw, 17px);
    color: rgba(255,255,255,0.65);
    line-height: 1.7; margin-bottom: 32px; max-width: 420px;
  }
  .hero-img-wrap {
    border-radius: 14px; overflow: hidden; aspect-ratio: 3 / 4;
    border: 1px solid rgba(96,165,250,0.15);
    box-shadow: 0 24px 60px rgba(0,0,0,0.5);
  }
  .hero-img-wrap img {
    width: 100%; height: 100%; object-fit: cover; object-position: center 15%; display: block;
  }
  @media (max-width: 680px) {
    .hero-inner { grid-template-columns: 1fr; }
    .hero-img-wrap { aspect-ratio: 4 / 3; max-width: 460px; margin: 0 auto; }
    .hero-inner > div:first-child { text-align: center; }
    .hero-sub { margin-left: auto; margin-right: auto; }
  }

  /* ── Mobile ≤480px — tile/card tightening ── */
  @media (max-width: 480px) {
    .workflow-grid { gap: 8px; }
    .workflow-tile { padding: 18px 12px 22px; }
    .tile-gear { font-size: 1.6rem; }
    .tile-name { font-size: 13px; }
    .tile-desc { font-size: 12px; }
    .pricing-top { padding: 20px 18px 16px; }
    .pricing-footer { padding: 12px 18px; }
    .about-card { padding: 20px 18px; }
  }
`

// ── Style injector ──────────────────────────────────────────────────────────
function StyleInjector() {
  useEffect(() => {
    const tag = document.createElement('style')
    tag.textContent = css
    document.head.appendChild(tag)

    // ── Favicon: navy-backed Franklin generated via canvas ──
    const srcHref = new URL('./assets/ben-franklin-portrait.png', import.meta.url).href
    const ICON_SIZE = 256
    const RADIUS = 56
    const NAVY = '#070f24'
    const CROP_FACTOR = 0.62   // tighter = less cream, more face. tune if needed.
    const VERTICAL_FOCUS = 0.42 // where Franklin's face sits in the source image (0 = top, 1 = bottom)

    let cancelled = false
    const addedLinks = []

    const applyIcon = (href) => {
      if (cancelled) return
      document.querySelectorAll("link[rel~='icon'], link[rel='apple-touch-icon']").forEach(l => l.remove())
      const fav = document.createElement('link')
      fav.rel = 'icon'
      fav.type = 'image/png'
      fav.href = href
      document.head.appendChild(fav)
      addedLinks.push(fav)
      const apple = document.createElement('link')
      apple.rel = 'apple-touch-icon'
      apple.href = href
      document.head.appendChild(apple)
      addedLinks.push(apple)
    }

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      if (cancelled) return
      try {
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = ICON_SIZE
        const ctx = canvas.getContext('2d')

        // Rounded-square clip
        const r = RADIUS
        ctx.beginPath()
        ctx.moveTo(r, 0)
        ctx.lineTo(ICON_SIZE - r, 0)
        ctx.quadraticCurveTo(ICON_SIZE, 0, ICON_SIZE, r)
        ctx.lineTo(ICON_SIZE, ICON_SIZE - r)
        ctx.quadraticCurveTo(ICON_SIZE, ICON_SIZE, ICON_SIZE - r, ICON_SIZE)
        ctx.lineTo(r, ICON_SIZE)
        ctx.quadraticCurveTo(0, ICON_SIZE, 0, ICON_SIZE - r)
        ctx.lineTo(0, r)
        ctx.quadraticCurveTo(0, 0, r, 0)
        ctx.closePath()
        ctx.clip()

        // Navy background
        ctx.fillStyle = NAVY
        ctx.fillRect(0, 0, ICON_SIZE, ICON_SIZE)

        // Tight central crop of Franklin → composite on navy
        const iw = img.naturalWidth
        const ih = img.naturalHeight
        const cropSize = Math.min(iw, ih) * CROP_FACTOR
        const sx = (iw - cropSize) / 2
        const sy = Math.max(0, Math.min(ih - cropSize, ih * VERTICAL_FOCUS - cropSize / 2))
        ctx.drawImage(img, sx, sy, cropSize, cropSize, 0, 0, ICON_SIZE, ICON_SIZE)

        applyIcon(canvas.toDataURL('image/png'))
      } catch (e) {
        // canvas tainted or unavailable — fall back to raw image
        applyIcon(srcHref)
      }
    }
    img.onerror = () => applyIcon(srcHref)
    img.src = srcHref

    return () => {
      cancelled = true
      document.head.removeChild(tag)
      addedLinks.forEach(l => { if (document.head.contains(l)) document.head.removeChild(l) })
    }
  }, [])
  return null
}

// ── Nav ─────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: '#070f24',
      borderTop: '20px solid #070f24',
    }}>
      <div
        className="nav-inner"
        style={{
          display: 'flex', flexDirection: 'row',
          alignItems: 'center', justifyContent: 'center',
          gap: 'clamp(14px, 2vw, 24px)',
          padding: 'clamp(14px, 2vw, 16px) 32px',
        }}
      >
        <div
          className="nav-logo-rect"
          style={{
            width: 'clamp(115px, 13vw, 150px)',
            height: 'clamp(105px, 12vw, 138px)',
            borderRadius: '14px',
            background: 'transparent', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0, overflow: 'hidden',
          }}
        >
          <img
            src={benFranklin}
            alt="FranklinAI Solutions"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 42%', transform: 'scale(1.08)', transformOrigin: 'left center', display: 'block', borderRadius: '14px' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span
            className="nav-wordmark-line"
            style={{
              fontSize: 'clamp(42px, 6vw, 72px)', fontWeight: 800, color: '#ffffff',
              letterSpacing: '-1.5px', fontFamily: "'Inter', sans-serif",
              lineHeight: 1.04, whiteSpace: 'nowrap',
            }}
          >Franklin<span style={{ color: '#60a5fa' }}>AI</span></span>
          <span
            className="nav-wordmark-line"
            style={{
              fontSize: 'clamp(42px, 6vw, 72px)', fontWeight: 800, color: '#ffffff',
              letterSpacing: '-1.5px', fontFamily: "'Inter', sans-serif",
              lineHeight: 1.04, whiteSpace: 'nowrap',
            }}
          >Solutions</span>
        </div>
      </div>
    </nav>
  )
}

// ── Nav height offset ───────────────────────────────────────────────────────
const NAV_OFFSET = 'clamp(192px, 24vw, 256px)'

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onBook }) {
  return (
    <section style={{
      paddingTop: `calc(${NAV_OFFSET} + clamp(20px, 2.5vw, 32px))`,
      paddingBottom: 'clamp(14px, 2vw, 24px)',
      paddingLeft: '24px',
      paddingRight: '24px',
      maxWidth: '700px',
      margin: '0 auto',
      textAlign: 'center',
      background: '#070f24',
    }}>
      <h1 className="hero-headline" style={{ marginBottom: '32px', color: '#60a5fa', fontSize: 'clamp(32px, 4.2vw, 56px)' }}>
        Automation workflows for professional service firms.
      </h1>
      <button className="cta-btn" onClick={onBook}>
        Book a Free Audit →
      </button>
    </section>
  )
}

// ── Workflows ────────────────────────────────────────────────────────────────
function Workflows() {
  return (
    <section style={{ background: '#070f24', padding: 'clamp(14px, 2vw, 24px) 0' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', padding: '0 24px' }}>
        <h2 className="section-heading">Workflows</h2>
        <div className="workflow-grid">
          {workflows.map((w, i) => (
            <div className="workflow-tile" key={i}>
              <div className="tile-name">{w.name}</div>
              <div className="tile-desc">{w.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Pricing ──────────────────────────────────────────────────────────────────
function Pricing() {
  return (
    <section style={{ background: '#070f24', padding: 'clamp(14px, 2vw, 24px) 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <h2 className="section-heading">Pricing</h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="pricing-card">
            <div className="pricing-top">
              <div className="pricing-label">Per Workflow</div>
              <div className="pricing-numbers">
                <div>
                  <div className="pricing-amount">$2,500</div>
                  <div className="pricing-period">one-time build</div>
                </div>
                <div className="pricing-plus">+</div>
                <div>
                  <div className="pricing-amount">$250<span className="pricing-mo">/mo</span></div>
                  <div className="pricing-period">retainer</div>
                </div>
              </div>
            </div>
            <div className="pricing-footer">
              Scope and final price determined by your free audit.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── About ────────────────────────────────────────────────────────────────────
function About() {
  return (
    <section style={{ background: '#070f24', padding: 'clamp(14px, 2vw, 24px) 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <h2 className="section-heading">About</h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="about-card">
            <div className="about-name">David Peterson</div>
            <div className="about-role">Founder & Builder</div>
            <div className="about-bio">
              <p>David has spent 20 years in operations across research, education, healthcare, and small business — managing the workflows, systems, and processes that keep organizations running. From supporting executive leadership at national institutions to implementing digital tools that streamlined how teams work, he's always been the person who figures out how to make things run better.</p>
              <p>That same drive is what FranklinAI Solutions is built on. AI automation isn't a new concept for David — it's the next step in work he's been doing his whole career, now with better tools.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Contact ──────────────────────────────────────────────────────────────────
function Contact({ onBook }) {
  return (
    <section style={{ background: '#070f24', padding: 'clamp(8px, 1.5vw, 16px) 24px clamp(14px, 2vw, 24px)' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          fontSize: '16px', fontWeight: 700, letterSpacing: '3px',
          textTransform: 'uppercase', color: '#60a5fa', marginBottom: '16px',
        }}>GET STARTED</div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 800,
          color: '#ffffff', marginBottom: '16px', lineHeight: 1.1,
        }}>Book your free audit.</h2>
        <p style={{
          fontSize: '15px', color: 'rgba(255,255,255,0.65)',
          lineHeight: 1.65, marginBottom: '28px',
        }}>
          30 minutes. We map your workflows and show you exactly what we can automate.
        </p>
        <button className="cta-btn" onClick={onBook} style={{ marginBottom: '18px' }}>
          Book a Free Audit →
        </button>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
          Or email: <a
            href="mailto:david@franklinaisolutions.com"
            style={{ color: '#60a5fa', textDecoration: 'none' }}
          >david@franklinaisolutions.com</a>
        </div>
      </div>
    </section>
  )
}

// ── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      background: '#070f24',
      padding: 'clamp(42px, 6vw, 66px) 28px clamp(42px, 6vw, 66px)',
      textAlign: 'center',
      borderTop: '1px solid rgba(96,165,250,0.08)',
    }}>
      <div style={{
        display: 'flex', flexDirection: 'row', alignItems: 'center',
        justifyContent: 'center', gap: 'clamp(14px, 2vw, 24px)', margin: '0 auto 20px',
        flexWrap: 'wrap',
      }}>
        <div style={{
          width: 'clamp(115px, 13vw, 150px)',
          height: 'clamp(105px, 12vw, 138px)',
          borderRadius: '14px', background: 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, overflow: 'hidden',
        }}>
          <img src={benFranklin} alt="FranklinAI Solutions" style={{
            width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 42%', transform: 'scale(1.08)', transformOrigin: 'left center', display: 'block', borderRadius: '14px',
          }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
          <span style={{
            fontSize: 'clamp(33px, 4.5vw, 48px)', fontWeight: 800, color: '#ffffff',
            letterSpacing: '-0.5px', lineHeight: 1.1, fontFamily: "'Inter', sans-serif",
          }}>Franklin<span style={{ color: '#60a5fa' }}>AI</span></span>
          <span style={{
            fontSize: 'clamp(33px, 4.5vw, 48px)', fontWeight: 800, color: '#ffffff',
            letterSpacing: '-0.5px', lineHeight: 1.1, fontFamily: "'Inter', sans-serif",
          }}>Solutions</span>
        </div>
      </div>
      <span style={{
        fontSize: '13px', color: 'rgba(255,255,255,0.3)',
        lineHeight: 1.6, display: 'block', letterSpacing: '0.2px',
      }}>
        © 2026 FranklinAI Solutions · Philadelphia, PA<br />
        franklinaisolutions.com
      </span>
    </footer>
  )
}

// ── CalModal ─────────────────────────────────────────────────────────────────
function CalModal({ isOpen, onClose }) {
  return (
    <div
      className={`cal-overlay${isOpen ? ' open' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label="Book a Free Audit"
    >
      <div className="cal-box">
        <div className="cal-header">
          <span className="cal-header-label">Book Your Free Audit</span>
          <button className="cal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="cal-iframe-wrap">
          {isOpen && (
            <iframe
              src={CAL_URL}
              title="Book a Free Workflow Audit with FranklinAI Solutions"
              allow="camera; microphone; fullscreen"
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [calOpen, setCalOpen] = useState(false)

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setCalOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = calOpen ? 'hidden' : ''
  }, [calOpen])

  const openCal = () => setCalOpen(true)
  const closeCal = () => setCalOpen(false)

  return (
    <>
      <StyleInjector />
      <Nav />
      <main>
        <Hero onBook={openCal} />
        <Workflows />
        <Pricing />
        <About />
        <Contact onBook={openCal} />
      </main>
      <Footer />
      <CalModal isOpen={calOpen} onClose={closeCal} />
    </>
  )
}
