import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '@fontsource-variable/geist';
import Footer from './Footer.jsx';
import { sitePath } from './paths.js';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  List as Menu,
  X,
} from '@phosphor-icons/react';

gsap.registerPlugin(ScrollTrigger);

const founderSlides = [
  {
    label: 'A word from the founder',
    quote: 'We don’t just build spaces. We build trust that lasts.',
    note: 'Crafting enduring homes across Chennai with quiet precision and honest commitments.',
  },
  {
    label: 'Our founding philosophy',
    quote: 'Homes built with quiet precision and enduring quality.',
    note: 'Over 35 years of hands-on practice, Vaastu precision, and lifelong client relationships.',
  },
];

const milestones = [
  {
    date: '1990',
    title: 'The beginning',
    copy: 'Honest construction and structural quality in North Chennai.',
  },
  {
    date: '2010',
    title: 'A growing practice',
    copy: 'Expanding across Kolathur, Madhavaram, and Anna Nagar with on-time delivery.',
  },
  {
    date: '2018',
    title: 'Building trust',
    copy: 'Long-term landowner partnerships and homes delivered with clear titles.',
  },
  {
    date: 'Today',
    title: 'Modern living',
    copy: 'Contemporary, Vaastu-compliant landmarks like Maha Kuber.',
  },
];

const metrics = [
  {
    value: '35+',
    num: '35',
    suffix: '+',
    tag: 'Experience',
    label: 'Years of experience',
    note: 'Decades in Chennai',
  },
  {
    value: '100+',
    num: '100',
    suffix: '+',
    tag: 'Trust',
    label: 'Customers',
    note: 'Satisfied families',
  },
  {
    value: '50+',
    num: '50',
    suffix: '+',
    tag: 'Portfolio',
    label: 'Completed projects',
    note: 'Landmark communities',
  },
  {
    value: '100%',
    num: '100',
    suffix: '%',
    tag: 'Precision',
    label: 'On-time delivery',
    note: 'CMDA & RERA compliant',
  },
];

const reasons = [
  {
    title: 'Experience, with perspective',
    copy: 'Over 35 years of engineering expertise and structural discipline across Chennai.',
  },
  {
    title: 'A grounded understanding of place',
    copy: 'Prime Chennai locations chosen for strong infrastructure, sweet water, and connectivity.',
  },
  {
    title: 'Care in the details',
    copy: '100% Vaastu compliance, optimal ventilation, and earthquake-resistant RCC construction.',
  },
  {
    title: 'Relationships built to last',
    copy: 'Clear titles, transparent agreements, and responsive post-handover support.',
  },
];

const principles = [
  { number: '01', title: 'Integrity', copy: 'Clear communication and honest commitments at every stage.' },
  { number: '02', title: 'Quality', copy: 'A considered approach to making spaces useful and enduring.' },
  { number: '03', title: 'Responsibility', copy: 'Care for the land, the neighbourhood and the people who use each place.' },
  { number: '04', title: 'Relationships', copy: 'Long-term trust with customers, partners and landowners.' },
];

const tickerWords = ['Integrity', 'Quality', 'Responsibility', 'Relationships'];
const tickerSequence = [
  ...tickerWords, ...tickerWords, ...tickerWords, ...tickerWords,
  ...tickerWords, ...tickerWords, ...tickerWords, ...tickerWords,
];

