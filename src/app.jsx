import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence, MotionConfig, useScroll, useTransform, useSpring, useReducedMotion, useMotionValueEvent, useAnimationFrame, useInView } from 'framer-motion';
import { ArrowUpRight, ArrowDown, ArrowRight, Play, X, Menu, Mail, Phone, MapPin, Instagram, Youtube, Download, Pause, Search, Plus, Minus, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import archive from './data/projects.json';
import brands from './data/brands.json';
import './styles.css';

const MotionContext = createContext(true);
const EASE = [0.22, 1, 0.36, 1];
const categories = ['All', 'Handloom', 'Fair Trade', 'Couture'];
const featured = ['The Heritage Weave Revival', 'Sustainable Artisan Collective', 'Conscious Couture Edit'].map(key => archive.find(p => p.media === key || p.title === key)).filter(Boolean);
const experiences = [
  { date: 'PILLAR 01', title: 'The Heritage Weave Revival', place: 'Traditional Handloom & Natural Dyes', text: 'Restoring near-extinct traditional handloom motifs and authentic natural dye techniques in direct partnership with rural master weavers.' },
  { date: 'PILLAR 02', title: 'Sustainable Artisan Collective', place: 'Direct-to-Consumer Fair-Trade Supply Chain', text: 'Building a direct-to-consumer fair-trade supply chain that connects generational Indian weavers directly with a global luxury clientele.' },
  { date: 'PILLAR 03', title: 'Conscious Couture Edit', place: 'Bespoke Handmade Sarees & Zari Craft', text: 'Curating bespoke capsule collections of pure handmade sarees featuring intricate traditional zari work and modern minimalist aesthetics.' },
];
const certificates = [
  { title: 'The Heritage Weave Revival', year: 'Handloom', image: './Asset/img/work-heritage-weave.jpg' },
  { title: 'Sustainable Artisan Collective', year: 'Fair Trade', image: './Asset/img/work-artisan-collective.jpg' },
  { title: 'Conscious Couture Edit', year: 'Couture', image: './Asset/img/work-conscious-couture.jpg' },
  { title: 'Tejas Archival Portrait', year: 'India', image: '/assets/aistudio/tejas_9dfcacd2.webp' },
];
const awards = [
  {year:'01',title:'The Heritage Weave Revival',event:'Restoring near-extinct traditional handloom motifs & natural dyes'},
  {year:'02',title:'Sustainable Artisan Collective',event:'Direct-to-consumer fair-trade supply chain for generational weavers'},
  {year:'03',title:'Conscious Couture Edit',event:'Bespoke pure handmade sarees with traditional zari & minimalist form'},
  {year:'04',title:'Rural Master Weaver Partnerships',event:'Direct grassroots collaboration across Indian weaving clusters'},
  {year:'05',title:'Authentic Natural Dye Preservation',event:'Botanical & mineral dye restoration for heirloom textiles'},
  {year:'06',title:'Intricate Traditional Zari Work',event:'Preserving heritage metallic threadwork in contemporary silhouettes'},
];

function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const enabled = useContext(MotionContext);
  const Component = motion[as];
  return <Component className={className} initial={enabled ? { opacity: 0, y: 32 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.12 }} transition={{ duration: enabled ? 0.75 : 0, delay, ease: EASE }}>{children}</Component>;
}

function MediaImage({ src, alt, className = '', priority = false, ...props }) {
  const [state, setState] = useState('loading');
  const imgRef = useRef(null);
  useEffect(() => {
    const img = imgRef.current;
    // Cached images can finish before React attaches onLoad.
    setState(img?.complete ? (img.naturalWidth ? 'loaded' : 'error') : 'loading');
  }, [src]);
  return <span className={`media-image ${state} ${className}`}>
    {state === 'error' && <span className="image-fallback"><span className="display">T.</span><span>Preview unavailable</span></span>}
    <img ref={imgRef} src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} width="960" height="600" onLoad={() => setState('loaded')} onError={e => {
      if (e.currentTarget.src.includes('maxresdefault.jpg')) e.currentTarget.src = e.currentTarget.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
      else setState('error');
    }} {...props} />
  </span>;
}

function Magnetic({ children, className = '', ...props }) {
  const enabled = useContext(MotionContext);
  const x = useSpring(0, { stiffness: 220, damping: 20 });
  const y = useSpring(0, { stiffness: 220, damping: 20 });
  return <motion.a className={className} style={{ x, y }} onPointerMove={e => {
    if (!enabled || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.12); y.set((e.clientY - r.top - r.height / 2) * 0.2);
  }} onPointerLeave={() => { x.set(0); y.set(0); }} {...props}>{children}</motion.a>;
}

