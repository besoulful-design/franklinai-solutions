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

// ── Keyframe injector ──────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Inter:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { font-family: 'Inter', sans-serif; }

  body { background: #070f24; color: #ffffff; overflow-x: hidden; }

  @keyframes spin-cw  { from { transform: rotate(0deg);   } to { transform: rotate(360deg);  } }
  @keyframes spin-ccw { from { transform: rotate(0deg);   } to { transform: rotate(-360deg); } }

  .gear-cw  { display: inline-block; animation: spin-cw  8s linear infinite; }
  .gear-ccw { display: inline-block; animation: spin-ccw 8s linear infinite; }

  /* Gear cluster */
  .gear-cluster {
    position: relative;
    width: 120px;
    height: 80px;
    margin: 0 auto 12px;
  }
  .gear-cluster .g {
    position: absolute;
    font-size: 2rem;
    line-height: 1;
  }
  .gear-cluster .g1 { top: 0;   left: 50%; transform: translateX(-50%); font-size: 2.4rem; }
  .gear-cluster .g2 { top: 24px; left: 8px;  font-size: 1.5rem; }
  .gear-cluster .g3 { top: 24px; right: 8px; font-size: 1.5rem; }
  .gear-cluster .g4 { bottom: 0; left: 20px; font-size: 1.1rem; }
  .gear-cluster .g5 { bottom: 0; right: 20px; font-size: 1.1rem; }

  /* Workflow grid */
  .workflow-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    width: 100%;
    max-width: 820px;
    margin: 0 auto;
  }
  .workflow-tile {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(96,165,250,0.18);
    border-radius: 16px;
    padding: 28px 24px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .tile-gear { font-size: 2rem; margin-bottom: 14px; }
  .tile-name {
    font-family: 'Playfair Display', serif;
    font-size: clamp(15px, 2vw, 18px);
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 10px;
    line-height: 1.3;
  }
  .tile-desc {
    font-size: 14px;
    color: rgba(255,255,255,0.65);
    line-height: 1.6;
  }

  /* Pricing card */
  .pricing-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(96,165,250,0.18);
    border-radius: 16px;
    overflow: hidden;
    max-width: 520px;
    width: 100%;
  }
  .pricing-top {
    padding: 36px 40px 28px;
  }
  .pricing-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #60a5fa;
    margin-bottom: 20px;
  }
  .pricing-numbers {
    display: flex;
    align-items: center;
    gap: 24px;
  }
  .pricing-amount {
    font-family: 'Playfair Display', serif;
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 800;
    color: #ffffff;
    line-height: 1;
  }
  .pricing-mo {
    font-size: 0.55em;
    font-weight: 400;
    color: rgba(255,255,255,0.6);
  }
  .pricing-period {
    font-size: 13px;
    color: rgba(255,255,255,0.45);
    margin-top: 6px;
    letter-spacing: 0.3px;
  }
  .pricing-plus {
    font-size: 28px;
    color: rgba(255,255,255,0.3);
    font-weight: 300;
    line-height: 1;
  }
  .pricing-footer {
    background: rgba(96,165,250,0.07);
    border-top: 1px solid rgba(96,165,250,0.12);
    padding: 16px 40px;
    font-size: 13px;
    color: rgba(255,255,255,0.5);
    letter-spacing: 0.2px;
  }

  /* About card */
  .about-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(96,165,250,0.18);
    border-radius: 16px;
    padding: 36px 40px;
    max-width: 680px;
    width: 100%;
  }
  .about-role {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #60a5fa;
    margin-bottom: 20px;
  }
  .about-name {
    font-family: 'Playfair Display', serif;
    font-size: clamp(22px, 3vw, 28px);
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 20px;
  }
  .about-bio p {
    font-size: 15px;
    color: rgba(255,255,255,0.72);
    line-height: 1.75;
    margin-bottom: 14px;
  }
  .about-bio p:last-child { margin-bottom: 0; }

  /* Cal modal */
  .cal-overlay {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(7,15,36,0.88);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  .cal-overlay.open { display: flex; }
  .cal-box {
    position: relative;
    background: #0d1b3e;
    border: 1px solid rgba(96,165,250,0.25);
    border-radius: 16px;
    width: 100%;
    max-width: 820px;
    height: min(680px, 88vh);
    overflow: hidden;
    box-shadow: 0 32px 80px rgba(0,0,0,0.6);
    display: flex;
    flex-direction: column;
  }
  .cal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    flex-shrink: 0;
  }
  .cal-header-label {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #60a5fa;
  }
  .cal-close {
    background: none;
    border: none;
    cursor: pointer;
    color: rgba(255,255,255,0.5);
    font-size: 24px;
    line-height: 1;
    padding: 0 4px;
    transition: color 0.2s;
  }
  .cal-close:hover { color: #ffffff; }
  .cal-iframe-wrap { flex: 1; overflow: hidden; }
  .cal-iframe-wrap iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
    background: #ffffff;
    border-radius: 0 0 16px 16px;
  }