function AboutPage({ variant = 'original' }) {
  if (variant === 'company') return <CompanyAboutPage />;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [founderSlide, setFounderSlide] = useState(0);
  const [activeReason, setActiveReason] = useState(0);
  const tickerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.content;
    document.title = 'About Maha Constructions | Building with Purpose';
    if (description) description.content = 'Discover the people, principles and story behind Maha Constructions.';
    return () => {
      document.title = previousTitle;
      if (description && previousDescription) description.content = previousDescription;
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) return undefined;

    const context = gsap.context(() => {
      gsap.utils.toArray('[data-about-reveal]').forEach((element) => {
        gsap.fromTo(element, { autoAlpha: 0, y: 30 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        });
      });

      gsap.fromTo('[data-about-word-reveal]', { opacity: 0.24 }, {
        opacity: 1,
        ease: 'none',
        scrollTrigger: { trigger: '[data-about-word-reveal]', start: 'top 78%', end: 'bottom 46%', scrub: 0.65 },
      });

      gsap.utils.toArray('[data-about-image]').forEach((image) => {
        gsap.fromTo(image, { scale: 0.93, autoAlpha: 0.66 }, {
          scale: 1,
          autoAlpha: 1,
          ease: 'none',
          scrollTrigger: { trigger: image, start: 'top 92%', end: 'top 38%', scrub: 0.7 },
        });
      });

      const desktop = window.matchMedia('(min-width: 900px)');
      if (desktop.matches) {
        const storyHeading = document.querySelector('.about-story-heading');
        const storySection = document.querySelector('#about-story');
        if (storyHeading && storySection) {
          ScrollTrigger.create({
            trigger: storySection,
            start: 'top top+=112',
            end: 'bottom bottom-=160',
            pin: storyHeading,
            pinSpacing: false,
          });
        }
      }

      if (tickerRef.current) {
        gsap.to(tickerRef.current, {
          xPercent: -50,
          duration: 100,
          ease: 'none',
          repeat: -1,
        });
      }
    });

    return () => context.revert();
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const moveFounderSlide = (direction) => {
    setFounderSlide((current) => (current + direction + founderSlides.length) % founderSlides.length);
  };

  return (
    <div className="about-page">
      <header className={`site-header about-header${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' menu-open' : ''}`}>
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
          <a href={sitePath('/')}>Home</a>
          <a href={sitePath('/about-2')} onClick={closeMenu}>About Us</a>
          <a href={sitePath('/about')} aria-current="page" onClick={closeMenu}>About (Editorial)</a>
          <a href={sitePath('/projects')} onClick={closeMenu}>Projects</a>
          <a href={sitePath('/joint-venture')} onClick={closeMenu}>Joint Venture</a>
          <a href={sitePath('/gallery')} onClick={closeMenu}>Gallery</a>
          <a href={sitePath('/contact')} onClick={closeMenu}>Contact</a>
          <a className="nav-enquiry" href={sitePath('/contact#contact-form')} onClick={closeMenu}>Get in touch <ArrowUpRight size={14} aria-hidden="true" /></a>
        </nav>
      </header>

      <main className="about-main">
        <section className="about-hero" aria-labelledby="about-title">
          <div className="about-blueprint" aria-hidden="true">
            <span className="blueprint-letter">M</span>
            <span className="blueprint-circle" />
            <span className="blueprint-cross blueprint-cross-one" />
            <span className="blueprint-cross blueprint-cross-two" />
          </div>
          <div className="about-hero-inner">
            <div className="about-hero-topline"><span>ABOUT MAHA CONSTRUCTIONS</span><span>CHENNAI · INDIA</span></div>
            <div className="about-hero-title-wrap">
              <span className="about-kicker">A story shaped over time</span>
              <h1 id="about-title"><span>ABOUT</span><span>MAHA</span><span>CONSTRUCTIONS</span></h1>
              <div className="about-hero-claim">
                <span>BUILDING WITH PURPOSE.</span>
                <span>GROWING WITH TRUST.</span>
              </div>
            </div>
            <div className="about-hero-bottomline">
              <span className="drawing-caption"><i /> A FOUNDATION FOR WHAT COMES NEXT</span>
              <div className="about-hero-links">
                <a href="#about-story">OUR STORY <ArrowDown size={14} aria-hidden="true" /></a>
                <a href="#founder">THE FOUNDER <ArrowUpRight size={14} aria-hidden="true" /></a>
              </div>
            </div>
          </div>
        </section>

        <section className="founder-section" id="founder" aria-labelledby="founder-section-title">
          <div className="section-meta" data-about-reveal><span>02 / THE FOUNDER</span><span>LEADERSHIP · PERSPECTIVE</span></div>
          <div className="founder-layout">
            <div className="founder-portrait" data-about-reveal aria-label="Leadership and craftsmanship">
              <div className="portrait-drawing" aria-hidden="true"><span /><i /><b /></div>
              <span className="portrait-note">LEADERSHIP & VISION<br />MAHA CONSTRUCTIONS</span>
              <span className="portrait-index">FIG. 01</span>
            </div>
            <div className="founder-copy" data-about-reveal>
              <span className="eyebrow">{founderSlides[founderSlide].label}</span>
              <h2 id="founder-section-title" className="founder-quote">“{founderSlides[founderSlide].quote}”</h2>
              <p className="founder-note">{founderSlides[founderSlide].note}</p>
              <div className="founder-attribution">
                <span className="attribution-rule" />
                <div><strong>Founder & Managing Director</strong><span>Maha Constructions</span></div>
              </div>
              <div className="founder-controls" aria-label="Founder story controls">
                <span>0{founderSlide + 1} <i /> 0{founderSlides.length}</span>
                <button type="button" aria-label="Previous founder note" onClick={() => moveFounderSlide(-1)}><ArrowLeft size={17} aria-hidden="true" /></button>
                <button type="button" aria-label="Next founder note" onClick={() => moveFounderSlide(1)}><ArrowRight size={17} aria-hidden="true" /></button>
              </div>
            </div>
          </div>
        </section>

        <section className="story-section" id="about-story" aria-labelledby="story-title">
          <div className="story-ornament" aria-hidden="true"><span>MC</span></div>
          <div className="section-meta" data-about-reveal><span>03 / OUR STORY</span><span>FROM THE BEGINNING TO TODAY</span></div>
          <div className="story-layout">
            <div className="story-heading about-story-heading" data-about-reveal>
              <span className="eyebrow">Our story</span>
              <h2 id="story-title">A JOURNEY<br />BUILT OVER<br />DECADES.</h2>
              <p data-about-word-reveal>Two decades of craftsmanship, local roots, and lasting trust across Chennai.</p>
              <span className="story-footnote">ESTABLISHED IN CHENNAI</span>
            </div>
            <div className="story-timeline">
              <div className="timeline-rail" aria-hidden="true" />
              {milestones.map((milestone, index) => (
                <article className="timeline-entry" key={milestone.date} data-about-reveal>
                  <span className="timeline-point" aria-hidden="true" />
                  <div className="timeline-date"><span>0{index + 1}</span>{milestone.date} · {milestone.title}</div>
                  <p>{milestone.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="numbers-section" aria-labelledby="numbers-title">
          <div className="section-meta" data-about-reveal><span>04 / BY THE NUMBERS</span></div>
          <div className="numbers-heading" data-about-reveal>
            <h2 id="numbers-title">Experience you can see.<br /><em>Trust you can measure.</em></h2>
            <p>A record of craftsmanship and trust across Chennai.</p>
          </div>
          <div className="metrics-grid">
            {metrics.map((metric, index) => (
              <div className="metric" key={metric.label} data-about-reveal>
                <div className="metric-header">
                  <span className="metric-index">0{index + 1}</span>
                  {metric.tag && <span className="metric-tag">{metric.tag}</span>}
                </div>
                <strong className="metric-value">
                  <span className="metric-num">{metric.num}</span>
                  <span className="metric-suffix">{metric.suffix}</span>
                </strong>
                <span className="metric-label">{metric.label}</span>
                <span className="metric-note">{metric.note}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="why-section" aria-labelledby="why-title">
          <div className="section-meta" data-about-reveal><span>05 / WHY MAHA CONSTRUCTIONS</span><span>THE DIFFERENCE IS IN THE DETAIL</span></div>
          <div className="why-layout">
            <div className="why-visual" data-about-reveal>
              <img
                data-about-image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1500&q=86"
                alt="Contemporary residential architecture embodying thoughtful craftsmanship"
                loading="lazy"
              />
              <span className="visual-caption"><span>ARCHITECTURAL INTEGRITY</span><span>HOMES DESIGNED TO ENDURE</span></span>
              <span className="visual-figure" aria-hidden="true">A</span>
            </div>
            <div className="why-copy">
              <span className="eyebrow" data-about-reveal>Built on more than a blueprint</span>
              <h2 id="why-title" data-about-reveal>WHY MAHA<br />CONSTRUCTIONS?</h2>
              <p className="why-intro" data-about-reveal>Deliberate choices, superior materials, and transparent commitments.</p>
              <div className="why-accordion">
                {reasons.map((reason, index) => (
                  <article className={`why-item${activeReason === index ? ' is-open' : ''}`} key={reason.title}>
                    <button
                      type="button"
                      aria-expanded={activeReason === index}
                      onClick={() => setActiveReason(activeReason === index ? -1 : index)}
                    >
                      <span>0{index + 1}</span><strong>{reason.title}</strong><ArrowUpRight size={17} aria-hidden="true" />
                    </button>
                    <div className="why-detail" aria-hidden={activeReason !== index}><p>{reason.copy}</p></div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="principles-section" aria-labelledby="principles-title">
          <div className="section-meta" data-about-reveal><span>06 / HOW WE BUILD MATTERS</span><span>THE PRINCIPLES BEHIND THE WORK</span></div>
          <div className="principles-heading" data-about-reveal>
            <span className="eyebrow">How we build matters</span>
            <h2 id="principles-title">WHAT GUIDES<br />THE WAY WE BUILD.</h2>
          </div>
          <div className="values-marquee" aria-label="Integrity, quality, responsibility and relationships">
            <div className="values-track" ref={tickerRef}>
              {[0, 1].map((copy) => (
                <div className="values-set" key={copy} aria-hidden={copy === 1}>
                  {tickerSequence.map((word, index) => (
                    <span key={`${copy}-${index}`}>
                      {word}
                      <i aria-hidden="true">·</i>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="principles-grid">
            {principles.map((principle) => (
              <article className="principle" key={principle.number} data-about-reveal>
                <span className="principle-number">{principle.number}</span>
                <h3>{principle.title}</h3>
                <p>{principle.copy}</p>
                <span className="principle-line" aria-hidden="true" />
              </article>
            ))}
          </div>
        </section>

        <section className="about-closing" aria-labelledby="closing-title">
          <div className="closing-drafting" aria-hidden="true"><span>M</span><i /></div>
          <div className="closing-content" data-about-reveal>
            <span className="eyebrow">A future built together</span>
            <h2 id="closing-title">MORE THAN<br />BUILDINGS.<br /><em>WE BUILD WHAT LASTS.</em></h2>
            <p>Every project can become part of something lasting. Start a conversation with Maha Constructions about what comes next.</p>
            <div className="closing-actions">
              <a className="button button-light" href={sitePath('/projects')}>Explore our projects <ArrowUpRight size={16} aria-hidden="true" /></a>
              <a className="button button-outline-light" href={sitePath('/contact')}>Talk to us <ArrowUpRight size={16} aria-hidden="true" /></a>
            </div>
          </div>
          <span className="closing-coordinate" aria-hidden="true">13°04′ N<br />80°16′ E</span>
        </section>
      </main>

      <Footer backToTopTarget="#about-title" className="about-footer" />
    </div>
  );
}

function CompanyAboutPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const tickerRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    const previousTitle = document.title;
    document.title = 'About Us | Maha Constructions';
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) return undefined;
    const context = gsap.context(() => {
      gsap.utils.toArray('[data-company-reveal]').forEach((element) => {
        gsap.fromTo(element, { autoAlpha: 0, y: 28 }, {
          autoAlpha: 1, y: 0, duration: 0.75, ease: 'power2.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        });
      });

      if (tickerRef.current) {
        gsap.to(tickerRef.current, {
          xPercent: -50,
          duration: 120,
          ease: 'none',
          repeat: -1,
        });
      }
    });
    return () => context.revert();
  }, []);

  const closeMenu = () => setMenuOpen(false);
  return (
    <div className="about-page company-about-page">
      <header className={`site-header projects-header${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' menu-open' : ''}`}>
        <a className="wordmark" href={sitePath('/')} aria-label="Maha Constructions home" onClick={closeMenu}><img src={sitePath('/images/maha-constructions-logo.png')} alt="Maha Constructions" /></a>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
        <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          <a href={sitePath('/')} onClick={closeMenu}>Home</a>
          <a href={sitePath('/about-2')} aria-current="page" onClick={closeMenu}>About Us</a>
          <a href={sitePath('/projects')} onClick={closeMenu}>Projects</a>
          <a href={sitePath('/joint-venture')} onClick={closeMenu}>Joint Venture</a>
          <a href={sitePath('/gallery')} onClick={closeMenu}>Gallery</a>
          <a href={sitePath('/contact')} onClick={closeMenu}>Contact</a>
          <a className="nav-enquiry" href={sitePath('/contact#contact-form')} onClick={closeMenu}>Enquire <ArrowUpRight size={14} aria-hidden="true" /></a>
        </nav>
      </header>
      <main className="company-about-main">
        <section className="projects-page-hero section-shell" aria-labelledby="company-about-title">
          <div className="projects-page-hero-copy" data-company-reveal>
            <span className="eyebrow">About us</span>
            <h1 id="company-about-title">Building with purpose.</h1>
            <p>
              Growing with trust — three decades of craftsmanship and relationships built to last.
            </p>
          </div>
        </section>

        <section className="company-intro section-shell" id="company-founder">
          <div className="company-intro-aside" data-company-reveal><span className="eyebrow">A word from the founder</span><span className="company-aside-rule"/><span className="company-aside-note">LEADERSHIP · PERSPECTIVE</span></div>
          <div className="company-founder-copy" data-company-reveal>
            <h2>“{founderSlides[0].quote}”</h2>
            <p>{founderSlides[0].note}</p>
            <div className="company-attribution"><span/><div><strong>Founder & Managing Director</strong><small>Maha Constructions</small></div></div>
          </div>
          <div className="company-portrait" data-company-reveal aria-label="Leadership and craftsmanship"><div className="company-portrait-shape"/><span>LEADERSHIP & VISION<br/>MAHA CONSTRUCTIONS</span></div>
        </section>

        <div className="values-marquee values-marquee-dark" aria-label="Integrity, quality, responsibility and relationships">
          <div className="values-track" ref={tickerRef}>
            {[0, 1].map((copy) => (
              <div className="values-set" key={copy} aria-hidden={copy === 1}>
                {tickerSequence.map((word, index) => (
                  <span key={`${copy}-${index}`}>
                    {word}
                    <i aria-hidden="true">·</i>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <section className="company-story" id="company-story">
          <div className="section-meta" data-company-reveal><span>OUR STORY</span><span>FROM THE BEGINNING TO TODAY</span></div>
          <div className="company-story-head" data-company-reveal><span className="eyebrow">Grounded in purpose</span><h2>A journey built<br/>over decades.</h2><p>Two decades of craftsmanship, local roots, and lasting trust across Chennai.</p></div>
          <div className="company-timeline">
            {milestones.map((item) => <article className="company-milestone" key={item.date} data-company-reveal><span className="company-milestone-dot"/><small>{item.date}</small><h3>{item.title}</h3><p>{item.copy}</p></article>)}
          </div>
        </section>

        <section className="numbers-section" aria-labelledby="company-numbers-title">
          <div className="section-meta" data-company-reveal><span>04 / BY THE NUMBERS</span></div>
          <div className="numbers-heading" data-company-reveal>
            <h2 id="company-numbers-title">Experience you can see.<br /><em>Trust you can measure.</em></h2>
            <p>A record of craftsmanship and trust across Chennai.</p>
          </div>
          <div className="metrics-grid">
            {metrics.map((metric, index) => (
              <div className="metric" key={metric.label} data-company-reveal>
                <div className="metric-header">
                  <span className="metric-index">0{index + 1}</span>
                  {metric.tag && <span className="metric-tag">{metric.tag}</span>}
                </div>
                <strong className="metric-value">
                  <span className="metric-num">{metric.num}</span>
                  <span className="metric-suffix">{metric.suffix}</span>
                </strong>
                <span className="metric-label">{metric.label}</span>
                <span className="metric-note">{metric.note}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="company-why">
          <div className="company-why-copy" data-company-reveal><span className="eyebrow">What guides our work</span><h2>Why Maha<br/>Constructions?</h2><p>Deliberate choices, superior materials, and transparent commitments.</p><div className="company-reasons">{reasons.map((reason, index) => <article key={reason.title}><span>0{index + 1}</span><div><h3>{reason.title}</h3><p>{reason.copy}</p></div></article>)}</div></div>
          <div className="company-values-visual" data-company-reveal aria-label="Abstract architectural drawing evoking considered company values"><span className="values-monogram">M<span>C</span></span><i/><b/><small>BUILT ON PURPOSE<br/>GROUNDED IN TRUST</small></div>
        </section>

        <section className="company-principles section-shell">
          <div className="company-principles-heading" data-company-reveal><span className="eyebrow">How we build matters</span><h2>The principles<br/>behind the work.</h2></div>
          <div className="company-principles-grid">{principles.map((principle) => <article key={principle.number} data-company-reveal><span>{principle.number}</span><h3>{principle.title}</h3><p>{principle.copy}</p></article>)}</div>
        </section>

        <section className="about-closing" aria-labelledby="company-closing-title">
          <div className="closing-drafting" aria-hidden="true"><span>M</span><i /></div>
          <div className="closing-content" data-company-reveal>
            <span className="eyebrow">A future built together</span>
            <h2 id="company-closing-title">MORE THAN<br />BUILDINGS.<br /><em>WE BUILD WHAT LASTS.</em></h2>
            <p>Every project can become part of something lasting. Start a conversation with Maha Constructions about what comes next.</p>
            <div className="closing-actions">
              <a className="button button-light" href={sitePath('/projects')}>Explore our projects <ArrowUpRight size={16} aria-hidden="true" /></a>
              <a className="button button-outline-light" href={sitePath('/contact')}>Talk to us <ArrowUpRight size={16} aria-hidden="true" /></a>
            </div>
          </div>
          <span className="closing-coordinate" aria-hidden="true">13°04′ N<br />80°16′ E</span>
        </section>
      </main>
      <Footer backToTopTarget="#company-about-title" className="about-footer company-footer" />
    </div>
  );
}

export default AboutPage;
