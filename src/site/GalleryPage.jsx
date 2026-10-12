import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  ArrowUpRight, 
  ArrowsOut, 
  CaretLeft, 
  CaretRight, 
  CheckCircle, 
  Compass, 
  Eye, 
  GridFour, 
  Image as ImageIcon, 
  List as Menu, 
  MagnifyingGlassPlus, 
  Play, 
  SlidersHorizontal, 
  Sparkle, 
  VideoCamera, 
  X 
} from '@phosphor-icons/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sitePath } from './paths.js';
import Footer from './Footer.jsx';

gsap.registerPlugin(ScrollTrigger);

// Curated gallery archive entries with Bhoomi Pooja milestone photos and approved architecture
const galleryItemsData = [
  // --- BHOOMI POOJA AUTHENTIC CEREMONIAL PHOTOGRAPHY ---
  { 
    id: 'bp-1', 
    title: 'Bhoomi Pooja', 
    subtitle: 'Ceremonial Homam & Project Inception',
    category: 'Milestones', 
    image: '/images/gallery/bhoomi-pooja-3.jpg',
    mediaType: 'photos',
    tag: 'Auspicious Start',
    aspect: '16/9',
    description: 'Traditional Bhoomi Pooja prayers and sacred homam performed with landowners, elders, and the Maha Constructions leadership team to invoke divine blessings for the new build.',
    spec: 'Chennai Project Site'
  },
  { 
    id: 'bp-2', 
    title: 'Bhoomi Pooja', 
    subtitle: 'Laying the Sacred Foundation Brick',
    category: 'Milestones', 
    image: '/images/gallery/bhoomi-pooja-4.jpg',
    mediaType: 'photos',
    tag: 'Foundation Stone',
    aspect: '4/3',
    description: 'Ceremonial placement of the sanctified first brick into the foundation trench by the landowners and engineers, marking the structural inception.',
    spec: 'Chennai Project Site'
  },
  { 
    id: 'bp-3', 
    title: 'Bhoomi Pooja', 
    subtitle: 'Consecration of Sacred Earth & Bricks',
    category: 'Milestones', 
    image: '/images/gallery/bhoomi-pooja-1.jpg',
    mediaType: 'photos',
    tag: 'Sacred Ritual',
    aspect: '4/3',
    description: 'Sanctified bricks adorned with fresh blooms, turmeric, and sacred offerings placed into the earth during the traditional Vaasthu rituals.',
    spec: 'Chennai Project Site'
  },
  { 
    id: 'bp-4', 
    title: 'Bhoomi Pooja', 
    subtitle: 'Family & Project Team Blessings',
    category: 'Milestones', 
    image: '/images/gallery/bhoomi-pooja-2.jpg',
    mediaType: 'photos',
    tag: 'Community Moment',
    aspect: '4/3',
    description: 'Family elders, landowners, and the Maha Constructions engineering team coming together to celebrate the commencement of their dream home.',
    spec: 'Chennai Project Site'
  },

  // --- VIDEO ARCHIVE REELS ---
  { 
    id: 'vid-1', 
    title: 'Site Progress & Groundwork Drone Reel', 
    subtitle: 'Aerial Site Survey & Excavation',
    category: 'Architecture', 
    mediaType: 'videos',
    duration: '0:45',
    resolution: '4K UHD • 60 FPS',
    tag: 'Site Aerial',
    aspect: '16/9',
    description: 'High-definition drone overview showing initial boundary demarcation, soil testing, and excavation layout.',
    spec: 'Chennai Project Site'
  },
  { 
    id: 'vid-2', 
    title: 'RCC Foundation Pouring & Compaction', 
    subtitle: 'Structural Concrete Pouring',
    category: 'Craftsmanship', 
    mediaType: 'videos',
    duration: '1:12',
    resolution: '4K UHD • 60 FPS',
    tag: 'Structural Base',
    aspect: '4/3',
    description: 'Machine-mixed M25 grade concrete poured into foundation trenches with mechanical needle vibrator compaction.',
    spec: 'Secretariat Colony Site'
  },
  { 
    id: 'vid-3', 
    title: 'Structural Column Alignment & Inspection', 
    subtitle: 'Precision Level Checking',
    category: 'Craftsmanship', 
    mediaType: 'videos',
    duration: '0:58',
    resolution: '4K UHD • 60 FPS',
    tag: 'Quality Audit',
    aspect: '16/9',
    description: 'Laser-guided plumbing and alignment checks on vertical RCC columns prior to curing and slab shuttering.',
    spec: 'Quality Audit Verification'
  },
  { 
    id: 'vid-4', 
    title: 'Natural Ventilation & Lighting Walkthrough', 
    subtitle: 'Interior Spatial Flow',
    category: 'Interiors', 
    mediaType: 'videos',
    duration: '1:34',
    resolution: '4K UHD • 60 FPS',
    tag: 'Interior Spatial',
    aspect: '16/9',
    description: 'Exploring morning daylight dispersion and breeze paths across open-plan living and kitchen zones.',
    spec: 'Phase II Residential'
  },
  { 
    id: 'vid-5', 
    title: 'Facade Elevation & Architectural Review', 
    subtitle: 'Exterior Craftsmanship',
    category: 'Architecture', 
    mediaType: 'videos',
    duration: '0:42',
    resolution: '4K UHD • 60 FPS',
    tag: 'Exterior Form',
    aspect: '16/9',
    description: 'Cinematic review of exterior textures, waterproofing drip-moulds, and architectural window reveals.',
    spec: 'Lakshmipuram • Chennai HQ'
  },
  { 
    id: 'vid-6', 
    title: 'Key Handover & Project Milestone Ceremony', 
    subtitle: 'Delivered Home Handover',
    category: 'Milestones', 
    mediaType: 'videos',
    duration: '1:48',
    resolution: '4K UHD • 60 FPS',
    tag: 'Handover Delivery',
    aspect: '16/9',
    description: 'Celebrating the joyous moment as proud homeowners receive their keys and move into their finished home.',
    spec: 'Maha Constructions Milestone'
  },
];

