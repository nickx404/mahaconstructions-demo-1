import { useState, useEffect, useRef } from 'react';
import { 
  ArrowUpRight, 
  Check, 
  CheckCircle, 
  Clock, 
  Compass, 
  Copy, 
  EnvelopeSimple, 
  List as Menu, 
  MapPin, 
  Phone, 
  Sparkle, 
  WhatsappLogo, 
  X 
} from '@phosphor-icons/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sitePath } from './paths.js';
import Footer from './Footer.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function ContactPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [chennaiTime, setChennaiTime] = useState('');
  const [selectedEnquiries, setSelectedEnquiries] = useState(['General Inquiry']);
  const [formValues, setFormValues] = useState({ name: '', phone: '', email: '', message: '' });

  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const formCardRef = useRef(null);
  const detailsRef = useRef(null);
  const mapCardRef = useRef(null);
  const blueprintCanvasRef = useRef(null);

  const closeMenu = () => setMenuOpen(false);

  // Live Chennai Time (IST) clock
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });
        setChennaiTime(formatter.format(now));
      } catch {
        setChennaiTime('IST (UTC+5:30)');
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Copy to clipboard helper
  const handleCopy = (text, fieldName) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2400);
  };

  // Toggle enquiry checkbox
  const handleEnquiryToggle = (type) => {
    setSelectedEnquiries((prev) => 
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // GSAP Orchestration & ScrollTrigger Reveals
  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      // 1. Hero Text Reveal & Motion Graphics Entrance
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl
        .fromTo('.contact-eyebrow-badge', 
          { autoAlpha: 0, y: -16, scale: 0.94 }, 
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, delay: 0.1 }
        )
        .fromTo('.hero-split-line', 
          { yPercent: 110, rotate: 1 }, 
          { yPercent: 0, rotate: 0, duration: 1.05, stagger: 0.12, ease: 'power4.out' }, 
          '-=0.4'
        )
        .fromTo('.contact-hero-desc', 
          { autoAlpha: 0, y: 24 }, 
          { autoAlpha: 1, y: 0, duration: 0.8 }, 
          '-=0.6'
        )
        .fromTo('.contact-time-pill', 
          { autoAlpha: 0, scale: 0.88 }, 
          { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }, 
          '-=0.5'
        );

      // 2. Form Card Scroll Reveal
      if (formCardRef.current) {
        gsap.fromTo(formCardRef.current,
          { autoAlpha: 0, y: 45, scale: 0.98 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.95,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: formCardRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );

        // Form Fields Stagger Reveal
        gsap.fromTo('.contact-form-field',
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: formCardRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      // 3. Details Aside Stagger Entrance
      if (detailsRef.current) {
        gsap.fromTo('.contact-detail-card',
          { autoAlpha: 0, x: 30, y: 15 },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: detailsRef.current,
              start: 'top 82%',
            },
          }
        );
      }

      // 4. Map Section Reveal
      if (mapCardRef.current) {
        gsap.fromTo(mapCardRef.current,
          { autoAlpha: 0, y: 40, scale: 0.97 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: mapCardRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      // 5. Continuous Floating Motion Graphics Accents
      gsap.to('.motion-geo-ring', {
        rotation: 360,
        duration: 45,
        repeat: -1,
        ease: 'none',
      });

      gsap.to('.motion-geo-compass', {
        rotation: -360,
        duration: 60,
        repeat: -1,
        ease: 'none',
      });

      gsap.to('.motion-drift-particle', {
        y: '-=18',
        x: '+=10',
        duration: 4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        stagger: 0.6,
      });

    }, pageRef);

    return () => ctx.revert();
  }, []);

  // 3D Magnetic Card Hover Effect on Map & Form
  const handleMapMouseMove = (e) => {
    const card = mapCardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / rect.height) * 4;
    const rotateY = (x / rect.width) * 4;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
  };

  const handleMapMouseLeave = () => {
    if (mapCardRef.current) {
      mapCardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    }
  };

  return (
    <div className="contact-page" ref={pageRef}>
      {/* Background Architectural Blueprint Motion Graphic */}
      <div className="contact-blueprint-grid" aria-hidden="true">
        <svg className="blueprint-svg-lines" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="archGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(23, 74, 42, 0.04)" strokeWidth="1" />
              <circle cx="60" cy="0" r="1.5" fill="rgba(120, 190, 32, 0.18)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#archGrid)" />
        </svg>

        {/* Floating Geometric Motion Accents */}
        <div className="motion-geo-accent motion-geo-ring" style={{ top: '12%', right: '6%' }}>
          <svg width="220" height="220" viewBox="0 0 220 220" fill="none">
            <circle cx="110" cy="110" r="100" stroke="rgba(120, 190, 32, 0.15)" strokeWidth="1" strokeDasharray="6 8" />
            <circle cx="110" cy="110" r="70" stroke="rgba(23, 74, 42, 0.08)" strokeWidth="1" />
            <line x1="110" y1="0" x2="110" y2="220" stroke="rgba(23, 74, 42, 0.06)" strokeWidth="1" />
            <line x1="0" y1="110" x2="220" y2="110" stroke="rgba(23, 74, 42, 0.06)" strokeWidth="1" />
          </svg>
        </div>

        <div className="motion-geo-accent motion-geo-compass" style={{ bottom: '18%', left: '4%' }}>
          <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
            <circle cx="90" cy="90" r="80" stroke="rgba(23, 74, 42, 0.07)" strokeWidth="1" strokeDasharray="3 6" />
            <circle cx="90" cy="90" r="45" stroke="rgba(144, 173, 46, 0.14)" strokeWidth="1" />
            <circle cx="90" cy="90" r="4" fill="rgba(120, 190, 32, 0.25)" />
          </svg>
        </div>

        {/* Ambient Pulsing Aura */}
        <div className="motion-ambient-glow" />
      </div>

      <header className={`site-header projects-header${menuOpen ? ' menu-open' : ''}`}>
        <a className="wordmark" href={sitePath('/')} aria-label="Maha Constructions home" onClick={closeMenu}>
          <img src={sitePath('/images/maha-constructions-logo.png')} alt="Maha Constructions" />
        </a>
        <button 
          className="menu-toggle" 
          type="button" 
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} 
          aria-expanded={menuOpen} 
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
        <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          <a href={sitePath('/')} onClick={closeMenu}>Home</a>
          <a href={sitePath('/about-2')} onClick={closeMenu}>About Us</a>
          <a href={sitePath('/projects')} onClick={closeMenu}>Projects</a>
          <a href={sitePath('/joint-venture')} onClick={closeMenu}>Joint Venture</a>
          <a href={sitePath('/gallery')} onClick={closeMenu}>Gallery</a>
          <a href={sitePath('/contact')} aria-current="page" onClick={closeMenu}>Contact</a>
          <a className="nav-enquiry" href="#contact-form" onClick={closeMenu}>
            Enquire <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </nav>
      </header>

      <main className="contact-page-main">
        {/* Kinetic Hero Section */}
        <section className="contact-page-hero section-shell" aria-labelledby="contact-page-title" ref={heroRef}>
          <div className="contact-hero-left">
            <div className="contact-eyebrow-badge">
              <span className="live-status-dot" aria-hidden="true" />
              <span className="eyebrow-text">Contact Maha Constructions</span>
            </div>

            <h1 id="contact-page-title" className="contact-title-masked">
              <span className="hero-split-line-wrap">
                <span className="hero-split-line">Let’s start a</span>
              </span>
              <span className="hero-split-line-wrap">
                <span className="hero-split-line">
                  <em className="gradient-shimmer-text">conversation.</em>
                </span>
              </span>
            </h1>

            <p className="contact-hero-desc">
              Tell us a little about what you have in mind. Whether it’s your future home, an ongoing project inquiry, or a strategic partnership, our engineering and advisory team is ready.
            </p>
          </div>

          <div className="contact-hero-right">
            {/* Live IST Chennai Time Beacon Card */}
            <div className="contact-time-pill" title="Live Chennai Office Local Time">
              <div className="time-pill-header">
                <span className="beacon-radar">
                  <span className="beacon-core" />
                  <span className="beacon-wave" />
                </span>
                <span className="time-pill-label">Lakshmipuram • Chennai HQ</span>
              </div>
              <div className="time-pill-clock">
                <Clock size={16} weight="bold" aria-hidden="true" />
                <span>{chennaiTime || '09:30 AM IST'}</span>
              </div>
              <p className="time-pill-sub">Office desk active • Fast email & WhatsApp response</p>
            </div>
          </div>
        </section>

        {/* Interactive Form & Contact Details Section */}
        <section className="contact-page-content section-shell" id="contact-form">
          {/* Animated Form Card */}
          <form 
            className="contact-page-form" 
            ref={formCardRef}
            onSubmit={(event) => { 
              event.preventDefault(); 
              setSubmitted(true); 
            }}
          >
            {/* Top Light-Beam Animation */}
            <div className="form-beam-glow" aria-hidden="true" />

            <div className="contact-page-form-heading">
              <div>
                <span className="eyebrow">Your enquiry</span>
                <h2>How can we help?</h2>
              </div>
              <span className="form-req-pill">All fields required</span>
            </div>

            <div className="form-row contact-form-field">
              <label className="animated-input-group">
                <span>Name</span>
                <input 
                  name="name" 
                  autoComplete="name" 
                  placeholder="Your full name" 
                  required 
                  value={formValues.name}
                  onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                />
              </label>

              <label className="animated-input-group">
                <span>Phone number</span>
                <input 
                  name="phone" 
                  type="tel" 
                  autoComplete="tel" 
                  placeholder="+91 90000 00000" 
                  required 
                  value={formValues.phone}
                  onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })}
                />
              </label>
            </div>

            <div className="contact-form-field">
              <label className="animated-input-group">
                <span>Email address</span>
                <input 
                  name="email" 
                  type="email" 
                  autoComplete="email" 
                  placeholder="you@example.com" 
                  required 
                  value={formValues.email}
                  onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                />
              </label>
            </div>

            <fieldset className="contact-enquiry-types contact-form-field">
              <legend>What would you like to discuss?</legend>
              <div className="enquiry-chips-row">
                {['General Inquiry', 'Building Contract', 'Joint Venture'].map((type) => {
                  const isChecked = selectedEnquiries.includes(type);
                  return (
                    <label 
                      key={type} 
                      className={`enquiry-chip-label${isChecked ? ' is-selected' : ''}`}
                    >
                      <input 
                        type="checkbox" 
                        name="enquiryType" 
                        value={type} 
                        checked={isChecked}
                        onChange={() => handleEnquiryToggle(type)}
                      />
                      <span className="chip-indicator">
                        {isChecked && <Check size={13} weight="bold" aria-hidden="true" />}
                      </span>
                      <span className="chip-text">{type}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="contact-form-field">
              <label className="animated-input-group">
                <span>Message</span>
                <textarea 
                  name="message" 
                  rows="4" 
                  placeholder="Share a few details about your property, requirements, or vision..." 
                  required 
                  value={formValues.message}
                  onChange={(e) => setFormValues({ ...formValues, message: e.target.value })}
                />
              </label>
            </div>

            <div className="contact-form-field form-submit-container">
              <button 
                className={`button button-green magnetic-button${submitted ? ' is-success' : ''}`} 
                type="submit"
              >
                {submitted ? (
                  <>
                    <CheckCircle size={18} weight="fill" aria-hidden="true" />
                    <span>Enquiry Received</span>
                  </>
                ) : (
                  <>
                    <span>Send enquiry</span>
                    <ArrowUpRight size={16} weight="bold" className="button-arrow-icon" aria-hidden="true" />
                  </>
                )}
              </button>

              <div 
                className={`contact-page-form-note${submitted ? ' is-visible' : ''}`} 
                aria-live="polite"
              >
                {submitted ? (
                  <div className="success-banner-card">
                    <Sparkle size={18} weight="fill" className="success-sparkle" aria-hidden="true" />
                    <div>
                      <strong>Thanks for reaching out!</strong>
                      <p>Your message has been logged. Our engineering and project leads will review and respond promptly.</p>
                    </div>
                  </div>
                ) : (
                  <span className="preview-mode-tag">
                    Direct enquiry channel • Replies within 24 hours
                  </span>
                )}
              </div>
            </div>
          </form>

          {/* Interactive Contact Details Aside */}
          <aside className="contact-page-details" aria-label="Contact details" ref={detailsRef}>
            <div className="details-heading-wrap">
              <span className="eyebrow">Find us & get in touch</span>
              <h2>We’d be glad<br />to hear from you.</h2>
            </div>

            <div className="contact-detail-cards-stack">
              {/* Office Address Card */}
              <div className="contact-detail contact-detail-card interactive-hover-card">
                <div className="detail-icon-pill">
                  <MapPin size={20} weight="bold" aria-hidden="true" />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Office & Registered Address</span>
                  <p>
                    <strong>Maha construction</strong><br />
                    Plot 4 & 5, ARUNACHALAESWARAR ILLAM,<br />
                    3rd St, Secretariat Colony, Lakshmipuram,<br />
                    Chennai, 600099
                  </p>
                  <a 
                    className="detail-action-link" 
                    href="https://share.google/sFic984O7ZStGxeze" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View directions on map <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* Phone Card with Click-to-Copy */}
              <div className="contact-detail contact-detail-card interactive-hover-card">
                <div className="detail-icon-pill">
                  <Phone size={20} weight="bold" aria-hidden="true" />
                </div>
                <div className="detail-content">
                  <div className="detail-header-flex">
                    <span className="detail-label">Direct Phone Line</span>
                    <button 
                      type="button" 
                      className="copy-mini-btn" 
                      onClick={() => handleCopy('+919094044052', 'phone')}
                      title="Copy phone number"
                    >
                      {copiedField === 'phone' ? (
                        <span className="copied-text"><Check size={12} weight="bold" /> Copied</span>
                      ) : (
                        <span><Copy size={12} /> Copy</span>
                      )}
                    </button>
                  </div>
                  <p>
                    <a className="detail-primary-link" href="tel:+919094044052">
                      +91 90940 44052
                    </a>
                  </p>
                  <small className="detail-hint">Mon – Sat, 9:00 AM – 7:00 PM IST</small>
                </div>
              </div>

              {/* WhatsApp Card */}
              <div className="contact-detail contact-detail-card interactive-hover-card is-whatsapp">
                <div className="detail-icon-pill whatsapp-pill">
                  <WhatsappLogo size={20} weight="fill" aria-hidden="true" />
                </div>
                <div className="detail-content">
                  <div className="detail-header-flex">
                    <span className="detail-label">Instant WhatsApp</span>
                    <span className="live-status-badge">Fast Chat</span>
                  </div>
                  <p>
                    <a 
                      className="detail-primary-link" 
                      href="https://wa.me/919094044052" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      +91 90940 44052
                    </a>
                  </p>
                  <a 
                    className="whatsapp-quick-chip" 
                    href="https://wa.me/919094044052" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Start WhatsApp Chat <ArrowUpRight size={12} aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* Email Card with Click-to-Copy */}
              <div className="contact-detail contact-detail-card interactive-hover-card">
                <div className="detail-icon-pill">
                  <EnvelopeSimple size={20} weight="bold" aria-hidden="true" />
                </div>
                <div className="detail-content">
                  <div className="detail-header-flex">
                    <span className="detail-label">Email Inquiries</span>
                    <button 
                      type="button" 
                      className="copy-mini-btn" 
                      onClick={() => handleCopy('saimaha1000@gmail.com', 'email')}
                      title="Copy email address"
                    >
                      {copiedField === 'email' ? (
                        <span className="copied-text"><Check size={12} weight="bold" /> Copied</span>
                      ) : (
                        <span><Copy size={12} /> Copy</span>
                      )}
                    </button>
                  </div>
                  <p>
                    <a className="detail-primary-link" href="mailto:saimaha1000@gmail.com">
                      saimaha1000@gmail.com
                    </a>
                  </p>
                  <small className="detail-hint">Dedicated project team inbox</small>
                </div>
              </div>
            </div>
          </aside>
        </section>

        {/* Interactive Office Map Section */}
        <section className="contact-map-section section-shell" aria-labelledby="contact-map-title">
          <div 
            className="contact-map-card tilt-card-element" 
            ref={mapCardRef}
            onMouseMove={handleMapMouseMove}
            onMouseLeave={handleMapMouseLeave}
          >
            <div className="contact-map-copy">
              <div className="map-badge-row">
                <span className="eyebrow">Visit our office</span>
                <span className="coord-chip">13.1147° N, 80.2012° E</span>
              </div>
              <h2 id="contact-map-title">Around Chennai</h2>
              <p>
                Plot 4 & 5, ARUNACHALAESWARAR ILLAM, 3rd St, Secretariat Colony, Lakshmipuram, Chennai, 600099.
              </p>
              
              <div className="map-actions-group">
                <a 
                  className="contact-map-area magnetic-chip" 
                  href="https://share.google/sFic984O7ZStGxeze" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <MapPin size={16} weight="bold" aria-hidden="true" /> 
                  <span>Open in Google Maps</span>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>

                <div className="map-landmark-pill">
                  <Compass size={14} aria-hidden="true" />
                  <span>North Chennai Region</span>
                </div>
              </div>
            </div>

            <div className="contact-map-frame-wrapper">
              <div className="map-radar-overlay" aria-hidden="true">
                <span className="map-radar-center" />
                <span className="map-radar-circle wave-1" />
                <span className="map-radar-circle wave-2" />
              </div>
              <iframe 
                title="Map location for Maha Construction, Chennai" 
                src="https://maps.google.com/maps?q=Maha+construction,+Plot+4+%26+5,+ARUNACHALAESWARAR+ILLAM,+3rd+St,+Secretariat+Colony,+Lakshmipuram,+Chennai,+600099&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade" 
              />
            </div>
          </div>
        </section>
      </main>

      <Footer backToTopTarget="#top" className="contact-page-footer" />
    </div>
  );
}