`

function StyleInjector() {
  useEffect(() => {
    const tag = document.createElement('style')
    tag.textContent = css
    document.head.appendChild(tag)
    return () => document.head.removeChild(tag)
  }, [])
  return null
}

// ── Nav ────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: '#070f24',
      paddingTop: '22px', paddingBottom: '22px',
      paddingLeft: '32px', paddingRight: '32px',
      borderTop: '20px solid #070f24',
      display: 'flex', flexDirection: 'row',
      alignItems: 'center', justifyContent: 'center', gap: '24px',
    }}>
      <div style={{
        width: '100px', height: '100px', borderRadius: '50%',
        background: '#ffffff', display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexShrink: 0, overflow: 'hidden',
        boxShadow: '0 3px 16px rgba(0,0,0,0.3)', padding: '4px',
      }}>
        <img src={benFranklin} alt="FranklinAI Solutions" style={{
          height: '100px', width: 'auto', objectFit: 'contain', display: 'block',
        }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <span style={{
          fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, color: '#ffffff',
          letterSpacing: '-2px', fontFamily: "'Inter', sans-serif", lineHeight: 1, whiteSpace: 'nowrap',
        }}>Franklin<span style={{ color: '#60a5fa' }}>AI</span></span>
        <span style={{
          fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, color: '#ffffff',
          letterSpacing: '-2.5px', fontFamily: "'Inter', sans-serif", lineHeight: 1, whiteSpace: 'nowrap',
        }}>Solutions</span>
      </div>
    </nav>
  )
}

// ── Hero ───────────────────────────────────────────────────────────────────
function Hero({ onBook }) {
  return (
    <section style={{
      padding: 'clamp(160px, 18vw, 220px) 24px 40px',
      maxWidth: '680px', margin: '0 auto', textAlign: 'center', background: '#070f24',
    }}>
      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(40px, 6vw, 70px)', fontWeight: 800,
        lineHeight: 1.08, color: '#ffffff', letterSpacing: '-0.5px', marginBottom: '22px',
      }}>AI Automation</h1>
      <p style={{
        fontSize: '17px', fontFamily: "'Inter', sans-serif", fontWeight: 400,
        color: 'rgba(255,255,255,0.85)', lineHeight: 1.6,
        maxWidth: '540px', margin: '0 auto 32px', letterSpacing: '0.3px',
      }}>
        Practical AI workflows built for<br />professional service firms.
      </p>
      <button
        style={{
          display: 'inline-block', background: '#ffffff', color: '#60a5fa',
          padding: '15px 34px', borderRadius: '7px', fontSize: '15px',
          fontWeight: 700, fontFamily: "'Inter', sans-serif", letterSpacing: '0.3px',
          border: 'none', cursor: 'pointer',
        }}
        onClick={onBook}
        onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
        onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
      >
        Book a Free Audit →
      </button>
    </section>
  )
}

// ── Workflows ──────────────────────────────────────────────────────────────
function Workflows() {
  return (
    <section style={{ background: '#070f24', padding: 'clamp(60px, 8vw, 100px) 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <div className="gear-cluster">
          <span className="g g1 gear-cw">⚙️</span>
          <span className="g g2 gear-ccw">⚙️</span>
          <span className="g g3 gear-cw">⚙️</span>
          <span className="g g4 gear-ccw">⚙️</span>
          <span className="g g5 gear-cw">⚙️</span>
        </div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '11vw', fontWeight: 800, color: '#ffffff',
          lineHeight: 1, marginBottom: 'clamp(40px, 5vw, 64px)',
          pointerEvents: 'none',
        }}>Workflows</h2>
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

// ── Pricing ────────────────────────────────────────────────────────────────
function Pricing() {
  return (
    <section style={{ background: '#070f24', padding: '8px 24px clamp(60px, 8vw, 100px)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <div className="section-content">
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '11vw', fontWeight: 800, color: '#ffffff',
            lineHeight: 1, marginBottom: 'clamp(32px, 4vw, 52px)',
            pointerEvents: 'none',
          }}>Pricing</h2>
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
      </div>
    </section>
  )
}

// ── About ──────────────────────────────────────────────────────────────────
function About() {
  return (
    <section style={{ background: '#070f24', padding: '2px 24px clamp(60px, 8vw, 100px)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <div className="section-content">
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '11vw', fontWeight: 800, color: '#ffffff',
            lineHeight: 1, marginBottom: 'clamp(32px, 4vw, 52px)',
            pointerEvents: 'none',
          }}>About</h2>
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
      </div>
    </section>
  )
}

// ── Contact ────────────────────────────────────────────────────────────────
function Contact({ onBook }) {
  return (
    <section style={{ background: '#070f24', padding: 'clamp(60px, 8vw, 100px) 24px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          fontSize: '16px', fontWeight: 700, letterSpacing: '3px',
          textTransform: 'uppercase', color: '#60a5fa', marginBottom: '20px',
        }}>GET STARTED</div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800,
          color: '#ffffff', marginBottom: '20px', lineHeight: 1.1,
        }}>Book your free audit.</h2>
        <p style={{
          fontSize: '17px', color: 'rgba(255,255,255,0.7)',
          lineHeight: 1.6, marginBottom: '36px',
        }}>
          30 minutes. We map your workflows and show you exactly what we can automate.
        </p>
        <button
          style={{
            display: 'inline-block', background: '#ffffff', color: '#60a5fa',
            padding: '15px 34px', borderRadius: '7px', fontSize: '15px',
            fontWeight: 700, fontFamily: "'Inter', sans-serif", letterSpacing: '0.3px',
            border: 'none', cursor: 'pointer', marginBottom: '24px',
          }}
          onClick={onBook}
          onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
          onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
        >
          Book a Free Audit →
        </button>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
          Or email: <a
            href="mailto:david@franklinaisolutions.com"
            style={{ color: '#60a5fa', textDecoration: 'none' }}
          >david@franklinaisolutions.com</a>
        </div>
      </div>
    </section>
  )
}

// ── Footer ─────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: '#070f24', padding: '44px 28px 32px', textAlign: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'row', alignItems: 'center',
        justifyContent: 'center', gap: '14px', margin: '0 auto 20px',
      }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%', background: '#ffffff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, overflow: 'hidden', padding: '3px',
        }}>
          <img src={benFranklin} alt="FranklinAI Solutions" style={{
            height: '64px', width: 'auto', objectFit: 'contain', display: 'block',
          }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
          <span style={{
            fontSize: '26px', fontWeight: 800, color: '#ffffff',
            letterSpacing: '-0.5px', lineHeight: 1, fontFamily: "'Inter', sans-serif",
          }}>Franklin<span style={{ color: '#60a5fa' }}>AI</span></span>
          <span style={{
            fontSize: '26px', fontWeight: 800, color: '#ffffff',
            letterSpacing: '-0.5px', lineHeight: 1, fontFamily: "'Inter', sans-serif",
          }}>Solutions</span>
        </div>
      </div>
      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, display: 'block' }}>
        © 2026 FranklinAI Solutions · Philadelphia, PA<br />
        franklinaisolutions.com
      </span>
    </footer>
  )
}

// ── CalModal ───────────────────────────────────────────────────────────────
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

// ── App ────────────────────────────────────────────────────────────────────
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
