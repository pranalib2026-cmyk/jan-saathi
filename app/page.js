'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import useStore from './lib/store';
import { t, languages } from './lib/translations';
import Header from './components/Header';
import { ArrowRight, Shield, Globe, Zap, Users, BookOpen, Landmark, Heart, ChevronDown, Star, Check, Sparkles } from 'lucide-react';

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
    { icon: '🌾', label: 'Farmers & Agriculture', count: 124 },
    { icon: '🏠', label: 'Housing & Shelter', count: 56 },
    { icon: '💊', label: 'Health & Insurance', count: 89 },
    { icon: '📚', label: 'Education & Scholarships', count: 203 },
    { icon: '💼', label: 'Employment & Skills', count: 145 },
    { icon: '👵', label: 'Senior Citizens & Pensions', count: 67 },
    { icon: '👩', label: 'Women & Children', count: 98 },
    { icon: '♿', label: 'Persons with Disabilities', count: 43 },
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
    <div className="min-h-screen" style={{ background: '#fafafa' }}>
      <Header showAnnouncement />
      
      {/* HERO SECTION */}
      <section className="hero-gradient relative overflow-hidden py-16" style={{ paddingTop: 'calc(var(--header-height) + var(--announcement-height) + 40px)' }}>
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 animate-float" style={{ background: 'radial-gradient(circle, var(--primary-300), transparent)', filter: 'blur(40px)' }} />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full opacity-15 animate-float" style={{ background: 'radial-gradient(circle, var(--accent-300), transparent)', filter: 'blur(60px)', animationDelay: '1.5s' }} />
        
        <div className="relative z-10 px-4 text-center" style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 animate-fade-in-down" style={{ background: 'white', border: '1px solid var(--neutral-200)', boxShadow: 'var(--shadow-sm)' }}>
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
            <Link href="/onboarding" className="btn btn-primary btn-lg text-lg" style={{ padding: '18px 40px', fontSize: 18, borderRadius: 16 }}>
              {t(language, 'heroCTA')}
              <ArrowRight size={20} />
            </Link>
          </div>
          
          {/* Language selector row */}
          <div className="flex flex-wrap justify-center gap-2 mt-8 animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
            {languages.slice(0, 5).map(lang => (
              <button key={lang.code} onClick={() => setLanguage(lang.code)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: language === lang.code ? 'var(--primary-500)' : 'white',
                  color: language === lang.code ? 'white' : 'var(--neutral-600)',
                  border: `1px solid ${language === lang.code ? 'var(--primary-500)' : 'var(--neutral-300)'}`,
                  cursor: 'pointer',
                }}>
                {lang.flag} {lang.nativeName}
              </button>
            ))}
            <button onClick={() => setLangOpen(!langOpen)} className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: 'white', border: '1px solid var(--neutral-300)', color: 'var(--neutral-600)', cursor: 'pointer' }}>
              +{languages.length - 5} more
            </button>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="py-12" style={{ background: 'var(--neutral-900)' }}>
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-6">
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
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4" style={{ color: 'var(--neutral-900)' }}>
            {t(language, 'howItWorks')}
          </h2>
          <p className="text-center mb-12" style={{ color: 'var(--neutral-500)', maxWidth: 500, margin: '0 auto' }}>
            Three simple steps to discover your government benefits
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="card p-8 text-center relative overflow-hidden group">
                {/* Step number */}
                <div className="absolute top-4 right-4 text-6xl font-black" style={{ color: 'var(--neutral-100)', lineHeight: 1 }}>{i + 1}</div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-transform group-hover:scale-110" style={{ background: `${step.color}15` }}>
                    <step.icon size={28} style={{ color: step.color }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--neutral-900)' }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--neutral-600)' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCHEME CATEGORIES */}
      <section className="py-16 mt-12" style={{ background: 'var(--neutral-100)' }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: 'var(--neutral-900)' }}>Covering Every Area of Your Life</h2>
          <p className="text-center mb-10" style={{ color: 'var(--neutral-500)' }}>From farming to education, health to housing</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <div key={i} className="card p-5 rounded-2xl min-h-[160px] h-full flex flex-col items-center justify-center text-center cursor-pointer group" style={{ animationDelay: `${i * 0.05}s` }}>
                <span className="text-3xl mb-3 block group-hover:scale-125 transition-transform">{cat.icon}</span>
                <h3 className="text-sm font-semibold mb-1 w-full truncate" style={{ color: 'var(--neutral-800)' }}>{cat.label}</h3>
                <span className="text-xs" style={{ color: 'var(--primary-600)' }}>{cat.count} schemes</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10" style={{ color: 'var(--neutral-900)' }}>Real Stories from Real People</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Ramesh Kumar", loc: "Varanasi, UP", text: "I didn't know I was eligible for PM-KISAN. Jan Saathi found it and 4 other schemes for me. I'm now getting ₹6,000 per year directly!", avatar: "RK" },
              { name: "Sunita Devi", loc: "Yavatmal, Maharashtra", text: "As a widow with two children, I discovered 7 schemes I never knew about. The step-by-step guide made it so easy to apply.", avatar: "SD" },
              { name: "Murugan S.", loc: "Thanjavur, Tamil Nadu", text: "My father got his Ayushman Bharat card within a week after following the steps here. Saved us ₹2 lakh on his surgery!", avatar: "MS" },
            ].map((t, i) => (
              <div key={i} className="card p-6">
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="var(--warning-500)" color="var(--warning-500)" />)}
                </div>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--neutral-700)' }}>"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))' }}>{t.avatar}</div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--neutral-800)' }}>{t.name}</div>
                    <div className="text-xs" style={{ color: 'var(--neutral-500)' }}>{t.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16" style={{ background: 'var(--neutral-100)' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 className="text-3xl font-bold text-center mb-10" style={{ color: 'var(--neutral-900)' }}>Frequently Asked Questions</h2>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div key={i} className="card overflow-hidden" style={{ cursor: 'pointer' }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="flex items-center justify-between p-5">
                  <span className="font-semibold text-sm" style={{ color: 'var(--neutral-800)' }}>{faq.q}</span>
                  <ChevronDown size={18} style={{ color: 'var(--neutral-400)', transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm animate-fade-in-down" style={{ color: 'var(--neutral-600)' }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 text-center" style={{ background: 'linear-gradient(135deg, var(--primary-600), var(--accent-600))' }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to find your benefits?</h2>
          <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.85)' }}>It takes just 5 minutes. No signup needed.</p>
          <Link href="/onboarding" className="btn btn-lg" style={{ background: 'white', color: 'var(--primary-700)', padding: '18px 40px', fontSize: 18, borderRadius: 16 }}>
            {t(language, 'heroCTA')}
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12" style={{ background: 'var(--neutral-900)' }}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))' }}>
              <span className="text-white font-bold text-sm">जन</span>
            </div>
            <span className="font-bold text-white">Jan Saathi</span>
          </div>
          <p className="text-sm mb-6" style={{ color: 'var(--neutral-400)' }}>{t(language, 'privacyDesc')}</p>
          <div className="flex justify-center gap-6 text-xs" style={{ color: 'var(--neutral-500)' }}>
            <span>{t(language, 'footerPrivacy')}</span>
            <span>{t(language, 'footerTerms')}</span>
            <span>{t(language, 'footerContact')}</span>
          </div>
          <p className="mt-6 text-xs" style={{ color: 'var(--neutral-600)' }}>{t(language, 'footerMadeWith')}</p>
        </div>
      </footer>
    </div>
  );
}
