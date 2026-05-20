'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import useStore from './lib/store';
import { t, languages } from './lib/translations';
import Header from './components/Header';
import { ArrowRight, Shield, Globe, Zap, Users, BookOpen, Landmark, Heart, ChevronDown, Star, Check, Sparkles, Tractor, Home, ShieldPlus, GraduationCap, Briefcase, PersonStanding, UsersRound, Accessibility } from 'lucide-react';

function AnimatedCounter({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(end / (duration / 30));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <span>{count.toLocaleString('en-IN')}{suffix}</span>;
}

export default function LandingPage() {
  const { language, setLanguage } = useStore();
  const [langOpen, setLangOpen] = useState(false);

  const steps = [
    { icon: Users, title: t(language, 'step1Title'), desc: t(language, 'step1Desc'), color: 'var(--primary-500)' },
    { icon: Sparkles, title: t(language, 'step2Title'), desc: t(language, 'step2Desc'), color: 'var(--accent-500)' },
    { icon: Check, title: t(language, 'step3Title'), desc: t(language, 'step3Desc'), color: 'var(--success-500)' },
  ];

  const stats = [
    { value: 847, label: t(language, 'schemesCount'), suffix: '+' },
    { value: 28, label: t(language, 'statesCovered'), suffix: '' },
    { value: 9, label: t(language, 'languagesSupported'), suffix: '' },
    { value: 12400, label: t(language, 'usersHelped'), suffix: '+' },
  ];

  const categories = [
    { Icon: Tractor, label: 'Farmers & Agriculture', count: 124, tone: 'rgba(245, 191, 66, 0.18)', color: '#f5bf42' },
    { Icon: Home, label: 'Housing & Shelter', count: 56, tone: 'rgba(249, 151, 91, 0.18)', color: '#f9975b' },
    { Icon: ShieldPlus, label: 'Health & Insurance', count: 89, tone: 'rgba(232, 90, 94, 0.18)', color: '#e85a5e' },
    { Icon: GraduationCap, label: 'Education & Scholarships', count: 203, tone: 'rgba(70, 192, 183, 0.18)', color: '#46c0b7' },
    { Icon: Briefcase, label: 'Employment & Skills', count: 145, tone: 'rgba(154, 113, 241, 0.18)', color: '#9a71f1' },
    { Icon: PersonStanding, label: 'Senior Citizens & Pensions', count: 67, tone: 'rgba(84, 201, 120, 0.18)', color: '#54c978' },
    { Icon: UsersRound, label: 'Women & Children', count: 98, tone: 'rgba(236, 116, 173, 0.18)', color: '#ec74ad' },
    { Icon: Accessibility, label: 'Persons with Disabilities', count: 43, tone: 'rgba(96, 161, 247, 0.18)', color: '#60a1f7' },
  ];

  const faqs = [
    { q: "Is this really free?", a: "Yes, 100% free. We don't charge anything, and we never will charge citizens for this service." },
    { q: "Is my information safe?", a: "Absolutely. We never sell your data. We never share your information with any government agency without your explicit permission. Your data is encrypted and you can delete it anytime." },
    { q: "Do I need an Aadhaar card to use this?", a: "No! You can use this tool without any documents. We'll tell you what documents you might need to actually apply for schemes." },
    { q: "How accurate are the results?", a: "Our AI is trained on official government data and matches schemes with over 90% accuracy. However, final eligibility is always determined by the government office." },
    { q: "Can I use this in my language?", a: "Yes! We support Hindi, English, Marathi, Tamil, Telugu, Kannada, Bengali, Odia, and Gujarati." },
  ];

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen" style={{ background: 'transparent', position: 'relative' }}>
      <div className="relative z-10">
        <Header />
      
      {/* HERO SECTION */}
      <section data-anim="fade-up" className="hero-gradient relative overflow-hidden section-lg" style={{ paddingTop: 'calc(var(--header-height) + 40px)' }}>
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 animate-float" style={{ background: 'radial-gradient(circle, var(--primary-300), transparent)', filter: 'blur(40px)' }} />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full opacity-15 animate-float" style={{ background: 'radial-gradient(circle, var(--accent-300), transparent)', filter: 'blur(60px)', animationDelay: '1.5s' }} />
        
        <div className="relative z-10 px-4 text-center container" style={{ maxWidth: 720 }}>
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 animate-fade-in-down glass" style={{ borderRadius: 9999, borderColor: 'rgba(164, 244, 253, 0.16)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)' }}>
            <Shield size={14} style={{ color: 'var(--success-500)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--neutral-600)' }}>{t(language, 'trustSignals')}</span>
          </div>
          
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up" style={{ color: 'var(--neutral-900)' }}>
            {t(language, 'heroTitle')}{' '}
            <span className="gradient-text">{t(language, 'heroTitleHighlight')}</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl mb-8 animate-fade-in-up" style={{ color: 'var(--neutral-600)', maxWidth: 600, margin: '0 auto', animationDelay: '0.15s', lineHeight: 1.7 }}>
            {t(language, 'heroSubtitle')}
          </p>
          
          {/* CTA */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link href="/onboarding" className="btn btn-primary btn-lg text-lg" style={{ padding: '16px 34px', fontSize: 17, borderRadius: 9999, boxShadow: '0 18px 40px rgba(61, 129, 227, 0.28)' }}>
              {t(language, 'heroCTA')}
              <ArrowRight size={20} />
            </Link>
          </div>
          
          {/* Language selector row */}
          <div className="flex flex-wrap justify-center gap-1.5 mt-8 animate-fade-in-up" style={{ animationDelay: '0.45s', maxWidth: 560, margin: '32px auto 0' }}>
            {languages.slice(0, 5).map(lang => (
              <button key={lang.code} onClick={() => setLanguage(lang.code)}
                className="px-2 py-1 rounded-full text-[11px] font-medium transition-all glass"
                style={{
                  background: language === lang.code ? 'rgba(61,129,227,0.26)' : 'rgba(255,255,255,0.04)',
                  color: language === lang.code ? 'white' : 'rgba(255,255,255,0.75)',
                  border: `1px solid ${language === lang.code ? 'rgba(61,129,227,0.45)' : 'rgba(255,255,255,0.12)'}`,
                  letterSpacing: '0.02em',
                  cursor: 'pointer',
                }}>
                {lang.flag} {lang.nativeName}
              </button>
            ))}
            <button onClick={() => setLangOpen(!langOpen)} className="px-2 py-1 rounded-full text-[11px] font-medium glass" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.02em', cursor: 'pointer' }}>
              +{languages.length - 5} more
            </button>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section data-anim="fade-up" className="section-tight" style={{ background: 'rgba(7, 10, 17, 0.88)', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-4 container">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs sm:text-sm" style={{ color: 'var(--neutral-400)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section data-anim="fade-up" className="section-lg px-4 container">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-4" style={{ color: 'white', letterSpacing: '-0.03em' }}>
          {t(language, 'howItWorks')}
        </h2>
        <p className="text-center mb-12" style={{ color: 'rgba(255,255,255,0.58)', maxWidth: 520, margin: '0 auto' }}>
          Three simple steps to discover your government benefits
        </p>
        
        <div data-anim="stagger" className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="card p-8 text-center relative overflow-hidden group">
              {/* Step number */}
              <div className="absolute top-4 right-4 text-6xl font-black" style={{ color: 'rgba(255,255,255,0.08)', lineHeight: 1 }}>{i + 1}</div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 transition-transform group-hover:scale-110" style={{ background: `${step.color}20`, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <step.icon size={28} style={{ color: step.color }} />
                </div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: 'white', letterSpacing: '-0.02em' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.64)' }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SCHEME CATEGORIES */}
      <section data-anim="fade-up" className="section px-4" style={{ background: 'linear-gradient(180deg, rgba(12,12,12,0.75), rgba(12,12,12,0.92))', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          <h2 className="text-3xl font-semibold text-center mb-2" style={{ color: 'white', letterSpacing: '-0.03em' }}>Covering Every Area of Your Life</h2>
          <p className="text-center mb-10" style={{ color: 'rgba(255,255,255,0.56)' }}>From farming to education, health to housing</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <div key={i} className="card p-4 text-left cursor-pointer group" style={{ animationDelay: `${i * 0.05}s`, minHeight: 132 }}>
                <div className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center transition-transform group-hover:scale-105" style={{ background: cat.tone, border: '1px solid rgba(255,255,255,0.08)' }}>
                  <cat.Icon size={30} strokeWidth={1.9} style={{ color: cat.color }} />
                </div>
                <h3 className="text-sm font-semibold mb-1 leading-snug" style={{ color: 'white' }}>{cat.label}</h3>
                <span className="text-xs" style={{ color: 'rgba(125, 176, 255, 0.95)' }}>{cat.count} schemes</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section data-anim="fade-up" className="section px-4 container">
        <h2 className="text-3xl font-semibold text-center mb-10" style={{ color: 'white', letterSpacing: '-0.03em' }}>Real Stories from Real People</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Ramesh Kumar", loc: "Varanasi, UP", text: "I didn't know I was eligible for PM-KISAN. Unnati found it and 4 other schemes for me. I'm now getting ₹6,000 per year directly!", avatar: "RK" },
            { name: "Sunita Devi", loc: "Yavatmal, Maharashtra", text: "As a widow with two children, I discovered 7 schemes I never knew about. The step-by-step guide made it so easy to apply.", avatar: "SD" },
            { name: "Murugan S.", loc: "Thanjavur, Tamil Nadu", text: "My father got his Ayushman Bharat card within a week after following the steps here. Saved us ₹2 lakh on his surgery!", avatar: "MS" },
          ].map((t, i) => (
            <div key={i} className="card p-6">
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="var(--warning-500)" color="var(--warning-500)" />)}
              </div>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: 'rgba(255,255,255,0.74)' }}>"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))' }}>{t.avatar}</div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'white' }}>{t.name}</div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.52)' }}>{t.loc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section data-anim="fade-up" className="section px-4 container" style={{ background: 'linear-gradient(180deg, rgba(12,12,12,0.92), rgba(7,10,17,0.96))', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-3xl font-semibold text-center mb-10" style={{ color: 'white', letterSpacing: '-0.03em' }}>Frequently Asked Questions</h2>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div key={i} className="card overflow-hidden" style={{ cursor: 'pointer' }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="flex items-center justify-between p-5">
                  <span className="font-semibold text-sm" style={{ color: 'white' }}>{faq.q}</span>
                  <ChevronDown size={18} style={{ color: 'rgba(255,255,255,0.4)', transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm animate-fade-in-down" style={{ color: 'rgba(255,255,255,0.7)' }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
      </section>

      {/* FINAL CTA */}
      <section data-anim="fade-up" className="section-lg px-4 text-center" style={{ background: 'linear-gradient(135deg, var(--primary-600), var(--accent-600))' }}>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to find your benefits?</h2>
        <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.85)' }}>It takes just 5 minutes. No signup needed.</p>
        <Link href="/onboarding" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.78)', color: 'var(--primary-700)', padding: '18px 40px', fontSize: 18, borderRadius: 16 }}>
          {t(language, 'heroCTA')}
          <ArrowRight size={20} />
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-inner container">
          <div className="footer-column footer-brand">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))' }}>
              <span className="text-white font-bold text-sm">उन्नति</span>
            </div>
            <div>
              <div className="font-bold text-white">Unnati</div>
              <div className="text-sm" style={{ color: 'var(--neutral-400)' }}>{t(language, 'privacyDesc')}</div>
            </div>
          </div>

          <div className="footer-column footer-links">
            <a href="#">{t(language, 'footerPrivacy')}</a>
            <a href="#">{t(language, 'footerTerms')}</a>
            <a href="#">{t(language, 'footerContact')}</a>
          </div>

          <div className="footer-column" style={{ textAlign: 'right' }}>
            <div style={{ color: 'var(--neutral-500)' }}>{t(language, 'footerMadeWith')}</div>
            <div style={{ marginTop: 8, color: 'var(--neutral-500)' }}>© {new Date().getFullYear()} Unnati</div>
          </div>
        </div>
        <div className="footer-bottom">Built with care • Data is private • Version 0.1</div>
      </footer>
      </div>
    </div>
  );
}
