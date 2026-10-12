import { useEffect, useState } from 'react';
import {
  ArrowUp,
  ArrowUpRight,
  Clock,
  EnvelopeSimple,
  MapPin,
  Phone,
  ShieldCheck,
  WhatsappLogo,
} from '@phosphor-icons/react';
import { sitePath } from './paths.js';

export default function Footer({ backToTopTarget = '#top', className = '' }) {
  const [chennaiTime, setChennaiTime] = useState('');
  const [isOfficeOpen, setIsOfficeOpen] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const istString = now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        const istHour = parseInt(
          now.toLocaleTimeString('en-US', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            hour12: false,
          }),
          10
        );
        setChennaiTime(istString);
        setIsOfficeOpen(istHour >= 9 && istHour < 19);
      } catch {
        setChennaiTime('10:00 AM');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = (e) => {
    e.preventDefault();
    if (backToTopTarget && backToTopTarget !== '#top') {
      const targetEl = document.querySelector(backToTopTarget);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`footer ${className}`.trim()}>
      <div className="footer-main">
        {/* Column 1: Brand */}
        <div className="footer-brand">
          <a
            className="footer-logo-link"
            href={sitePath('/')}
            aria-label="Maha Constructions home"
          >
            <img
              src={sitePath('/images/maha-constructions-logo-white.png')}
              alt="Maha Constructions"
              className="footer-logo-img"
            />
          </a>
          <p>
            Building spaces.
            <br />
            Creating possibilities.
          </p>
        </div>

        {/* Column 2: Explore */}
        <div className="footer-links footer-explore-links">
          <span className="footer-label">Explore</span>
          <a href={sitePath('/about-2')}>About Us</a>
          <a href={sitePath('/projects')}>Projects</a>
          <a href={sitePath('/joint-venture')}>Joint Venture</a>
          <a href={sitePath('/gallery')}>Gallery</a>
        </div>

        {/* Column 3: Get In Touch */}
        <div className="footer-links footer-contact-links">
          <span className="footer-label">Get in touch</span>
          <a href="tel:+919094044052" className="footer-contact-item">
            <Phone size={15} aria-hidden="true" />
            <span>+91 90940 44052</span>
          </a>
          <a href="mailto:saimaha1000@gmail.com" className="footer-contact-item">
            <EnvelopeSimple size={15} aria-hidden="true" />
            <span>saimaha1000@gmail.com</span>
          </a>
          <a
            href="https://share.google/sFic984O7ZStGxeze"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-contact-item"
          >
            <MapPin size={15} aria-hidden="true" />
            <span>
              Lakshmipuram, Kolathur, Chennai{' '}
              <ArrowUpRight size={13} aria-hidden="true" />
            </span>
          </a>
        </div>

        {/* Column 4: Connect */}
        <div className="footer-links footer-connect-links">
          <span className="footer-label">Connect</span>
          <a
            href="https://wa.me/919094044052?text=Hello%20Maha%20Constructions,%20I%20would%20like%20to%20discuss%20a%20project"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-contact-item"
          >
            <WhatsappLogo size={15} aria-hidden="true" />
            <span>
              Chat on WhatsApp <ArrowUpRight size={13} aria-hidden="true" />
            </span>
          </a>
          <a href={sitePath('/contact#contact-form')} className="footer-contact-item">
            <EnvelopeSimple size={15} aria-hidden="true" />
            <span>
              Start an enquiry <ArrowUpRight size={13} aria-hidden="true" />
            </span>
          </a>
          <a href={sitePath('/joint-venture')} className="footer-contact-item">
            <ArrowUpRight size={15} aria-hidden="true" />
            <span>Joint Venture partnership</span>
          </a>
          <span className="footer-contact-item footer-timing">
            <Clock size={15} aria-hidden="true" />
            <span>Mon – Sat · 9 AM – 7 PM</span>
          </span>
        </div>
      </div>

      {/* Sub-Footer */}
      <div className="footer-bottom">
        <span className="footer-copyright">
          © {new Date().getFullYear()} Maha Constructions. All rights reserved.
        </span>

        <span className="footer-live-time">
          <Clock size={15} className="clock-icon" aria-hidden="true" />
          Chennai, India · {chennaiTime || '10:00 AM'} IST
          <span className={`status-pill ${isOfficeOpen ? 'is-open' : ''}`}>
            <span className="status-dot" />{' '}
            {isOfficeOpen ? 'Office Open' : 'Available Online'}
          </span>
        </span>

        <span className="footer-compliance">
          <ShieldCheck size={15} aria-hidden="true" />
          <span>CMDA & RERA Compliant</span>
        </span>

        <a
          href={backToTopTarget}
          onClick={scrollToTop}
          className="back-to-top"
          aria-label="Scroll back to top of page"
        >
          Back to top <ArrowUp size={14} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