function Header({ enabled, onToggle }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }), { rootMargin: '-15% 0px -65% 0px' });
    document.querySelectorAll('main > section[id]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, []);
  return <header className="site-header">
    <a className="wordmark" href="#home" aria-label="Tejas, home">TEJAS<span>®</span></a>
    <nav className="desktop-nav" aria-label="Main navigation">{[['portfolio', 'Work'], ['awards', 'Pillars'], ['about', 'About'], ['experience', 'Initiatives'], ['contact', 'Contact']].map(([id, label]) => <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>{label}</a>)}</nav>
    <div className="header-actions"><button className="motion-toggle" onClick={onToggle} aria-label={enabled ? 'Pause animations' : 'Enable animations'} aria-pressed={!enabled}>{enabled ? <Pause size={13} /> : <Play size={13} />}<span>Motion {enabled ? 'on' : 'off'}</span></button><a className="header-contact" href="#contact">Let’s talk <ArrowUpRight size={16} /></a><button className="menu-toggle icon-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X /> : <Menu />}</button></div>
    <AnimatePresence>{open && <motion.nav id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>{[['home', 'Home'], ['portfolio', 'Work'], ['awards', 'Pillars'], ['about', 'About'], ['experience', 'Initiatives'], ['contact', 'Contact']].map(([id, label], i) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}><span>0{i + 1}</span>{label}<ArrowUpRight size={18} /></a>)}</motion.nav>}</AnimatePresence>
  </header>;
}

function Hero({ onProject }) {
  const ref = useRef(null);
  const enabled = useContext(MotionContext);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 85]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -55]);
  return <section id="home" className="hero" ref={ref}>
    <div className="hero-top"><span>TEXTILE REVIVALIST<br/><span className="muted">INDIAN HANDLOOM & COUTURE</span></span><span className="availability"><i />AVAILABLE FOR COLLABORATION</span></div>
    <motion.div className="hero-title display" aria-hidden="true" style={enabled ? { y: titleY } : {}} initial={enabled ? { clipPath: 'inset(0 0 100% 0)' } : false} animate={{ clipPath: 'inset(0 0 0% 0)' }} transition={{ duration: 1.4, ease: EASE }}>PORTFOLIO</motion.div>
    <motion.div className="hero-portrait" style={enabled ? { y: portraitY, scale: portraitScale } : {}} initial={enabled ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.2 }}><img src="./Asset/img/tejas-portrait.png" alt="Tejas wearing a dark handloom blazer under studio crimson rim lighting" width="1024" height="1536" fetchPriority="high" /></motion.div>
    <motion.div className="hero-intro" style={enabled ? { y: copyY } : {}} initial={enabled ? { opacity: 0, x: -35 } : false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.35, ease: EASE }}>
      <p className="handwriting">Hello, I’m</p><h1 className="display">TEJAS<span>.</span></h1><p className="hero-role">TEXTILE <br />REVIVALIST</p><p className="hero-description">Preserving heritage weaves. Empowering rural master artisans.<br />Restoring near-extinct Indian handloom motifs, authentic natural dyes, and conscious couture sarees.</p>
      <Magnetic href="#portfolio" className="primary-link">Explore my work <ArrowDown size={17}/></Magnetic>
      <span className="hero-location"><MapPin size={12} /> INDIA</span>
    </motion.div>
    <motion.div className="hero-side" initial={enabled ? { opacity: 0, x: 30 } : false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.55, ease: EASE }}>
      <div className="hero-manifesto"><span className="crosshair" aria-hidden="true">✳</span><p>Every thread.<br />A living heritage.</p></div>
      <div className="hero-stats"><div><span className="display">03</span><p>CORE REVIVAL<br/>INITIATIVES</p></div><div><span className="display">100<span>%</span></span><p>HANDLOOM &<br/>NATURAL DYES</p></div><div className="hero-award-stat"><span className="display">06</span><a href="#awards" aria-label="View Tejas craft pillars">CRAFT PILLARS<ArrowUpRight size={12}/></a></div><a href="https://wa.me/919654330794" target="_blank" rel="noopener noreferrer"><Phone size={16}/><span>WHATSAPP CONNECT</span></a></div>
    </motion.div>
    <div className="hero-bottom"><button className="reel-button" onClick={() => onProject(featured[0])}><span className="play-circle"><Play size={12} fill="currentColor" /></span>FEATURED WORK<span className="muted">HANDLOOM / COUTURE</span></button><span className="hero-scroll">SCROLL TO DISCOVER <ArrowDown size={13}/></span><span className="edition">SELECTED WORK / INDIA</span></div>
  </section>;
}

