import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import MusicButton from '../components/music/MusicButton.jsx';
import ProductivityNavButton from '../components/productivity/ProductivityNavButton.jsx';
import InstallAppButton from '../components/pwa/InstallAppButton.jsx';

/* ─────────────────────────────────────────────────────────────
   Glass panel — the core reusable wrapper
───────────────────────────────────────────────────────────── */
function Glass({ children, style = {}, hover = false, className = '' }) {
  return (
    <div
      className={className}
      style={{
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        borderRadius: '14px',
        transition: hover ? 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)' : undefined,
        ...style,
      }}
      onMouseEnter={hover ? e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.38)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2)';
      } : undefined}
      onMouseLeave={hover ? e => {
        e.currentTarget.style.background = style.background || 'rgba(255,255,255,0.06)';
        e.currentTarget.style.borderColor = style.borderColor || 'rgba(255,255,255,0.15)';
        e.currentTarget.style.transform = style.transform || 'translateY(0)';
        e.currentTarget.style.boxShadow = style.boxShadow || '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)';
      } : undefined}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Feature card
───────────────────────────────────────────────────────────── */
function FeatureCard({ emoji, title, desc }) {
  return (
    <Glass hover style={{ padding: '28px 24px', cursor: 'default' }}>
      <div style={{ fontSize: '32px', marginBottom: '14px', lineHeight: 1 }}>{emoji}</div>
      <h3 style={{
        fontFamily: "'Gaegu', cursive",
        fontSize: '20px',
        color: '#ffffff',
        marginBottom: '8px',
        fontWeight: 700,
        margin: '0 0 8px',
      }}>
        {title}
      </h3>
      <p style={{
        fontFamily: "'Patrick Hand', cursive",
        fontSize: '14px',
        color: 'rgba(255,255,255,0.6)',
        lineHeight: 1.7,
        margin: 0,
      }}>
        {desc}
      </p>
    </Glass>
  );
}

/* ─────────────────────────────────────────────────────────────
   Step item
───────────────────────────────────────────────────────────── */
function Step({ number, title, desc }) {
  return (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
      <Glass hover style={{
        minWidth: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Gaegu', cursive",
        fontSize: '20px',
        fontWeight: 700,
        color: '#ffffff',
        flexShrink: 0,
        background: 'rgba(255,255,255,0.12)',
        borderRadius: '10px',
        cursor: 'default',
      }}>
        {number}
      </Glass>
      <div>
        <h4 style={{
          fontFamily: "'Gaegu', cursive",
          fontSize: '18px',
          color: '#ffffff',
          margin: '0 0 4px',
          fontWeight: 700,
        }}>
          {title}
        </h4>
        <p style={{
          fontFamily: "'Patrick Hand', cursive",
          fontSize: '14px',
          color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.6,
          margin: 0,
        }}>
          {desc}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Mock book card for hero illustration
───────────────────────────────────────────────────────────── */
function MockBookCard({ title, author, chapters, words, style = {} }) {
  return (
    <Glass hover style={{ padding: '18px 20px', cursor: 'default', borderRadius: '14px', ...style }}>
      <div style={{ fontFamily: "'Gaegu', cursive", fontSize: '15px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
        {title}
      </div>
      <div style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>
        {author}
      </div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {[`📖 ${chapters} ch`, `📝 ${words} words`].map(label => (
          <span key={label} style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.75)',
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '6px',
            fontFamily: "'Patrick Hand', cursive",
          }}>
            {label}
          </span>
        ))}
      </div>
    </Glass>
  );
}

/* ─────────────────────────────────────────────────────────────
   Pill label
───────────────────────────────────────────────────────────── */
function Pill({ children }) {
  return (
    <Glass hover style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 14px',
      borderRadius: '999px',
      fontSize: '12px',
      color: 'rgba(255,255,255,0.7)',
      marginBottom: '16px',
      cursor: 'default',
    }}>
      <span style={{ fontFamily: "'Patrick Hand', cursive" }}>{children}</span>
    </Glass>
  );
}

/* ─────────────────────────────────────────────────────────────
   Buttons
───────────────────────────────────────────────────────────── */
const btnBase = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  fontFamily: "'Patrick Hand', cursive",
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'all 0.2s ease',
  userSelect: 'none',
};

const btnPrimary = {
  ...btnBase,
  background: '#ffffff',
  color: '#000000',
  border: '1px solid #ffffff',
  padding: '10px 24px',
  fontSize: '15px',
};

const btnSecondary = {
  ...btnBase,
  background: 'rgba(255,255,255,0.08)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  color: '#ffffff',
  border: '1px solid rgba(255,255,255,0.3)',
  padding: '10px 24px',
  fontSize: '15px',
};

