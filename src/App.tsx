import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ArrowUpRight,
  Building2,
  Check,
  ChevronRight,
  Clock3,
  Hammer,
  Layers3,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';

type Page = 'home' | 'about' | 'services' | 'manpower' | 'contact';

const villaImage = 'https://images.pexels.com/photos/10647324/pexels-photo-10647324.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const workersImage = 'https://images.pexels.com/photos/8961260/pexels-photo-8961260.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const interiorImage = 'https://images.pexels.com/photos/36710315/pexels-photo-36710315.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const constructionImage = 'https://images.pexels.com/photos/19408681/pexels-photo-19408681.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

const navItems: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'About us', page: 'about' },
  { label: 'Services', page: 'services' },
  { label: 'Manpower', page: 'manpower' },
  { label: 'Contact', page: 'contact' },
];

const services = [
  { number: '01', title: 'New Villa Construction', description: 'From first lines to final handover, we shape private residences with precision.', icon: Building2, image: villaImage },
  { number: '02', title: 'Structural Works', description: 'Strong foundations, considered structure, and workmanship built to last.', icon: Layers3, image: constructionImage },
  { number: '03', title: 'Block & Plaster Works', description: 'Clean, level surfaces that give every space a confident beginning.', icon: Hammer, image: workersImage },
  { number: '04', title: 'Flooring & Tiling', description: 'Refined finishes and exact installation for interiors that feel complete.', icon: Sparkles, image: interiorImage },
  { number: '05', title: 'Painting & Finishing', description: 'The final layer of care, with lasting colour and a flawless finish.', icon: Check, image: villaImage },
  { number: '06', title: 'Renovation', description: 'Thoughtful upgrades that make existing spaces work beautifully again.', icon: ArrowUpRight, image: interiorImage },
];

const workforce = ['Masons', 'Steel Fixers', 'Scaffolding Workers', 'Helpers', 'General Labour', 'Skilled Workers', 'Semi-Skilled Workers', 'Unskilled Workers'];