function ProjectCard({ project, index, onOpen }) {
  const enabled = useContext(MotionContext);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-12, 12]);
  const video = ['youtube', 'drive'].includes(project.type);
  return <motion.article ref={ref} className="project-card" layout initial={enabled ? { opacity: 0, y: 32 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.08 }} transition={{ duration: enabled ? 0.6 : 0, delay: (index % 3) * 0.06, ease: EASE }} exit={{ opacity: 0, scale: 0.96 }}>
    <button className="project-open" onClick={() => onOpen(project)} aria-label={`View ${project.title}`}><motion.div className="project-picture" style={enabled ? { y } : {}}><MediaImage src={project.image} alt={project.title}/></motion.div><span className="project-type">{project.type === 'render' ? '3D BREAKDOWN' : video ? 'FILM / VIDEO' : project.type === 'website' ? 'WEBSITE' : 'TEXTILE / ARCHIVE'}</span><span className="project-hover">{video ? <Play fill="currentColor" size={18}/> : <ArrowUpRight size={22}/>}</span><span className="project-frame" aria-hidden="true" /></button>
    <button className="project-caption" onClick={() => onOpen(project)}><span className="project-number display">{String(index + 1).padStart(2, '0')}</span><span><h3>{project.title}</h3><span className="project-category">{project.category}{project.year ? ` / ${project.year}` : ''}</span></span><ArrowUpRight size={20}/></button>
  </motion.article>;
}

function BrandStrip() {
  const enabled = useContext(MotionContext);
  const ref = useRef(null);
  const loopWidth = useRef(0);
  const inView = useInView(ref);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    if (!ref.current || showAll) return;
    const update = () => { loopWidth.current = ref.current?.querySelector('.brand-set')?.getBoundingClientRect().width || 0; };
    const observer = new ResizeObserver(update);
    observer.observe(ref.current); update();
    return () => observer.disconnect();
  }, [showAll]);
  useAnimationFrame((time, delta) => {
    if (!enabled || paused || interacting || !inView || showAll || !ref.current || !loopWidth.current) return;
    const el = ref.current;
    el.scrollLeft += Math.min(delta, 40) * 0.038;
    if (el.scrollLeft >= loopWidth.current) el.scrollLeft -= loopWidth.current;
  });
  const move = direction => { setPaused(true); ref.current?.scrollBy({ left: direction * ref.current.clientWidth * .7, behavior: enabled ? 'smooth' : 'instant' }); };
  return <Reveal className="brand-section"><div className="brand-heading"><p>ROOTED IN<br/><strong>INDIAN HERITAGE CRAFT.</strong></p><div><button className="brand-all" onClick={() => setShowAll(v => !v)} aria-expanded={showAll} aria-controls="brand-collection">{showAll ? 'SHOW RAIL' : `VIEW ALL (${brands.length})`}{showAll ? <Minus size={14}/> : <Plus size={14}/>}</button>{!showAll && <><button className="icon-button brand-pause" aria-label={paused ? 'Play craft rail' : 'Pause craft rail'} aria-pressed={paused} onClick={() => setPaused(v => !v)}>{paused ? <Play size={13}/> : <Pause size={13}/>}</button><button className="icon-button" onClick={() => move(-1)} aria-label="Previous item"><ChevronLeft size={17}/></button><button className="icon-button" onClick={() => move(1)} aria-label="Next item"><ChevronRight size={17}/></button></>}</div></div><div id="brand-collection" className={showAll ? 'brand-full-grid' : 'brand-viewport'} ref={ref} onPointerEnter={e => { if(e.pointerType==='mouse') setInteracting(true); }} onPointerLeave={() => setInteracting(false)} onPointerDown={() => setPaused(true)} onFocusCapture={() => setInteracting(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setInteracting(false); }} tabIndex={showAll ? undefined : 0} role={showAll ? 'list' : 'region'} aria-label="Craft disciplines and pillars, scroll to view all">
      {showAll ? brands.map(b => <div className="brand-logo" key={b.file} role="listitem"><img src={`./Asset/svg/brand/${b.file}`} alt={b.name} title={b.name} width="150" height="60" loading="lazy"/><span>{b.name}</span></div>) : <div className="brand-rail">{[0,1].map(copy => <div className="brand-set" key={copy} aria-hidden={copy === 1 ? true : undefined}>{brands.map(b => <div className="brand-logo" key={b.file}><img src={`./Asset/svg/brand/${b.file}`} alt={copy ? '' : b.name} title={b.name} width="150" height="60" loading="lazy" draggable="false"/></div>)}</div>)}</div>}
    </div></Reveal>;
}