/* ─────────────────────────────────────────────────────────────
   LANDING PAGE
───────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: '#000000', color: '#ffffff', position: 'relative', overflowX: 'hidden' }}>

      {/* ── FIXED BG IMAGE ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: 'url(/landing-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 0,
      }} aria-hidden="true" />

      {/* ── DARK OVERLAY ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.62) 50%, rgba(0,0,0,0.88) 100%)',
        zIndex: 1,
      }} aria-hidden="true" />

      {/* ── CONTENT ── */}
      <div style={{ position: 'relative', zIndex: 2 }}>

        {/* NAV */}
        <Glass style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}>
          <div style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>📚</span>
              <span style={{ fontFamily: "'Gaegu', cursive", fontSize: '20px', fontWeight: 700 }}>Book Companion</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <InstallAppButton />
              <ProductivityNavButton />
              <MusicButton />
              {isAuthenticated ? (
                <Link to="/" className="landing-nav-btn-secondary">My Library →</Link>
              ) : (
                <>
                  <Link to="/login" className="landing-nav-btn-secondary">Log In</Link>
                  <Link to="/register" className="landing-nav-btn-primary">✨ Sign Up Free</Link>
                </>
              )}
            </div>
          </div>
        </Glass>

        {/* HERO */}
        <section style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '80px 24px 64px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '56px',
          alignItems: 'center',
        }}>
          <div>
            <Pill>📖 Your Personal Reading Journal</Pill>
            <h1 style={{
              fontFamily: "'Gaegu', cursive",
              fontSize: 'clamp(38px, 6vw, 68px)',
              lineHeight: 1.1,
              color: '#ffffff',
              margin: '0 0 24px',
              fontWeight: 700,
            }}>
              Never forget<br />
              a word{' '}
              <span style={{ borderBottom: '2px solid rgba(255,255,255,0.4)', paddingBottom: '2px' }}>
                you read.
              </span>
            </h1>
            <p style={{
              fontFamily: "'Patrick Hand', cursive",
              fontSize: '17px',
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.6)',
              maxWidth: '460px',
              margin: '0 0 36px',
            }}>
              Book Companion is your personal vocabulary &amp; notes tracker.
              Save words you encounter, capture key sentences, and organise
              everything by book &amp; chapter.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {isAuthenticated ? (
                <Link to="/" className="landing-btn-primary" style={{ fontSize: '16px', padding: '12px 32px' }}>📚 Open My Library</Link>
              ) : (
                <>
                  <Link to="/register" className="landing-btn-primary" style={{ fontSize: '16px', padding: '12px 32px' }}>✨ Start for Free</Link>
                  <Link to="/login" className="landing-btn-secondary" style={{ fontSize: '16px', padding: '12px 32px' }}>Log In</Link>
                </>
              )}
            </div>
            <p style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '12px', color: 'rgba(255,255,255,0.3)', margin: '16px 0 0' }}>
              No credit card · No installs · Works on mobile
            </p>
          </div>

          {/* Mock cards */}
          <div aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <MockBookCard title="The Alchemist" author="Paulo Coelho" chapters={3} words={12} style={{ transform: 'rotate(-1deg)' }} />
            <MockBookCard title="Atomic Habits" author="James Clear" chapters={5} words={27} style={{ transform: 'rotate(0.8deg)', background: 'rgba(255,255,255,0.09)' }} />
            <MockBookCard title="Sapiens" author="Yuval Noah Harari" chapters={2} words={8} style={{ transform: 'rotate(-0.5deg)' }} />
          </div>
        </section>

        {/* THIN DIVIDER */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* FEATURES */}
        <section style={{ padding: '72px 24px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '52px' }}>
              <Pill>⚡ Features</Pill>
              <h2 style={{ fontFamily: "'Gaegu', cursive", fontSize: 'clamp(28px, 4vw, 44px)', color: '#ffffff', margin: '8px 0 8px', fontWeight: 700 }}>
                Everything a reader needs
              </h2>
              <p style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '15px', color: 'rgba(255,255,255,0.45)' }}>
                Simple tools, thoughtfully crafted. Nothing more.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '18px' }}>
              <FeatureCard emoji="📖" title="Organize by Book & Chapter" desc="Structure your reading exactly like the book itself. Create books, add chapters, drill down with ease." />
              <FeatureCard emoji="🔤" title="Save Unknown Words" desc="Stumble on a word? Save it instantly. Look it up on Google, paste the meaning, done." />
              <FeatureCard emoji="📝" title="Capture Key Notes" desc="Write down powerful sentences and important ideas — tied directly to the chapter." />
              <FeatureCard emoji="🔍" title="Search & Filter" desc="Find any word you saved in a chapter instantly with the built-in filter." />
              <FeatureCard emoji="🎵" title="Study Background Music" desc="Play soothing lofi study beats and ambient music directly from YouTube, auto-minimized for zero distraction." />
              <FeatureCard emoji="📱" title="Works on Mobile" desc="Whether you're on your phone or desktop, the app adapts. Perfect for reading on the go." />
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{ padding: '0 24px 72px' }}>
          <div style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '56px',
            alignItems: 'center',
          }}>
            <div>
              <Pill>🗺 How It Works</Pill>
              <h2 style={{ fontFamily: "'Gaegu', cursive", fontSize: 'clamp(26px, 3.5vw, 38px)', color: '#ffffff', margin: '8px 0 36px', fontWeight: 700 }}>
                From book to brain in 4 steps
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <Step number="1" title="Add your book" desc="Enter the title and author. Takes 5 seconds." />
                <Step number="2" title="Create chapters" desc="Split your reading into chapters to stay organized." />
                <Step number="3" title="Save words & notes" desc="Log words with meanings and key sentences as you read." />
                <Step number="4" title="Review anytime" desc="Come back to your vocabulary list and notes whenever you want." />
              </div>
            </div>

            {/* Mock word list */}
            <Glass aria-hidden="true" style={{ padding: '28px' }}>
              <div style={{ fontFamily: "'Gaegu', cursive", fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
                📖 Chapter 3 — Words
              </div>
              {[
                { word: 'Alchemy', meaning: 'Transforming something common into something special' },
                { word: 'Maktub', meaning: '"It is written" — Arabic for fate / destiny' },
                { word: 'Elixir', meaning: 'A magical or medicinal potion' },
              ].map(({ word, meaning }) => (
                <div key={word} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr',
                  gap: '12px',
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  fontFamily: "'Patrick Hand', cursive",
                  fontSize: '13px',
                }}>
                  <strong style={{ color: '#ffffff' }}>{word}</strong>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{meaning}</span>
                </div>
              ))}
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                {['3 words saved', '2 notes'].map(l => (
                  <span key={l} style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    color: 'rgba(255,255,255,0.65)',
                    fontSize: '12px',
                    padding: '3px 10px',
                    fontFamily: "'Patrick Hand', cursive",
                  }}>{l}</span>
                ))}
              </div>
            </Glass>
          </div>
        </section>

        {/* QUOTE */}
        <section style={{ padding: '0 24px 72px' }}>
          <Glass style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '56px 48px',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.03)',
          }}>
            <div style={{ fontFamily: "'Gaegu', cursive", fontSize: '72px', color: 'rgba(255,255,255,0.12)', lineHeight: 0.8, marginBottom: '24px' }}>
              "
            </div>
            <blockquote style={{
              fontFamily: "'Gaegu', cursive",
              fontSize: 'clamp(20px, 3vw, 30px)',
              color: '#ffffff',
              lineHeight: 1.5,
              margin: '0 auto 20px',
              maxWidth: '680px',
              fontStyle: 'normal',
            }}>
              A reader lives a thousand lives before he dies.
              The man who never reads lives only one.
            </blockquote>
            <cite style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '13px', color: 'rgba(255,255,255,0.3)', fontStyle: 'normal' }}>
              — George R.R. Martin
            </cite>
          </Glass>
        </section>

        {/* CTA */}
        <section style={{ maxWidth: '700px', margin: '0 auto', padding: '0 24px 96px', textAlign: 'center' }}>
          <Pill>🚀 Ready to start?</Pill>
          <h2 style={{ fontFamily: "'Gaegu', cursive", fontSize: 'clamp(28px, 4vw, 46px)', color: '#ffffff', margin: '12px 0 16px', lineHeight: 1.2, fontWeight: 700 }}>
            Build your reading vocabulary —<br />one book at a time.
          </h2>
          <p style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, margin: '0 0 40px' }}>
            It's free, it's fast, and it works exactly like your own handwritten notes — but digital and searchable.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <Link to="/" className="landing-btn-primary" style={{ fontSize: '17px', padding: '14px 40px' }}>📚 Go to My Library</Link>
            ) : (
              <>
                <Link to="/register" className="landing-btn-primary" style={{ fontSize: '17px', padding: '14px 40px' }}>✨ Create Free Account</Link>
                <Link to="/login" className="landing-btn-secondary" style={{ fontSize: '17px', padding: '14px 40px' }}>Log In</Link>
              </>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <Glass style={{
          borderLeft: 'none',
          borderRight: 'none',
          borderBottom: 'none',
          padding: '20px 24px',
          textAlign: 'center',
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}>
          <p style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '13px', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
            📚 Book Reading Companion — Your personal vocabulary &amp; notes tracker
          </p>
        </Glass>

      </div>
    </div>
  );
}
