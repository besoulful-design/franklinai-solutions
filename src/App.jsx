import { useState, useEffect } from 'react'
import benFranklin from './assets/ben-franklin.jpeg'

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

  /* ── Gear animations ── */
  @keyframes spin-cw  { from { transform: rotate(0deg); } to { transform: rotate(360deg);  } }
  @keyframes spin-ccw { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
  .gear-cw  { display: inline-block; animation: spin-cw  9s linear infinite; }
  .gear-ccw { display: inline-block; animation: spin-ccw 9s linear infinite; }

  /* ── Gear chain cluster — 3× size, centered, slight gap so not overlapping ── */
  .gear-cluster {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 28px;
    line-height: 1;
  }
  .gear-cluster .gc-gear {
    display: inline-block;
    line-height: 1;
    margin: 0 2px;
  }
  .gear-cluster .gc-lg { font-size: 10.2rem; }
  .gear-cluster .gc-md { font-size: 7.8rem; }
  .gear-cluster .gc-sm { font-size: 6.0rem; }

  /* ── Workflow grid ── */
  .workflow-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
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
  .tile-gear { font-size: 2.4rem; margin-bottom: 14px; line-height: 1; }
  .tile-name {
    font-family: 'Playfair Display', serif;
    font-size: clamp(15px, 2vw, 18px);
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 10px;
    line-height: 1.3;
  }
  .tile-desc { font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.65; }

  /* ── Section heading ── */
  .section-heading {
    font-family: 'Playfair Display', serif;
    font-size: clamp(42px, 8vw, 96px);
    font-weight: 800;
    color: #ffffff;
    line-height: 1;
    pointer-events: none;
    margin-bottom: 32px;
  }

  /* ── Pricing card ── */
  .pricing-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(96,165,250,0.18);
    border-radius: 16px;
    overflow: hidden;
    max-width: 520px;
    width: 100%;
  }
  .pricing-top { padding: 36px 40px 28px; }
  .pricing-label {
    font-size: 11px; font-weight: 700; letter-spacing: 3px;
    text-transform: uppercase; color: #60a5fa; margin-bottom: 20px;
  }
  .pricing-numbers { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
  .pricing-amount {
    font-family: 'Playfair Display', serif;
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 800; color: #ffffff; line-height: 1;
  }
  .pricing-mo { font-size: 0.52em; font-weight: 400; color: rgba(255,255,255,0.6); }
  .pricing-period { font-size: 13px; color: rgba(255,255,255,0.4); margin-top: 7px; letter-spacing: 0.3px; }
  .pricing-plus { font-size: 28px; color: rgba(255,255,255,0.25); font-weight: 300; line-height: 1; }
  .pricing-footer {
    background: rgba(96,165,250,0.06);
    border-top: 1px solid rgba(96,165,250,0.12);
    padding: 16px 40px; font-size: 13px; color: rgba(255,255,255,0.45); letter-spacing: 0.2px;
  }

  /* ── About card ── */
  .about-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(96,165,250,0.18);
    border-radius: 16px;
    padding: 36px 40px;
    max-width: 680px; width: 100%; text-align: left;
  }
  .about-role { font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #60a5fa; margin-bottom: 14px; }
  .about-name { font-family: 'Playfair Display', serif; font-size: clamp(22px, 3vw, 28px); font-weight: 700; color: #ffffff; margin-bottom: 20px; }
  .about-bio p { font-size: 15px; color: rgba(255,255,255,0.7); line-height: 1.8; margin-bottom: 14px; }
  .about-bio p:last-child { margin-bottom: 0; }

  /* ── CTA Button ── */
  .cta-btn {
    display: inline-block; background: #ffffff; color: #60a5fa;
    padding: 15px 36px; border-radius: 7px; font-size: 15px; font-weight: 700;
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

  /* ── Nav responsive — mobile gets 50% of desktop values ── */
  @media (max-width: 600px) {
    .nav-logo-circle { width: 105px !important; height: 105px !important; }
    .nav-logo-circle img { height: 105px !important; }
    .nav-wordmark-line { font-size: clamp(38px, 10vw, 60px) !important; }
    .nav-inner { gap: 16px !important; padding: 18px 20px !important; }
  }

  /* ── Mobile tweaks ── */
  @media (max-width: 480px) {
    .workflow-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
    .workflow-tile { padding: 20px 12px 24px; }
    .tile-gear { font-size: 1.8rem; }
    .pricing-top { padding: 24px 20px 20px; }
    .pricing-footer { padding: 14px 20px; }
    .about-card { padding: 24px 20px; }
    .gear-cluster .gc-lg { font-size: 6rem; }
    .gear-cluster .gc-md { font-size: 4.6rem; }
    .gear-cluster .gc-sm { font-size: 3.6rem; }
  }
`

// ── Gear Chain Cluster ──────────────────────────────────────────────────────
function GearCluster() {
  const gears = [
    { size: 'gc-sm', dir: 'gear-ccw' },
    { size: 'gc-md', dir: 'gear-cw'  },
    { size: 'gc-lg', dir: 'gear-ccw' },
    { size: 'gc-md', dir: 'gear-cw'  },
    { size: 'gc-sm', dir: 'gear-ccw' },
  ]
  return (
    <div className="gear-cluster">
      {gears.map((g, i) => (
        <span key={i} className={`gc-gear ${g.size} ${g.dir}`}>⚙️</span>
      ))}
    </div>
  )
}

// ── Style injector ──────────────────────────────────────────────────────────
function StyleInjector() {
  useEffect(() => {
    const tag = document.createElement('style')
    tag.textContent = css
    document.head.appendChild(tag)
    return () => document.head.removeChild(tag)
  }, [])
  return null
}

// ── Nav ─────────────────────────────────────────────────────────────────────
// 50% larger than previous: logo 140→210px, wordmark clamp(36→54, 6→9vw, 68→102px)
// Total nav height desktop: 20px border + 20px pad + 210px logo + 20px pad = 270px
// Mobile ≤600px: 20px + 18px + 105px + 18px = 161px
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
          gap: '28px',
          padding: '20px 32px',
        }}
      >
        <div
          className="nav-logo-circle"
          style={{
            width: '210px', height: '210px', borderRadius: '50%',
            background: '#ffffff', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0, overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0,0,0,0.35)', padding: '8px',
          }}
        >
          <img
            src={benFranklin}
            alt="FranklinAI Solutions"
            style={{ height: '210px', width: 'auto', objectFit: 'contain', display: 'block' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span
            className="nav-wordmark-line"
            style={{
              fontSize: 'clamp(54px, 9vw, 102px)', fontWeight: 800, color: '#ffffff',
              letterSpacing: '-2px', fontFamily: "'Inter', sans-serif",
              lineHeight: 1.02, whiteSpace: 'nowrap',
            }}
          >Franklin<span style={{ color: '#60a5fa' }}>AI</span></span>
          <span
            className="nav-wordmark-line"
            style={{
              fontSize: 'clamp(54px, 9vw, 102px)', fontWeight: 800, color: '#ffffff',
              letterSpacing: '-2px', fontFamily: "'Inter', sans-serif",
              lineHeight: 1.02, whiteSpace: 'nowrap',
            }}
          >Solutions</span>
        </div>
      </div>
    </nav>
  )
}

// ── Nav height offset ───────────────────────────────────────────────────────
// Desktop: 20px border + 20px pad + 210px logo + 20px pad = 270px → use 280px
// Mobile ≤600px: 20px + 18px + 105px + 18px = 161px → clamp floor
const NAV_OFFSET = 'clamp(168px, 28vw, 288px)'

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onBook }) {
  return (
    <section style={{
      paddingTop: NAV_OFFSET,
      paddingBottom: '32px',
      paddingLeft: '24px',
      paddingRight: '24px',
      maxWidth: '680px',
      margin: '0 auto',
      textAlign: 'center',
      background: '#070f24',
    }}>
      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(44px, 7vw, 76px)', fontWeight: 800,
        lineHeight: 1.06, color: '#ffffff', letterSpacing: '-0.5px', marginBottom: '20px',
      }}>AI Automation</h1>
      <p style={{
        fontSize: 'clamp(15px, 2vw, 17px)',
        fontFamily: "'Inter', sans-serif", fontWeight: 400,
        color: 'rgba(255,255,255,0.75)', lineHeight: 1.65,
        maxWidth: '480px', margin: '0 auto 32px', letterSpacing: '0.2px',
      }}>
        Practical AI workflows built for<br />professional service firms.
      </p>
      <button className="cta-btn" onClick={onBook}>
        Book a Free Audit →
      </button>
    </section>
  )
}

// ── Workflows ────────────────────────────────────────────────────────────────
function Workflows() {
  return (
    <section style={{ background: '#070f24', padding: '32px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <GearCluster />
        <h2 className="section-heading">Workflows</h2>
        <div className="workflow-grid">
          {workflows.map((w, i) => (
            <div className="workflow-tile" key={i}>
              <span className={`tile-gear ${i % 2 === 0 ? 'gear-cw' : 'gear-ccw'}`}>⚙️</span>
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
    <section style={{ background: '#070f24', padding: '32px 24px' }}>
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
    <section style={{ background: '#070f24', padding: '32px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <h2 className="section-heading">About</h2>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="about-card">
            <div className="about-role">Founder & Builder</div>
            <div className="about-name">David Peterson</div>
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
    <section style={{ background: '#070f24', padding: '32px 24px 48px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
          textTransform: 'uppercase', color: '#60a5fa', marginBottom: '18px',
        }}>GET STARTED</div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800,
          color: '#ffffff', marginBottom: '18px', lineHeight: 1.1,
        }}>Book your free audit.</h2>
        <p style={{
          fontSize: '17px', color: 'rgba(255,255,255,0.65)',
          lineHeight: 1.65, marginBottom: '32px',
        }}>
          30 minutes. We map your workflows and show you exactly what we can automate.
        </p>
        <button className="cta-btn" onClick={onBook} style={{ marginBottom: '20px' }}>
          Book a Free Audit →
        </button>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)' }}>
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
      padding: '40px 28px 44px',
      textAlign: 'center',
      borderTop: '1px solid rgba(96,165,250,0.08)',
    }}>
      <div style={{
        display: 'flex', flexDirection: 'row', alignItems: 'center',
        justifyContent: 'center', gap: '24px', margin: '0 auto 24px',
        flexWrap: 'wrap',
      }}>
        <div style={{
          width: '96px', height: '96px', borderRadius: '50%', background: '#ffffff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, overflow: 'hidden', padding: '5px',
          boxShadow: '0 3px 12px rgba(0,0,0,0.3)',
        }}>
          <img src={benFranklin} alt="FranklinAI Solutions" style={{
            height: '96px', width: 'auto', objectFit: 'contain', display: 'block',
          }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
          <span style={{
            fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#ffffff',
            letterSpacing: '-0.5px', lineHeight: 1.1, fontFamily: "'Inter', sans-serif",
          }}>Franklin<span style={{ color: '#60a5fa' }}>AI</span></span>
          <span style={{
            fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#ffffff',
            letterSpacing: '-0.5px', lineHeight: 1.1, fontFamily: "'Inter', sans-serif",
          }}>Solutions</span>
        </div>
      </div>
      <span style={{
        fontSize: '13px', color: 'rgba(255,255,255,0.3)',
        lineHeight: 1.8, display: 'block', letterSpacing: '0.2px',
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
