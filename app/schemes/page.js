'use client';
import { useState } from 'react';
import Link from 'next/link';
import useStore from '../lib/store';
import { t } from '../lib/translations';
import { schemeDatabase } from '../lib/schemes';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { Search, Landmark, Stethoscope, GraduationCap, Home, Tractor, Briefcase, Baby, Shield, ChevronRight, IndianRupee } from 'lucide-react';

const categories = [
  { key: 'all', label: 'All Schemes', icon: Landmark },
  { key: 'Agriculture', label: 'Agriculture', icon: Tractor },
  { key: 'Health', label: 'Health', icon: Stethoscope },
  { key: 'Housing', label: 'Housing', icon: Home },
  { key: 'Education', label: 'Education', icon: GraduationCap },
  { key: 'Employment', label: 'Employment', icon: Briefcase },
  { key: 'Women & Welfare', label: 'Women', icon: Baby },
  { key: 'Business', label: 'Business', icon: Briefcase },
  { key: 'Pension', label: 'Pension', icon: Shield },
  { key: 'Food Security', label: 'Food', icon: Landmark },
];

export default function SchemesPage() {
  const { language } = useStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = schemeDatabase.filter(s => {
    const name = language === 'hi' ? s.nameHindi : s.name;
    const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.ministry.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || s.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen" style={{ background: 'transparent', position: 'relative', paddingBottom: 80 }}>
        <div className="relative z-10">
      <Header />
      <div className="page-container" style={{ paddingTop: 80, maxWidth: 760 }}>
        <h1 className="page-title mb-1">{t(language, 'navSchemes')}</h1>
        <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.56)' }}>
          {language === 'hi' ? `${schemeDatabase.length} केंद्रीय योजनाएं` : `${schemeDatabase.length} Central Government Schemes`}
        </p>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--neutral-400)' }} />
          <input className="input" style={{ paddingLeft: 44 }}
            placeholder={language === 'hi' ? 'योजना खोजें...' : 'Search schemes...'}
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Category pills */}
        <div className="overflow-x-auto pb-3 mb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="flex w-max items-center gap-2 pr-4">
          {categories.map(cat => (
            <button key={cat.key} onClick={() => setCategory(cat.key)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 glass"
              style={{
                background: category === cat.key ? 'rgba(61,129,227,0.2)' : 'rgba(255,255,255,0.04)',
                color: category === cat.key ? 'white' : 'rgba(255,255,255,0.72)',
                border: `1px solid ${category === cat.key ? 'rgba(61,129,227,0.45)' : 'rgba(255,255,255,0.12)'}`,
                cursor: 'pointer',
              }}>
              <cat.icon size={14} />
              {cat.label}
            </button>
          ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-xs mb-3 font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {filtered.length} {language === 'hi' ? 'योजनाएं मिलीं' : 'schemes found'}
        </p>

        {/* Scheme cards */}
        <div className="flex flex-col gap-3">
          {filtered.map(scheme => (
            <Link key={scheme.id} href={`/schemes/${scheme.id}`} className="card p-4 no-underline animate-fade-in block" style={{ borderRadius: 20 }}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="badge" style={{ background: 'rgba(61,129,227,0.16)', color: 'white', fontSize: 11, border: '1px solid rgba(255,255,255,0.1)' }}>{scheme.category}</span>
                  </div>
                  <h3 className="card-title mb-0.5" style={{ color: 'white' }}>
                    {language === 'hi' ? scheme.nameHindi : scheme.name}
                  </h3>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.56)' }}>{scheme.ministry}</p>
                </div>
                <ChevronRight size={18} className="flex-shrink-0 mt-1" style={{ color: 'rgba(255,255,255,0.38)' }} />
              </div>
              <p className="body-text mb-2 line-clamp-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {scheme.description}
              </p>
              <div className="flex items-center gap-1">
                <IndianRupee size={13} style={{ color: 'var(--success-600)' }} />
                <span className="text-xs font-bold" style={{ color: 'var(--success-600)' }}>{scheme.annualBenefit}</span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-2">🔍</p>
            <p className="text-sm" style={{ color: 'var(--neutral-500)' }}>
              {language === 'hi' ? 'कोई योजना नहीं मिली। अलग खोज आज़माएं।' : 'No schemes found. Try a different search.'}
            </p>
          </div>
        )}
      </div>
      </div>
      <BottomNav />
    </div>
  );
}