function Portfolio({ onProject }) {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [limit, setLimit] = useState(9);
  const results = archive.filter(p => (category === 'All' || p.category === category) && `${p.title} ${p.category} ${p.role}`.toLowerCase().includes(query.toLowerCase()));
  const projects = expanded || category !== 'All' || query ? results.slice(0, limit) : featured;
  return <section id="portfolio" className="portfolio section-wrap">
    <Reveal className="section-heading"><div><span className="eyebrow">01 / SELECTED WORK</span><h2>WEAVES THAT SPEAK<span className="accent">.</span></h2></div><button className="text-link" onClick={() => { if (expanded) { setExpanded(false); setCategory('All'); setQuery(''); } else { setExpanded(true); setLimit(9); } }}>{expanded ? 'FEATURED WORK' : 'ALL WORK'}<ArrowRight size={21}/></button></Reveal>
    <Reveal className="portfolio-toolbar">
      <div className="filters" role="group" aria-label="Work categories">
        {categories.map(c => <button key={c} className={category === c ? 'selected' : ''} aria-pressed={category === c} onClick={() => { setCategory(c); setExpanded(true); setLimit(9); }}>{c}{c === category && <motion.span className="filter-line" layoutId="filter-line"/>}</button>)}
      </div>
      <label className="search-box"><Search size={15}/><span>Search</span><input aria-label="Search work" type="search" placeholder="Title or category…" value={query} onChange={e => { setQuery(e.target.value); setExpanded(true); setLimit(9); }}/></label>
    </Reveal>
    <motion.div className="project-grid" layout><AnimatePresence mode="popLayout">{projects.map((p, i) => <ProjectCard key={p.category + p.title + p.media} project={p} index={i} onOpen={onProject}/>)}</AnimatePresence></motion.div>
    {projects.length === 0 && <div className="empty-state"><p>No works found for “{query}”.</p><button className="text-link" onClick={() => { setQuery(''); setCategory('All'); }}>Reset search <X size={15}/></button></div>}
    {expanded && results.length > limit && <div className="load-more"><button className="outline-button" onClick={() => setLimit(v => v + 9)}>Load more works <Plus size={16}/></button><span>{projects.length} of {results.length} works</span></div>}
    <BrandStrip/>
  </section>;
}