export default function GalleryPage() {
  const [galleryType, setGalleryType] = useState('photos'); // 'photos' | 'videos'
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [layoutMode, setLayoutMode] = useState('grid'); // 'grid' | 'bento'
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const pageRef = useRef(null);
  const gridContainerRef = useRef(null);
  const heroRef = useRef(null);

  const closeMenu = () => setMenuOpen(false);

  // Dynamic items and category pills based on active mediaType
  const mediaItems = galleryItemsData.filter((item) => item.mediaType === galleryType);
  const categoryList = ['All', ...Array.from(new Set(mediaItems.map((item) => item.category)))];

  const filteredItems = mediaItems.filter((item) => {
    return activeCategory === 'All' || item.category === activeCategory;
  });

  const selectedItem = selectedItemIndex !== null ? filteredItems[selectedItemIndex] : null;

  // Header scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    const previousTitle = document.title;
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.title = 'Gallery | Maha Constructions';
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.title = previousTitle;
    };
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (selectedItemIndex === null) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedItemIndex(null);
        setIsPlayingVideo(false);
        setZoomLevel(1);
      } else if (event.key === 'ArrowRight') {
        setSelectedItemIndex((prev) => (prev + 1) % filteredItems.length);
        setIsPlayingVideo(false);
        setZoomLevel(1);
      } else if (event.key === 'ArrowLeft') {
        setSelectedItemIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
        setIsPlayingVideo(false);
        setZoomLevel(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItemIndex, filteredItems.length]);

  // Initial GSAP Hero and Ambient Motion
  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      // Hero text reveal timeline
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl
        .fromTo('.gallery-eyebrow-pill',
          { autoAlpha: 0, y: -16, scale: 0.94 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.7 }
        )
        .fromTo('.gallery-heading-line',
          { yPercent: 110, rotate: 1 },
          { yPercent: 0, rotate: 0, duration: 1.05, stagger: 0.12, ease: 'power4.out' },
          '-=0.4'
        )
        .fromTo('.gallery-heading-desc',
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.8 },
          '-=0.6'
        )
        .fromTo('.gallery-stats-banner',
          { autoAlpha: 0, scale: 0.95, y: 15 },
          { autoAlpha: 1, scale: 1, y: 0, duration: 0.75, ease: 'back.out(1.5)' },
          '-=0.5'
        )
        .fromTo('.gallery-controls-bar',
          { autoAlpha: 0, y: 25 },
          { autoAlpha: 1, y: 0, duration: 0.7 },
          '-=0.4'
        );

      // Rotating architectural accents
      gsap.to('.gallery-geo-spinner', {
        rotation: 360,
        duration: 50,
        repeat: -1,
        ease: 'none',
      });

      gsap.to('.gallery-geo-counter-spin', {
        rotation: -360,
        duration: 70,
        repeat: -1,
        ease: 'none',
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  // Stagger animation on cards when galleryType or category changes
  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      gsap.fromTo('.gallery-card-item',
        { autoAlpha: 0, y: 35, scale: 0.95 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.06,
          ease: 'power3.out',
        }
      );
    }, gridContainerRef);

    return () => ctx.revert();
  }, [galleryType, activeCategory, layoutMode]);

  // 3D Magnetic Card Tilt effect on mouse move
  const handleCardMouseMove = (e, index) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / rect.height) * 8;
    const rotateY = (x / rect.width) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;

    // Move specular shine overlay
    const shine = card.querySelector('.card-specular-shine');
    if (shine) {
      const shineX = ((e.clientX - rect.left) / rect.width) * 100;
      const shineY = ((e.clientY - rect.top) / rect.height) * 100;
      shine.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.2) 0%, transparent 65%)`;
    }
  };

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    const shine = card.querySelector('.card-specular-shine');
    if (shine) {
      shine.style.background = 'none';
    }
  };

  return (
    <div className="gallery-page" ref={pageRef}>
      {/* Background Architectural Blueprint Motion Graphic */}
      <div className="gallery-motion-backdrop" aria-hidden="true">
        <svg className="blueprint-svg-lines" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="galleryArchGrid" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M 64 0 L 0 0 0 64" fill="none" stroke="rgba(23, 74, 42, 0.04)" strokeWidth="1" />
              <circle cx="64" cy="0" r="1.5" fill="rgba(120, 190, 32, 0.16)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#galleryArchGrid)" />
        </svg>

        {/* Floating Architectural Geometric Ring */}
        <div className="motion-geo-accent gallery-geo-spinner" style={{ top: '8%', right: '5%' }}>
          <svg width="240" height="240" viewBox="0 0 240 240" fill="none">
            <circle cx="120" cy="120" r="110" stroke="rgba(120, 190, 32, 0.14)" strokeWidth="1" strokeDasharray="5 7" />
            <circle cx="120" cy="120" r="80" stroke="rgba(23, 74, 42, 0.07)" strokeWidth="1" />
            <line x1="120" y1="0" x2="120" y2="240" stroke="rgba(23, 74, 42, 0.05)" strokeWidth="1" />
            <line x1="0" y1="120" x2="240" y2="120" stroke="rgba(23, 74, 42, 0.05)" strokeWidth="1" />
          </svg>
        </div>

        <div className="motion-geo-accent gallery-geo-counter-spin" style={{ bottom: '20%', left: '4%' }}>
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="90" stroke="rgba(23, 74, 42, 0.06)" strokeWidth="1" strokeDasharray="4 8" />
            <circle cx="100" cy="100" r="50" stroke="rgba(144, 173, 46, 0.12)" strokeWidth="1" />
            <circle cx="100" cy="100" r="3" fill="rgba(120, 190, 32, 0.22)" />
          </svg>
        </div>

        <div className="gallery-ambient-mesh" />
      </div>

      <header className={`site-header projects-header${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' menu-open' : ''}`}>
        <a className="wordmark" href={sitePath('/')} aria-label="Maha Constructions home">
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
          <a href={sitePath('/about-2')}>About Us</a>
          <a href={sitePath('/projects')}>Projects</a>
          <a href={sitePath('/joint-venture')}>Joint Venture</a>
          <a href={sitePath('/gallery')} aria-current="page">Gallery</a>
          <a href={sitePath('/contact')}>Contact</a>
          <a className="nav-enquiry" href={sitePath('/contact#contact-form')}>
            Enquire <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </nav>
      </header>

      <main className="gallery-main section-shell" ref={heroRef}>
        {/* Kinetic Hero Heading */}
        <div className="gallery-heading">
          <div className="gallery-eyebrow-pill">
            <span className="gallery-pulse-dot" aria-hidden="true" />
            <span className="eyebrow">Archival Portfolio</span>
          </div>

          <h1 id="gallery-title" className="gallery-title-masked">
            <span className="gallery-heading-line-wrap">
              <span className="gallery-heading-line">Moments that</span>
            </span>
            <span className="gallery-heading-line-wrap">
              <span className="gallery-heading-line">
                <em className="gradient-shimmer-text">make us.</em>
              </span>
            </span>
          </h1>

          <p className="gallery-heading-desc">
            A growing visual chronicle of on-site craft, Bhoomi Pooja milestones, and delivered residences across the Maha Constructions community.
          </p>

          {/* Interactive Live Metrics Bar */}
          <div className="gallery-stats-banner">
            <div className="gallery-stat-item">
              <span className="stat-number">16+</span>
              <span className="stat-label">Landmark Projects</span>
            </div>
            <div className="stat-separator" aria-hidden="true" />
            <div className="gallery-stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">On-Site Audits</span>
            </div>
            <div className="stat-separator" aria-hidden="true" />
            <div className="gallery-stat-item">
              <span className="stat-number">4K</span>
              <span className="stat-label">Media Records</span>
            </div>
          </div>

          {/* Controls Bar: Toggle & Categories & View Switcher */}
          <div className="gallery-controls-bar">
            {/* Primary Toggle: Photos vs Videos with Fluid Pill */}
            <div className="gallery-toggle-wrapper">
              <div className="gallery-toggle" role="group" aria-label="Choose gallery type">
                <button 
                  type="button" 
                  className={galleryType === 'photos' ? 'is-active' : ''} 
                  aria-pressed={galleryType === 'photos'} 
                  onClick={() => { 
                    setGalleryType('photos'); 
                    setActiveCategory('All');
                    setSelectedItemIndex(null); 
                  }}
                >
                  <ImageIcon size={16} weight={galleryType === 'photos' ? 'bold' : 'regular'} aria-hidden="true" />
                  <span>Photo gallery</span>
                </button>
                <button 
                  type="button" 
                  className={galleryType === 'videos' ? 'is-active' : ''} 
                  aria-pressed={galleryType === 'videos'} 
                  onClick={() => { 
                    setGalleryType('videos'); 
                    setActiveCategory('All');
                    setSelectedItemIndex(null); 
                  }}
                >
                  <VideoCamera size={16} weight={galleryType === 'videos' ? 'bold' : 'regular'} aria-hidden="true" />
                  <span>Video gallery</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="gallery-category-chips" role="group" aria-label="Filter by category">
              {categoryList.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`category-chip${activeCategory === cat ? ' is-active' : ''}`}
                  onClick={() => {
                    setActiveCategory(cat);
                    setSelectedItemIndex(null);
                  }}
                  aria-pressed={activeCategory === cat}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Layout Mode Switcher */}
            <div className="gallery-layout-toggle" title="Toggle Layout Grid">
              <button
                type="button"
                className={`layout-icon-btn${layoutMode === 'grid' ? ' is-active' : ''}`}
                onClick={() => setLayoutMode('grid')}
                aria-label="Standard grid view"
              >
                <GridFour size={17} weight={layoutMode === 'grid' ? 'bold' : 'regular'} />
              </button>
              <button
                type="button"
                className={`layout-icon-btn${layoutMode === 'bento' ? ' is-active' : ''}`}
                onClick={() => setLayoutMode('bento')}
                aria-label="Bento architectural layout"
              >
                <SlidersHorizontal size={17} weight={layoutMode === 'bento' ? 'bold' : 'regular'} />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Gallery Grid with 3D Tilt & Magnetic Physics */}
        <div 
          ref={gridContainerRef}
          className={`gallery-grid${layoutMode === 'bento' ? ' is-bento-layout' : ''}`} 
          aria-label={galleryType === 'photos' ? 'Photo gallery grid' : 'Video gallery grid'}
        >
          {filteredItems.map((item, index) => {
            const isVideo = galleryType === 'videos';
            return (
              <button 
                key={item.id}
                type="button"
                className={`gallery-card gallery-card-item${isVideo ? ' is-video-card' : ''}${layoutMode === 'bento' && (index === 0 || index === 4) ? ' bento-featured' : ''}`}
                aria-label={`View ${isVideo ? 'video' : 'photo'} ${item.title}`}
                onClick={() => {
                  setSelectedItemIndex(index);
                  setIsPlayingVideo(false);
                  setZoomLevel(1);
                }}
                onMouseMove={(e) => handleCardMouseMove(e, index)}
                onMouseLeave={handleCardMouseLeave}
              >
                {/* 3D Specular Light Overlay */}
                <div className="card-specular-shine" aria-hidden="true" />

                {/* Architectural Corner Crosshairs */}
                <span className="card-crosshair corner-tl" aria-hidden="true">+</span>
                <span className="card-crosshair corner-tr" aria-hidden="true">+</span>
                <span className="card-crosshair corner-bl" aria-hidden="true">+</span>
                <span className="card-crosshair corner-br" aria-hidden="true">+</span>

                {/* Card Artwork / Real Photo Canvas */}
                <div className="gallery-card-art">
                  {item.image ? (
                    <div className="card-photo-img-wrap">
                      <img 
                        src={sitePath(item.image)} 
                        alt={`${item.title} - ${item.subtitle || ''}`} 
                        className="card-real-photo" 
                        loading="lazy" 
                      />
                      <div className="card-photo-overlay" />
                    </div>
                  ) : (
                    /* Subtle Blueprint Linework Overlay for video/mockups */
                    <div className="card-arch-lines" aria-hidden="true" />
                  )}

                  {/* Corner Category Tag */}
                  <div className="card-badge-top">
                    <span className="card-tag-pill">{item.tag}</span>
                    <span className="card-aspect-pill">{item.category}</span>
                  </div>

                  {/* Center Visual Art & Interactive Elements */}
                  {isVideo ? (
                    <div className="video-card-center-action">
                      <div className="video-play-orb">
                        <Play size={22} weight="fill" aria-hidden="true" />
                        <span className="play-pulse-ring wave-1" />
                        <span className="play-pulse-ring wave-2" />
                      </div>

                      {/* Equalizer Audio Soundwave Animation on Hover */}
                      <div className="video-soundwave-anim" aria-hidden="true">
                        <span className="soundwave-bar bar-1" />
                        <span className="soundwave-bar bar-2" />
                        <span className="soundwave-bar bar-3" />
                        <span className="soundwave-bar bar-4" />
                        <span className="soundwave-bar bar-5" />
                      </div>

                      <div className="video-meta-badge">
                        <span className="video-time-tag">{item.duration}</span>
                        <span className="video-res-tag">{item.resolution}</span>
                      </div>
                    </div>
                  ) : (
                    !item.image && (
                      <div className="photo-card-center-action">
                        <div className="photo-inspect-circle">
                          <MagnifyingGlassPlus size={24} weight="bold" aria-hidden="true" />
                        </div>
                        <span className="gallery-placeholder-label">
                          Architectural Archive
                        </span>
                      </div>
                    )
                  )}

                  {/* Hover Inspect Banner */}
                  <div className="card-hover-scrim">
                    <span className="scrim-inspect-text">
                      <Eye size={15} weight="bold" aria-hidden="true" /> Click to Inspect
                    </span>
                  </div>
                </div>

                {/* Card Information Footer */}
                <div className="gallery-card-info">
                  <div className="info-top-row">
                    <span className="item-order-tag">0{index + 1}</span>
                    <span className="item-spec-tag">{item.spec}</span>
                  </div>
                  <h3 className="gallery-card-title">{item.title}</h3>
                  {item.subtitle && <p className="card-subtitle-line">{item.subtitle}</p>}
                  <p className="card-snippet-desc">{item.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* Cinematic Modal / Lightbox with Motion Graphics */}
      {selectedItem && (
        <div 
          className="gallery-lightbox cinematic-lightbox" 
          role="presentation" 
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedItemIndex(null);
              setIsPlayingVideo(false);
              setZoomLevel(1);
            }
          }}
        >
          <div 
            className="gallery-lightbox-panel cinematic-modal-panel" 
            role="dialog" 
            aria-modal="true" 
            aria-label={`${galleryType === 'photos' ? 'Photo' : 'Video'} viewer: ${selectedItem.title}`}
          >
            {/* Modal Header Bar */}
            <div className="lightbox-header-bar">
              <div className="lightbox-title-wrap">
                <span className="lightbox-category-pill">
                  {selectedItem.category} • {galleryType === 'photos' ? 'High-Res Photo' : '4K Footage'}
                </span>
                <span className="lightbox-counter-pill">
                  {selectedItemIndex + 1} / {filteredItems.length}
                </span>
              </div>

              <div className="lightbox-actions-group">
                {galleryType === 'photos' && (
                  <button 
                    type="button" 
                    className="lightbox-tool-btn" 
                    title={zoomLevel === 1 ? 'Zoom in' : 'Reset zoom'}
                    onClick={() => setZoomLevel((z) => (z === 1 ? 1.35 : 1))}
                  >
                    <MagnifyingGlassPlus size={18} weight="bold" />
                    <span>{zoomLevel === 1 ? 'Zoom In' : 'Reset Zoom'}</span>
                  </button>
                )}

                <button 
                  type="button" 
                  className="gallery-lightbox-close" 
                  aria-label="Close viewer" 
                  onClick={() => {
                    setSelectedItemIndex(null);
                    setIsPlayingVideo(false);
                    setZoomLevel(1);
                  }}
                >
                  <X size={22} weight="bold" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Modal Media Stage */}
            <div className="lightbox-media-stage">
              {galleryType === 'videos' ? (
                <div className="cinema-player-wrapper">
                  <div className="cinema-screen-placeholder">
                    {isPlayingVideo ? (
                      <div className="simulated-stream-view">
                        <div className="live-stream-overlay">
                          <span className="rec-dot" />
                          <span>4K UHD MASTER • 60 FPS • SITE FOOTAGE</span>
                        </div>
                        <div className="stream-center-badge">
                          <VideoCamera size={44} weight="duotone" />
                          <p>Streaming Architectural Footage</p>
                          <small>{selectedItem.spec}</small>
                        </div>
                        {/* Audio Wave Visualizer inside player */}
                        <div className="player-waveform-bar" aria-hidden="true">
                          {Array.from({ length: 28 }).map((_, i) => (
                            <span 
                              key={i} 
                              className="stream-wave-stick" 
                              style={{ animationDelay: `${(i % 7) * 0.12}s` }} 
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="player-thumbnail-view">
                        <div className="player-blueprint-mesh" />
                        <button 
                          type="button" 
                          className="cinema-play-button"
                          onClick={() => setIsPlayingVideo(true)}
                          aria-label="Play video preview"
                        >
                          <Play size={32} weight="fill" />
                          <span className="play-pulse-ring wave-1" />
                        </button>
                        <span className="player-start-label">Click to Play 4K Preview</span>
                      </div>
                    )}
                  </div>

                  {/* Interactive Mock Video Player Control Bar */}
                  <div className="cinema-controls-bar">
                    <button 
                      type="button" 
                      className="cinema-play-toggle-btn"
                      onClick={() => setIsPlayingVideo((playing) => !playing)}
                      aria-label={isPlayingVideo ? 'Pause' : 'Play'}
                    >
                      <Play size={16} weight="fill" />
                    </button>

                    <div className="cinema-scrubber-track">
                      <div 
                        className={`cinema-scrubber-fill${isPlayingVideo ? ' is-scrubbing' : ''}`} 
                      />
                    </div>

                    <div className="cinema-time-tags">
                      <span>{isPlayingVideo ? '00:24' : '00:00'}</span>
                      <span>/</span>
                      <span>{selectedItem.duration}</span>
                    </div>

                    <span className="cinema-quality-chip">4K HDR</span>
                  </div>
                </div>
              ) : (
                <div className="cinema-photo-wrapper">
                  {selectedItem.image ? (
                    <div className="lightbox-photo-stage">
                      <img 
                        src={sitePath(selectedItem.image)} 
                        alt={`${selectedItem.title} - ${selectedItem.subtitle || ''}`} 
                        className="lightbox-actual-image"
                        style={{ 
                          transform: `scale(${zoomLevel})`, 
                          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' 
                        }}
                      />
                    </div>
                  ) : (
                    <div className="photo-blueprint-art" style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.3s ease' }}>
                      <div className="photo-blueprint-lines" />
                      <div className="photo-center-compass">
                        <Compass size={56} weight="duotone" />
                        <h4>{selectedItem.title}</h4>
                        <p>{selectedItem.spec}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Prev / Next Modal Arrows */}
              <button 
                type="button" 
                className="lightbox-nav-btn nav-prev" 
                aria-label="Previous item" 
                onClick={() => {
                  setSelectedItemIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
                  setIsPlayingVideo(false);
                  setZoomLevel(1);
                }}
              >
                <CaretLeft size={24} weight="bold" />
              </button>

              <button 
                type="button" 
                className="lightbox-nav-btn nav-next" 
                aria-label="Next item" 
                onClick={() => {
                  setSelectedItemIndex((prev) => (prev + 1) % filteredItems.length);
                  setIsPlayingVideo(false);
                  setZoomLevel(1);
                }}
              >
                <CaretRight size={24} weight="bold" />
              </button>
            </div>

            {/* Modal Info Footer */}
            <div className="lightbox-details-footer">
              <div className="lightbox-desc-block">
                <h3>{selectedItem.title}</h3>
                {selectedItem.subtitle && <h4 className="lightbox-subtitle">{selectedItem.subtitle}</h4>}
                <p>{selectedItem.description}</p>
              </div>

              <div className="lightbox-spec-matrix">
                <div className="spec-item">
                  <span className="spec-label">Ceremony / Site</span>
                  <span className="spec-value">{selectedItem.spec}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Category</span>
                  <span className="spec-value">{selectedItem.category}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Classification</span>
                  <span className="spec-value">{selectedItem.tag}</span>
                </div>
              </div>

              <div className="lightbox-keyboard-hint">
                <span>Navigate: <strong>←</strong> / <strong>→</strong></span>
                <span>•</span>
                <span>Close: <strong>ESC</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shared Site-wide Footer */}
      <Footer />
    </div>
  );
}