/* ---------- Scroll reveal hook ---------- */
function useScrollReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    el.querySelectorAll('.reveal').forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* ---------- Custom cursor ---------- */
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let raf = 0;
    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      setHidden(false);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx}px, ${my}px)`;
      }
    };

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);

    const setHover = (active: boolean) => {
      if (ringRef.current) {
        ringRef.current.classList.toggle('cursor-hover', active);
      }
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, textarea, .service-card, .engagement-cards div')) {
        setHover(true);
      } else {
        setHover(false);
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseover', onOver);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseover', onOver);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className={`cursor-dot${hidden ? ' cursor-hidden' : ''}`} />
      <div ref={ringRef} className={`cursor-ring${hidden ? ' cursor-hidden' : ''}`} />
    </>
  );
}

/* ---------- Scroll progress bar ---------- */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div className="scroll-progress" style={{ width: `${progress}%` }} />;
}

/* ---------- Parallax image wrapper ---------- */
function ParallaxImage({ url, className, caption, speed = 0.15 }: { url: string; className?: string; caption?: string; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const offset = rect.top * speed;
        const img = el.firstElementChild as HTMLElement | null;
        if (img) img.style.transform = `translateY(${offset}px) scale(1.12)`;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [speed]);
  return (
    <div ref={ref} className={`parallax-wrap ${className || ''}`}>
      <div className="parallax-img" style={{ backgroundImage: `url(${url})` }} />
      {caption && <div className="image-caption">{caption}</div>}
    </div>
  );
}

function App() {
  const [page, setPage] = useState<Page>(() => getPageFromHash());
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const onHashChange = () => setPage(getPageFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (nextPage: Page) => {
    window.location.hash = nextPage === 'home' ? '' : nextPage;
    setPage(nextPage);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="site-shell">
      <CustomCursor />
      <ScrollProgress />
      <header className="site-header">
        <div className="utility-bar">
          <div className="container utility-inner">
            <span>Dubai, United Arab Emirates</span>
            <div className="utility-links"><span>Quality</span><span>Reliability</span><span>Commitment</span></div>
          </div>
        </div>
        <div className="container nav-wrap">
          <button className="brand" onClick={() => navigate('home')} aria-label="Khat Alnahda home">
            <span className="brand-mark"><img src="/images/d28b0b1b-adc0-49ea-808b-e57471e66370.jpg" alt="Khat Alnahda logo" /></span>
            <span><strong>KHAT ALNAHDA</strong><small>TECHNICAL SERVICES L.L.C.</small></span>
          </button>
          <nav className={menuOpen ? 'main-nav open' : 'main-nav'}>
            {navItems.map((item) => <button key={item.page} className={page === item.page ? 'active' : ''} onClick={() => navigate(item.page)}>{item.label}</button>)}
            <button className="nav-cta" onClick={() => navigate('contact')}>Start a project <ArrowUpRight size={16} /></button>
          </nav>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>

      <main key={page} className="page-transition">
        {page === 'home' && <Home navigate={navigate} />}
        {page === 'about' && <About navigate={navigate} />}
        {page === 'services' && <Services navigate={navigate} />}
        {page === 'manpower' && <Manpower navigate={navigate} />}
        {page === 'contact' && <Contact submitted={submitted} setSubmitted={setSubmitted} />}
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div><button className="brand footer-brand" onClick={() => navigate('home')}><span className="brand-mark"><img src="/images/d28b0b1b-adc0-49ea-808b-e57471e66370.jpg" alt="Khat Alnahda logo" /></span><span><strong>KHAT ALNAHDA</strong><small>TECHNICAL SERVICES L.L.C.</small></span></button><p>Building with purpose across Dubai.<br />Quality in every detail.</p></div>
          <div><p className="footer-label">Explore</p>{navItems.slice(1).map(item => <button className="footer-link" key={item.page} onClick={() => navigate(item.page)}>{item.label}<ChevronRight size={13} /></button>)}</div>
          <div><p className="footer-label">Get in touch</p><a href="tel:+971562364228" className="footer-link"><Phone size={14} /> +971 56 236 4228</a><a href="mailto:info@khatalnahda.com" className="footer-link"><Mail size={14} /> info@khatalnahda.com</a><span className="footer-link"><MapPin size={14} /> Dubai, UAE</span></div>
        </div>
        <div className="container footer-bottom"><span>© 2024 Khat Alnahda Technical Services L.L.C.</span><span>Trade Licence No. 1525722</span></div>
      </footer>
    </div>
  );
}

function getPageFromHash(): Page {
  const value = window.location.hash.replace('#', '') as Page;
  return navItems.some(item => item.page === value) ? value : 'home';
}

function Eyebrow({ children }: { children: string }) { return <p className="eyebrow reveal"><span />{children}</p>; }
function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: ReactNode; description: string }) { return <section className="page-intro container"><Eyebrow>{eyebrow}</Eyebrow><h1 className="reveal">{title}</h1><p className="reveal">{description}</p></section>; }

function Home({ navigate }: { navigate: (page: Page) => void }) {
  const ref = useScrollReveal<HTMLDivElement>();
  return <div ref={ref}>
    <section className="hero">
      <div className="hero-image" style={{ backgroundImage: `url(${villaImage})` }} />
      <div className="hero-shade" />
      <div className="container hero-content">
        <p className="eyebrow hero-eyebrow-anim"><span />Dubai · Since day one</p>
        <h1 className="hero-title-anim"><span className="line-anim" style={{ animationDelay: '0.1s' }}>We build the</span><br /><span className="line-anim" style={{ animationDelay: '0.25s' }}><em>places</em> you imagine.</span></h1>
        <p className="hero-copy hero-copy-anim">Villa construction, technical services and reliable manpower — delivered with precision, care and a commitment to doing things right.</p>
        <div className="hero-actions hero-actions-anim"><button className="button gold" onClick={() => navigate('services')}>Explore our services <ArrowUpRight size={17} /></button><button className="text-button light" onClick={() => navigate('contact')}>Tell us about your project <ChevronRight size={17} /></button></div>
      </div>
      <div className="hero-stamp hero-stamp-anim"><span>QUALITY<br />IN EVERY<br />DETAIL</span><span className="stamp-line" /><span className="stamp-year">BUILDING<br />DUBAI · UAE</span></div>
    </section>
    <section className="intro-section container"><div className="intro-lead"><Eyebrow>What we do</Eyebrow><h2 className="reveal">Built on trust.<br /><em>Made to last.</em></h2></div><div className="intro-copy"><p className="large-copy reveal">Khat Alnahda is a Dubai-based technical services company bringing together the people, craft and project care needed to turn ambitious plans into enduring spaces.</p><button className="text-button dark reveal" onClick={() => navigate('about')}>More about us <ArrowUpRight size={17} /></button></div></section>
    <section className="services-preview"><div className="container"><div className="section-heading"><div><Eyebrow>Our expertise</Eyebrow><h2 className="reveal">One team.<br /><em>Every detail.</em></h2></div><button className="text-button dark reveal" onClick={() => navigate('services')}>View all services <ArrowUpRight size={17} /></button></div><div className="service-grid">{services.slice(0, 3).map((service, i) => <div key={service.number} className="reveal" style={{ transitionDelay: `${i * 120}ms` }}><ServiceCard service={service} /></div>)}</div></div></section>
    <section className="split-feature container">
      <ParallaxImage url={workersImage} className="feature-image-parallax" caption="On site · Dubai" speed={0.12} />
      <div className="feature-content"><Eyebrow>More than manpower</Eyebrow><h2 className="reveal">The right hands<br /><em>for the job.</em></h2><p className="reveal">We provide reliable manpower solutions for construction and technical projects, matched to your exact workforce requirements.</p><div className="mini-stats"><div className="reveal" style={{ transitionDelay: '100ms' }}><strong>08</strong><span>Workforce<br />categories</span></div><div className="reveal" style={{ transitionDelay: '200ms' }}><strong>24/7</strong><span>Project<br />readiness</span></div></div><button className="button navy reveal" onClick={() => navigate('manpower')}>Meet our workforce <ArrowUpRight size={17} /></button></div>
    </section>
    <Cta navigate={navigate} />
  </div>;
}

function About({ navigate }: { navigate: (page: Page) => void }) {
  const ref = useScrollReveal<HTMLDivElement>();
  return <div ref={ref}><PageIntro eyebrow="The company" title={<>A steady hand<br /><em>in a changing city.</em></>} description="We are a Dubai technical services partner for clients who value clear communication, disciplined work and a result they can be proud of." /><section className="about-story container"><ParallaxImage url={interiorImage} className="about-image-parallax" speed={0.1} /><div className="about-image-note reveal">KHAT ALNAHDA · TECHNICAL SERVICES</div><div className="about-copy"><Eyebrow>Our approach</Eyebrow><h2 className="reveal">Good work starts<br />with <em>good intent.</em></h2><p className="reveal">Every project is different. Our job is to listen closely, plan practically and bring the right people together to deliver a space that feels considered from the ground up.</p><p className="reveal">From a new villa to a focused renovation, we carry the same standard through every stage: honest advice, careful execution and a finish that stands up to daily life.</p><div className="values-list"><div className="reveal" style={{ transitionDelay: '80ms' }}><ShieldCheck /><span><strong>Dependable by design</strong>Clear commitments and consistent delivery.</span></div><div className="reveal" style={{ transitionDelay: '160ms' }}><Users /><span><strong>People first</strong>Respect for every client, team and site.</span></div></div><button className="button navy reveal" onClick={() => navigate('contact')}>Work with us <ArrowUpRight size={17} /></button></div></section><section className="numbers-band"><div className="container numbers-grid">{['Clear communication', 'Quality workmanship', 'Complete execution', 'Dubai based'].map((label, i) => <div key={label} className="reveal" style={{ transitionDelay: `${i * 100}ms` }}><strong>0{i + 1}</strong><span>{label}</span></div>)}</div></section><Cta navigate={navigate} /></div>;
}

function Services({ navigate }: { navigate: (page: Page) => void }) {
  const ref = useScrollReveal<HTMLDivElement>();
  return <div ref={ref}><PageIntro eyebrow="What we offer" title={<>Crafted for the<br /><em>way you live.</em></>} description="From structure to finishing touches, our services are shaped around one goal: making your project feel beautifully resolved." /><section className="container all-services"><div className="services-intro-line reveal"><span>01 — 06</span><p>Complete project execution, from first conversation to final walkthrough.</p></div><div className="all-service-list">{services.map((service, i) => <div key={service.number} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}><ServiceCard service={service} expanded /></div>)}</div></section><section className="service-callout"><div className="container callout-inner"><div><Eyebrow>Have a project in mind?</Eyebrow><h2 className="reveal">Let's make it<br /><em>real.</em></h2></div><button className="button gold reveal" onClick={() => navigate('contact')}>Start a conversation <ArrowUpRight size={17} /></button></div></section></div>;
}

function ServiceCard({ service, expanded = false }: { service: typeof services[number]; expanded?: boolean }) {
  const Icon = service.icon;
  return <article className={expanded ? 'service-card expanded' : 'service-card'}><div className="service-number">{service.number}</div><div className="service-card-main"><div className="service-icon"><Icon size={22} strokeWidth={1.4} /></div><h3>{service.title}</h3><p>{service.description}</p>{expanded && <span className="service-arrow"><ArrowUpRight size={18} /></span>}</div>{expanded && <div className="service-card-image" style={{ backgroundImage: `url(${service.image})` }} />}</article>;
}

function Manpower({ navigate }: { navigate: (page: Page) => void }) {
  const ref = useScrollReveal<HTMLDivElement>();
  return <div ref={ref}><PageIntro eyebrow="Workforce solutions" title={<>Ready people.<br /><em>Right when needed.</em></>} description="Reliable manpower for short-term, long-term and project-based requirements across construction and technical projects." /><section className="manpower-hero container"><ParallaxImage url={workersImage} className="manpower-photo-parallax" speed={0.1} /><div className="manpower-panel"><Eyebrow>Available workforce</Eyebrow><h2 className="reveal">A team you<br /><em>can count on.</em></h2><p className="reveal">We connect you with capable, dependable people who understand the pace and responsibility of a live project.</p><div className="workforce-list">{workforce.map((role, index) => <div key={role} className="reveal" style={{ transitionDelay: `${(index % 2) * 80 + Math.floor(index / 2) * 60}ms` }}><span>0{index + 1}</span>{role}<Check size={15} /></div>)}</div></div></section><section className="engagement-section"><div className="container engagement-grid"><div><Eyebrow>Flexible engagement</Eyebrow><h2 className="reveal">Built around<br /><em>your timeline.</em></h2></div><div className="engagement-copy"><p className="reveal">Whether you need a focused crew for a short phase or a dependable workforce for the full project, we make resourcing simple and responsive.</p><div className="engagement-cards"><div className="reveal" style={{ transitionDelay: '80ms' }}><Clock3 /><strong>Short-term</strong><span>Agile support for immediate needs.</span></div><div className="reveal" style={{ transitionDelay: '160ms' }}><Building2 /><strong>Project-based</strong><span>Dedicated teams for every stage.</span></div><div className="reveal" style={{ transitionDelay: '240ms' }}><Users /><strong>Long-term</strong><span>Reliable people you know by name.</span></div></div><button className="button navy reveal" onClick={() => navigate('contact')}>Request manpower <ArrowUpRight size={17} /></button></div></div></section></div>;
}

function Contact({ submitted, setSubmitted }: { submitted: boolean; setSubmitted: (value: boolean) => void }) {
  const ref = useScrollReveal<HTMLDivElement>();
  return <div ref={ref}><PageIntro eyebrow="Start a conversation" title={<>Let's build<br /><em>something lasting.</em></>} description="Tell us a little about your project and our team will get back to you with the right next step." /><section className="contact-section container"><div className="contact-details"><div className="contact-detail reveal"><span className="detail-icon"><Phone size={19} /></span><div><small>Call us</small><a href="tel:+971562364228">+971 56 236 4228</a></div></div><div className="contact-detail reveal" style={{ transitionDelay: '80ms' }}><span className="detail-icon"><Mail size={19} /></span><div><small>Email us</small><a href="mailto:info@khatalnahda.com">info@khatalnahda.com</a></div></div><div className="contact-detail reveal" style={{ transitionDelay: '160ms' }}><span className="detail-icon"><MapPin size={19} /></span><div><small>Find us</small><span>Dubai, United Arab Emirates</span></div></div><div className="contact-note reveal" style={{ transitionDelay: '240ms' }}><span>Quality</span><span className="gold-dot" /><span>Reliability</span><span className="gold-dot" /><span>Commitment</span></div></div><form className="contact-form reveal" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}><div className="form-row"><label>Your name<input required placeholder="How should we address you?" /></label><label>Phone number<input required type="tel" placeholder="+971 ..." /></label></div><label>Email address<input required type="email" placeholder="you@company.com" /></label><label>How can we help?<textarea required rows={4} placeholder="Tell us about your project, timeline or manpower needs..." /></label><button className="button navy" type="submit">{submitted ? <>Message sent <Check size={17} /></> : <>Send enquiry <ArrowUpRight size={17} /></>}</button>{submitted && <p className="success-message">Thank you. Your enquiry is with our team.</p>}</form></section><section className="contact-image" style={{ backgroundImage: `url(${villaImage})` }}><div className="container"><span className="reveal">From a first sketch<br />to the final detail.</span></div></section></div>;
}

function Cta({ navigate }: { navigate: (page: Page) => void }) { return <section className="cta-band"><div className="container cta-inner"><div><Eyebrow>Start your next chapter</Eyebrow><h2 className="reveal">Have a vision?<br /><em>Let's talk.</em></h2></div><button className="button gold reveal" onClick={() => navigate('contact')}>Get in touch <ArrowUpRight size={17} /></button></div></section>; }

export default App;