const processSteps = [
  ['01', 'ARCHIVAL RESEARCH', 'Documenting near-extinct traditional handloom motifs and regional weaving lineages across rural India.'],
  ['02', 'NATURAL DYE ALCHEMY', 'Preparing authentic botanical and mineral dye vats in collaboration with master dyers.'],
  ['03', 'HANDLOOM WEAVING', 'Partnering directly with rural master weavers to restore complex warp-and-weft geometries.'],
  ['04', 'ZARI & COUTURE FINISH', 'Integrating intricate traditional zari work with modern minimalist silhouettes for pure handmade sarees.'],
  ['05', 'FAIR-TRADE DIRECT', 'Connecting generational Indian weavers directly with a global luxury clientele through transparent supply chains.'],
];
function Awards({onProject}) {
  const [expanded,setExpanded] = useState(false);
  const laurelPath = 'M48 94C8 68 9 30 35 5M22 61C8 60 3 49 3 44c12 0 19 6 19 17zm-5-19C5 35 6 23 8 19c11 5 13 14 9 23zm7-20C15 12 20 3 24 0c7 8 6 16 0 22zM31 79C17 79 8 70 7 64c13-2 22 4 24 15zm-3-18c-5-10-2-19 7-25 5 11 1 20-7 25zm10 24c-6-11-4-20 5-27 6 9 5 20-5 27z';
  return <section id="awards" className={`recognition section-wrap ${expanded ? 'awards-expanded' : ''}`}>
    <Reveal className="recognition-intro">
      <span className="eyebrow">CRAFT PILLARS & FOCUS</span>
      <h2 className="display">THE WEAVE.<br/><span className="accent">THE REVIVAL.</span></h2>
      <div className="award-total">
        <svg viewBox="0 0 60 100" aria-hidden="true"><path d={laurelPath} fill="currentColor"/></svg>
        <span className="display">03<span>+</span></span>
        <svg viewBox="0 0 60 100" aria-hidden="true"><g transform="translate(60 0) scale(-1 1)"><path d={laurelPath} fill="currentColor"/></g></svg>
        <span className="award-total-label">REVIVAL PILLARS</span>
      </div>
      <p>Restoring ancestral Indian handloom traditions.<br/>Connecting rural master weavers to global conscious luxury.</p>
      <button className="text-link award-proof" onClick={()=>onProject({...certificates[0],type:'image',media:certificates[0].image,category:'Handloom',description:'The Heritage Weave Revival — Restoring near-extinct traditional handloom motifs and authentic natural dye techniques in direct partnership with rural master weavers.'})}>VIEW HERITAGE ARCHIVE<ArrowUpRight size={18}/></button>
    </Reveal>
    <div className="recognition-list">
      <div className="recognition-list-head"><span>CORE REVIVAL FOCUS</span><span>INDIA</span></div>
      <ol id="recognition-list">{awards.map((award,i)=><Reveal as="li" className={`recognition-row ${i>2?'additional-award':''}`} key={award.year} delay={i*.045}>
        <span className="award-index">0{i+1}</span>
        <div><h3>{award.title}</h3><p>{award.event}</p></div>
        <span className="award-year display">{award.year}</span>
      </Reveal>)}</ol>
      <button className="award-expand" aria-expanded={expanded} aria-controls="recognition-list" onClick={()=>setExpanded(v=>!v)}>{expanded?'Show fewer pillars':'View all 6 craft pillars'}{expanded?<Minus size={16}/>:<Plus size={16}/>}</button>
    </div>
  </section>;
}
function Breakdown() {
  const scene = featured.find(p => p.type === 'render');
  const ref = useRef(null);
  const enabled = useContext(MotionContext);
  const [manual, setManual] = useState(false);
  const [cut, setCut] = useState(65);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  useMotionValueEvent(scrollYProgress, 'change', v => { if (!manual && enabled) setCut(Math.round(90 - v * 80)); });
  const titleX = useTransform(scrollYProgress, [0, 1], [30, -30]);
  if (!scene) return null;
  const resize = url => url.replace('/upload/', '/upload/c_scale,w_1200,q_auto,f_auto/');
  return <section className="breakdown section-wrap" ref={ref} aria-labelledby="breakdown-title"><Reveal className="breakdown-copy"><span className="eyebrow">A LOOK UNDER THE SURFACE</span><motion.h2 id="breakdown-title" className="display" style={enabled ? { x: titleX } : {}}>FROM RAW.<br/><span className="accent">TO REAL.</span></motion.h2><p>Satu scene. Berlapis proses.<br/>Lihat bagaimana sebuah 3D environment berubah dari bentuk dasar menjadi dunia yang hidup.</p><span className="breakdown-credit">CYBERPUNK ENVIRONMENT / 2025<br/>3D ARTIST · LIGHTING · RENDERING</span></Reveal><Reveal className="comparison"><div className="comparison-stage" style={{'--cut': `${enabled || manual ? cut : 50}%`}}><MediaImage src={resize(scene.renders[0].solid)} alt="Cyberpunk environment sebelum material dan pencahayaan"/><div className="comparison-final"><MediaImage src={resize(scene.renders[0].final)} alt="Cyberpunk environment hasil render akhir"/></div><span className="comparison-label raw-label">SOLID VIEW</span><span className="comparison-label final-label">FINAL RENDER</span><div className="comparison-divider"><span><ChevronLeft size={14}/><ChevronRight size={14}/></span></div><input aria-label="Perbandingan sebelum dan sesudah render" aria-valuetext={`${cut}% solid, ${100-cut}% final render`} type="range" min="0" max="100" value={cut} onChange={e => { setManual(true); setCut(Number(e.target.value)); }}/></div><div className="comparison-caption"><span>GESER UNTUK MELIHAT PROSESNYA</span><span>DRAG / SCROLL</span></div></Reveal></section>;
}
function About() {
  const enabled = useContext(MotionContext);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 75%'] });
  return <section id="about" className="about section-wrap" ref={ref}>
    <Reveal className="about-lead"><div><span className="eyebrow">02 / BEHIND THE LOOM</span><h2 className="display">MORE THAN FABRIC.<br/>A LIVING <span className="accent">HERITAGE.</span></h2></div><p>I’m Tejas, a textile revivalist from India. I work directly with rural master weavers to restore near-extinct handloom motifs, authentic natural dye techniques, and fair-trade luxury saree collections.</p></Reveal>
    <div className="studio-grid">
      <Reveal className="education-panel"><h3 className="panel-heading">DISCIPLINE & PRACTICE</h3><p className="eyebrow accent">FOCUS AREAS</p><div className="education-row"><strong>The Heritage Weave Revival</strong><span>Handloom</span><p>Restoring near-extinct traditional handloom motifs & authentic natural dye techniques with rural master weavers.</p></div><div className="education-row"><strong>Sustainable Artisan Collective</strong><span>Fair Trade</span><p>Direct-to-consumer fair-trade supply chain connecting generational Indian weavers with global luxury clientele.</p></div><div className="education-row"><strong>Conscious Couture Edit</strong><span>Couture</span><p>Bespoke capsule collections of pure handmade sarees featuring intricate traditional zari work & modern minimalism.</p></div><p className="eyebrow accent skills-heading">TEXTILE TOOLKIT</p><div className="skill-tags">{['Heritage Handloom', 'Natural Dyes', 'Traditional Zari Work', 'Fair-Trade Supply Chain', 'Motif Restoration', 'Artisan Partnerships', 'Bespoke Sarees', 'Conscious Couture'].map(s => <span key={s}>{s}</span>)}</div><div className="software-row">{[['loom', 'Handloom Weaving'], ['dye', 'Natural Dyeing'], ['zari', 'Traditional Zari'], ['motif', 'Archival Motifs'], ['weave', 'Fair-Trade Chain'], ['craft', 'Conscious Couture']].map(([file, name]) => <img key={file} src={`./Asset/svg/${file}.svg`} alt={name} title={name} loading="lazy" width="28" height="28"/>)}</div></Reveal>
      <div className="process-panel"><Reveal><h3 className="panel-heading">FROM THREAD TO HEIRLOOM</h3></Reveal><div className="process-list"><div className="process-track"><motion.div style={{ scaleY: enabled ? scrollYProgress : 1 }}/></div>{processSteps.map(([num, title, text], i) => <Reveal key={num} className="process-row" delay={i * 0.035}><span className="process-num display">{num}</span><span className="process-node"/><div><h4>{title}</h4><p>{text}</p></div></Reveal>)}</div></div>
      <Reveal className="quote-panel"><span className="quote-mark display">“</span><blockquote>From ancestral<br/>handloom motifs,<br/><em>to conscious<br/>modern couture.</em></blockquote><span className="handwriting">Tejas</span><div className="quote-bottom">LET’S KEEP<br/>THE HERITAGE ALIVE.<span className="quote-symbol" aria-hidden="true">✳</span></div></Reveal>
    </div>
  </section>;
}

function Journey({ onProject }) {
  const [open, setOpen] = useState(0);
  return <section id="experience" className="journey section-wrap">
    <Reveal className="section-heading"><div><span className="eyebrow">03 / THE INITIATIVES</span><h2>PRESERVING CRAFT. EMPOWERING WEAVERS<span className="accent">.</span></h2></div><a className="text-link" href="#contact">INQUIRE<ArrowUpRight size={16}/></a></Reveal>
    <div className="journey-grid"><div className="experience-list">{experiences.map((job, i) => <Reveal className={`experience-row ${open === i ? 'is-open' : ''}`} key={job.title}><button aria-expanded={open === i} aria-controls={`job-${i}`} onClick={() => setOpen(open === i ? null : i)}><span className="experience-date">{job.date}</span><span><h3>{job.title}</h3><span className="experience-place">{job.place}</span></span>{open === i ? <Minus size={18}/> : <Plus size={18}/>}</button><AnimatePresence initial={false}>{open === i && <motion.div id={`job-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}><p>{job.text}</p></motion.div>}</AnimatePresence></Reveal>)}</div>
    <Reveal className="awards-panel"><p className="eyebrow">VISUAL ARCHIVE</p><h3 className="display">PURE CRAFT.<br/><span className="accent">TIMELESS FORM.</span></h3><div className="award-list">{certificates.map((cert, i) => <button key={cert.title} onClick={() => onProject({ ...cert, type: 'image', media: cert.image, category: cert.year, description: 'Archival plate from Tejas’s textile revival practice in India.' })}><span>{String(i + 1).padStart(2, '0')}</span><span>{cert.title}<small>{cert.year}</small></span><ArrowUpRight size={19}/></button>)}</div></Reveal></div>
  </section>;
}

function Contact({ onProject }) {
  const [sent, setSent] = useState(false);
  const send = e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const text = `Hello Tejas, I am ${data.get('name')}.\n\nInquiry type: ${data.get('type')}\n${data.get('message')}`;
    const link = document.createElement('a');
    link.href = `https://wa.me/919654330794?text=${encodeURIComponent(text)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
    setSent(true);
  };
  return <section id="contact" className="contact section-wrap">
    <div className="contact-grid"><Reveal className="contact-intro"><span className="eyebrow">04 / COLLABORATE</span><h2 className="display">LET’S WEAVE<br/>TOGETHER<span className="accent">.</span></h2><p>Looking to commission bespoke handloom textiles, fair-trade artisan collaborations, or conscious couture sarees?</p><Magnetic href="https://wa.me/919654330794" target="_blank" rel="noopener noreferrer" className="contact-cta"><span className="round-arrow"><ArrowUpRight size={21}/></span>START A CONVERSATION</Magnetic></Reveal>
    <Reveal className="contact-links" delay={0.1}><a href="https://wa.me/919654330794" target="_blank" rel="noopener noreferrer"><Phone/><span><small>WHATSAPP DIRECT</small>+91 96543 30794</span><ArrowUpRight size={16}/></a><a href="tel:+919654330794"><Phone/><span><small>PHONE</small>9654330794</span><ArrowUpRight size={16}/></a><div><MapPin/><span><small>BASED IN</small>India</span></div><div><MapPin/><span><small>PRACTICE</small>Textile Revival & Conscious Couture</span></div></Reveal>
    <Reveal className="contact-reel" delay={0.2}><button onClick={() => onProject(featured[0])} aria-label="Open The Heritage Weave Revival"><div className="reel-screen"><span className="reel-screen-top">TEJAS®<span>HERITAGE / HANDLOOM</span></span><MediaImage src={featured[0]?.image} alt="The Heritage Weave Revival"/><span className="reel-screen-title display">CRAFT IT<br/><span>BY HAND.</span></span><span className="play-circle"><ArrowUpRight size={18}/></span></div><span className="reel-caption">EXPLORE THE HERITAGE WEAVE ARCHIVE.</span></button></Reveal></div>
    <Reveal><details className="project-brief"><summary>Share your commission or inquiry <Plus size={19}/></summary><form onSubmit={send}><label>Your Name<input name="name" required placeholder="Name or atelier / brand" autoComplete="name" maxLength="100"/></label><label>Inquiry Type<select name="type"><option>The Heritage Weave Revival</option><option>Sustainable Artisan Collective</option><option>Conscious Couture Edit (Bespoke Sarees)</option><option>Natural Dye & Motif Restoration</option><option>Global Luxury Wholesale / Fair-Trade</option></select></label><label className="brief-message">Project Details<textarea name="message" required rows="3" placeholder="Tell me about the textile, weave motif, capsule requirement, and timeline…" maxLength="3000"/></label><button className="solid-button" type="submit">Continue to WhatsApp <ArrowUpRight size={18}/></button><p className="form-note" role="status">{sent ? 'Your message draft is ready in WhatsApp. Press Send there to start the conversation.' : 'Your brief will open as a direct message draft in WhatsApp (+91 96543 30794).'}</p></form></details></Reveal>
  </section>;
}

function ProjectDialog({ project, onClose }) {
  const ref = useRef(null);
  const [renderMode, setRenderMode] = useState('final');
  const [shot, setShot] = useState(0);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);
  const [retried, setRetried] = useState(0);
  const enabled = useContext(MotionContext);
  const activeShot = project.type === 'render' ? project.renders[shot] : null;
  const embedType = activeShot?.video ? 'youtube' : activeShot?.drive ? 'drive' : project.type;
  const embedMedia = activeShot?.video || activeShot?.drive?.match(/\/d\/([^/]+)/)?.[1] || project.media;
  const isVideo = ['youtube', 'drive'].includes(embedType);
  const availableModes = [['layout', 'Layout'], ['solid', 'Solid'], ['material', 'Material'], ['lighting', 'Lighting'], ['final', 'Final render']].filter(([mode]) => activeShot?.[mode] && !(mode === 'solid' && activeShot.hideSolidMode));
  const effectiveMode = activeShot?.[renderMode] ? renderMode : availableModes[0]?.[0];
  const rendered = activeShot?.[effectiveMode] || activeShot?.image || project.image;
  const sourceUrl = embedType === 'youtube' ? `https://www.youtube.com/watch?v=${embedMedia}` : embedType === 'drive' ? `https://drive.google.com/file/d/${embedMedia}/view` : project.type === 'render' ? rendered : project.media || project.image;
  const changeShot = next => { setMediaLoaded(false); setMediaFailed(false); setShot(next); };
  useEffect(() => {
    const previous = document.activeElement;
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    const listener = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const nodes = [...ref.current.querySelectorAll('button, a[href], input, select, textarea, iframe')].filter(n => !n.disabled && n.getClientRects().length);
        const first = nodes[0]; const last = nodes.at(-1);
        if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener('keydown', listener);
    return () => { document.body.style.overflow = old; window.removeEventListener('keydown', listener); previous?.focus(); };
  }, [onClose]);
  useEffect(() => {
    if (!isVideo) return;
    const timer = setTimeout(() => { if (!mediaLoaded) setMediaFailed(true); }, 14000);
    return () => clearTimeout(timer);
  }, [mediaLoaded, retried, isVideo, embedMedia]);
  return <motion.div className="dialog-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <motion.div ref={ref} className="project-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" tabIndex="-1" initial={enabled ? { y: 45, scale: 0.97 } : false} animate={{ y: 0, scale: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
      <div className="dialog-heading"><span className="eyebrow">{project.category} {project.year && ` / ${project.year}`}</span><button onClick={onClose} className="icon-button" aria-label="Close work"><X/></button></div>
      <div className={`dialog-media ${!isVideo ? 'still' : ''}`}>
        {isVideo ? <>{!mediaLoaded && <div className="media-loading" role="status">{mediaFailed ? <><p>Preview could not be loaded. Open the original source to view.</p><button className="outline-button" onClick={() => { setMediaFailed(false); setMediaLoaded(false); setRetried(v => v + 1); }}>Try again</button></> : <><span className={enabled ? 'loading-ring' : 'loading-ring paused'}/><p>Loading media…</p></>}</div>}<iframe key={`${embedMedia}-${retried}`} src={embedType === 'youtube' ? `https://www.youtube-nocookie.com/embed/${embedMedia}?autoplay=1&rel=0` : `https://drive.google.com/file/d/${embedMedia}/preview`} title={project.title} width="1280" height="720" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen onLoad={() => { setMediaLoaded(true); setMediaFailed(false); }} onError={() => setMediaFailed(true)}/></> : <MediaImage src={rendered} alt={project.title} priority/>}
      </div>
      {project.type === 'render' && (availableModes.length > 0 || project.renders.length > 1) && <div className="render-controls"><div role="group" aria-label="Render stage">{availableModes.map(([mode, label]) => <button key={mode} className={effectiveMode === mode ? 'selected' : ''} onClick={() => setRenderMode(mode)} aria-pressed={effectiveMode === mode}>{label}</button>)}</div>{project.renders.length > 1 && <div className="shot-controls"><button className="icon-button" aria-label="Previous shot" onClick={() => changeShot((shot - 1 + project.renders.length) % project.renders.length)}><ChevronLeft/></button><span>SHOT {shot + 1} / {project.renders.length}</span><button className="icon-button" aria-label="Next shot" onClick={() => changeShot((shot + 1) % project.renders.length)}><ChevronRight/></button></div>}</div>}
      <div className="dialog-description"><div><h2 id="dialog-title">{project.title}</h2>{project.role && <span className="accent">{project.role}</span>}<p>{project.description}</p></div>{sourceUrl && <a className="outline-button" href={sourceUrl} target="_blank" rel="noopener noreferrer">{project.type === 'website' ? 'Visit website' : 'Open full image'}<ExternalLink size={15}/></a>}</div>
      {isVideo && <p className="embed-note">If playback is restricted by the host, use “Open full image”.</p>}
    </motion.div>
  </motion.div>;
}

function App() {
  const reduced = useReducedMotion();
  const [motionOn, setMotionOn] = useState(() => { try { return localStorage.getItem('renando-motion') !== 'off'; } catch { return true; } });
  const enabled = motionOn && !reduced;
  const [project, setProject] = useState(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 28, restDelta: 0.001 });
  useEffect(() => { document.documentElement.dataset.motion = enabled ? 'on' : 'off'; }, [enabled]);
  const toggle = () => { setMotionOn(!motionOn); try { localStorage.setItem('renando-motion', motionOn ? 'off' : 'on'); } catch {} };
  const close = React.useCallback(() => setProject(null), []);
  return <MotionContext.Provider value={enabled}>
    <MotionConfig reducedMotion={enabled ? 'user' : 'always'} transition={{ ease: EASE }}>
      <a className="skip-link" href="#portfolio">Skip to work</a>
      <motion.div className="reading-progress" style={{ scaleX: enabled ? progress : scrollYProgress }}/>
      <Header enabled={enabled} onToggle={toggle}/>
      <main>
        <Hero onProject={setProject}/>
        <Portfolio onProject={setProject}/>
        <Awards onProject={setProject}/>
        <About/>
        <Journey onProject={setProject}/>
        <Contact onProject={setProject}/>
      </main>
      <footer className="footer">
        <a className="wordmark" href="#home">TEJAS<span>®</span></a>
        <span>© {new Date().getFullYear()} TEJAS. EVERY THREAD HAS A PURPOSE.</span>
        <div>
          <a href="https://wa.me/919654330794" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Tejas"><Phone size={17}/></a>
          <a href="#home" aria-label="Back to top"><ArrowUpRight size={18}/></a>
        </div>
      </footer>
      <AnimatePresence>{project && <ProjectDialog key={project.title} project={project} onClose={close}/>}</AnimatePresence>
    </MotionConfig>
  </MotionContext.Provider>;
}

createRoot(document.getElementById('root')).render(<App/>);
