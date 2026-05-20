'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useStore from '../lib/store';
import { t } from '../lib/translations';
import { generateMockResults } from '../lib/mockData';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { TrendingUp, Clock, ArrowRight, ChevronDown, ChevronUp, AlertTriangle, FileText, Link2, Shield, MapPin, Briefcase, Edit, Sparkles, CheckCircle2, Circle, Timer } from 'lucide-react';

function ValueDisplay({ amount }) {
  const formatted = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  return <span>{formatted}</span>;
}

function SkeletonLoader() {
  return (
    <div className="animate-fade-in" style={{ maxWidth: 700, margin: '0 auto', padding: 16 }}>
      <div className="skeleton mb-4" style={{ height: 120, borderRadius: 16 }} />
      <div className="skeleton mb-4" style={{ height: 80, borderRadius: 16 }} />
      {[1,2,3].map(i => <div key={i} className="skeleton mb-3" style={{ height: 100, borderRadius: 12 }} />)}
    </div>
  );
}

function SchemeCard({ scheme, language }) {
  const [expanded, setExpanded] = useState(false);
  const T = (key) => t(language, key);
  const typeColors = { Now: { bg: '#dcfce7', color: '#15803d', dot: '#22c55e' }, Soon: { bg: '#fef9c3', color: '#a16207', dot: '#eab308' }, Future: { bg: '#f3f4f6', color: '#6b7280', dot: '#9ca3af' } };
  const c = typeColors[scheme.type] || typeColors.Future;

  return (
    <div className="card overflow-hidden animate-fade-in-up" style={{ borderLeft: `4px solid ${c.dot}` }}>
      <div className="p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="badge" style={{ background: c.bg, color: c.color }}>{T(`timeline${scheme.type}`)}</span>
              <span className="badge" style={{ background: 'var(--neutral-100)', color: 'var(--neutral-600)' }}>{scheme.level}</span>
            </div>
            <h3 className="font-bold text-base mb-1" style={{ color: 'var(--neutral-900)' }}>{scheme.name}</h3>
            <p className="text-xs" style={{ color: 'var(--neutral-500)' }}>{scheme.ministry}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-bold" style={{ color: 'var(--success-700)' }}>
              <ValueDisplay amount={scheme.projectedValue} />
            </div>
            <div className="flex items-center gap-1 mt-1">
              <div className="h-1.5 rounded-full" style={{ width: 60, background: 'var(--neutral-200)' }}>
                <div className="h-full rounded-full" style={{ width: `${scheme.eligibilityScore}%`, background: scheme.eligibilityScore > 80 ? 'var(--success-500)' : scheme.eligibilityScore > 60 ? 'var(--warning-500)' : 'var(--danger-500)' }} />
              </div>
              <span className="text-xs font-medium" style={{ color: 'var(--neutral-500)' }}>{scheme.eligibilityScore}%</span>
            </div>
          </div>
        </div>
        <p className="text-sm mt-2" style={{ color: 'var(--neutral-600)' }}>{scheme.eligibilityReason}</p>
        <button className="flex items-center gap-1 mt-2 text-xs font-medium" style={{ color: 'var(--primary-600)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? 'Show less' : T('viewDetails')}
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t animate-fade-in-down" style={{ borderColor: 'var(--neutral-100)' }}>
          <div className="mt-3">
            <p className="text-sm mb-3" style={{ color: 'var(--neutral-700)' }}>{scheme.plainDescription}</p>
            
            {scheme.missingDocuments?.length > 0 && (
              <div className="p-3 rounded-lg mb-3" style={{ background: 'var(--warning-50)' }}>
                <span className="text-xs font-semibold" style={{ color: 'var(--warning-600)' }}>⚠️ Missing documents: {scheme.missingDocuments.join(', ')}</span>
              </div>
            )}

            <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--neutral-800)' }}>{T('actionSteps')}</h4>
            <div className="flex flex-col gap-2">
              {scheme.actionSteps?.map((step, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: 'var(--primary-100)', color: 'var(--primary-700)' }}>{step.step}</div>
                  <div className="flex-1">
                    <p className="text-sm" style={{ color: 'var(--neutral-700)' }}>{step.action}</p>
                    {step.timeRequired !== '—' && <span className="text-xs" style={{ color: 'var(--neutral-400)' }}>⏱ {step.timeRequired}</span>}
                  </div>
                </div>
              ))}
            </div>

            {scheme.deadline && (
              <div className="mt-3 p-2 rounded-lg flex items-center gap-2" style={{ background: 'var(--danger-50)' }}>
                <Timer size={14} style={{ color: 'var(--danger-500)' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--danger-600)' }}>Deadline: {scheme.deadline}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { language, profile, results, setResults, isAnalyzing, setIsAnalyzing, onboardingComplete } = useStore();
  const T = (key) => t(language, key);

  useEffect(() => {
    if (!onboardingComplete && !results) {
      router.push('/onboarding');
      return;
    }
    if (!results && onboardingComplete) {
      setIsAnalyzing(true);
      // Try API first, fall back to mock
      fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ profile, language }) })
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => { setResults(data); setIsAnalyzing(false); })
        .catch(() => {
          // Fallback to mock data
          setTimeout(() => { setResults(generateMockResults(profile)); setIsAnalyzing(false); }, 2000);
        });
    }
  }, [onboardingComplete, results]);

  if (isAnalyzing || !results) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--neutral-50)' }}>
        <Header />
        <div style={{ paddingTop: 'calc(var(--header-total-height) + 40px)' }}>
          <div className="text-center mb-8 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 animate-pulse-soft" style={{ background: 'var(--primary-100)' }}>
              <Sparkles size={28} style={{ color: 'var(--primary-500)' }} />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--neutral-900)' }}>Analyzing your profile...</h2>
            <p className="text-sm" style={{ color: 'var(--neutral-500)' }}>Checking thousands of schemes across Central and State governments</p>
          </div>
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  const r = results;
  const nowSchemes = r.schemes?.filter(s => s.type === 'Now') || [];
  const soonSchemes = r.schemes?.filter(s => s.type === 'Soon') || [];
  const futureSchemes = r.schemes?.filter(s => s.type === 'Future') || [];

  return (
    <div className="min-h-screen" style={{ background: 'var(--neutral-50)', paddingBottom: 80 }}>
      <Header />
      <div style={{ paddingTop: 'calc(var(--header-total-height) + 16px)', maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', paddingLeft: 16, paddingRight: 16 }}>
        {/* Profile Summary Bar */}
        <div className="card p-4 flex items-center gap-4 animate-fade-in">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0" style={{ background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))' }}>
            {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold truncate" style={{ color: 'var(--neutral-900)' }}>{profile.fullName || 'User'}</h3>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--neutral-500)' }}>
              <Briefcase size={12} /> <span>{profile.occupation}</span>
              {profile.state && <><MapPin size={12} /> <span>{profile.district}, {profile.state}</span></>}
            </div>
            {r.archetype && <span className="text-xs font-medium" style={{ color: 'var(--primary-600)' }}>{r.archetype.label}</span>}
          </div>
          <Link href="/onboarding" className="btn btn-ghost btn-sm"><Edit size={14} /> {T('editProfile')}</Link>
        </div>

        {/* Total Value Banner */}
        <div className="rounded-2xl p-6 mt-4 animate-fade-in-up text-center" style={{ background: 'linear-gradient(135deg, #15803d, #0d9488)', color: 'white' }}>
          <p className="text-sm opacity-80 mb-1">{T('totalValue')}</p>
          <div className="text-4xl sm:text-5xl font-extrabold mb-2">
            <ValueDisplay amount={r.totalProjectedValue || 0} />
          </div>
          <p className="text-sm opacity-75">
            <TrendingUp size={14} className="inline mr-1" />
            {r.schemes?.length || 0} {T('schemesFound')}
          </p>
        </div>

        {/* Scheme Timeline */}
        {nowSchemes.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={18} style={{ color: 'var(--success-500)' }} />
              <h3 className="font-bold" style={{ color: 'var(--neutral-900)' }}>{T('timelineNow')}</h3>
              <span className="badge" style={{ background: 'var(--success-50)', color: 'var(--success-700)' }}>{nowSchemes.length}</span>
            </div>
            <div className="flex flex-col gap-3">
              {nowSchemes.map(s => <SchemeCard key={s.id} scheme={s} language={language} />)}
            </div>
          </div>
        )}

        {soonSchemes.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={18} style={{ color: 'var(--warning-500)' }} />
              <h3 className="font-bold" style={{ color: 'var(--neutral-900)' }}>{T('timelineSoon')}</h3>
              <span className="badge" style={{ background: 'var(--warning-50)', color: 'var(--warning-600)' }}>{soonSchemes.length}</span>
            </div>
            <div className="flex flex-col gap-3">
              {soonSchemes.map(s => <SchemeCard key={s.id} scheme={s} language={language} />)}
            </div>
          </div>
        )}

        {futureSchemes.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-3">
              <Circle size={18} style={{ color: 'var(--neutral-400)' }} />
              <h3 className="font-bold" style={{ color: 'var(--neutral-900)' }}>{T('timelineFuture')}</h3>
            </div>
            <div className="flex flex-col gap-3">
              {futureSchemes.map(s => <SchemeCard key={s.id} scheme={s} language={language} />)}
            </div>
          </div>
        )}

        {/* Cascade Chains */}
        {r.cascadeChains?.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-3">
              <Link2 size={18} style={{ color: 'var(--accent-500)' }} />
              <h3 className="font-bold" style={{ color: 'var(--neutral-900)' }}>{T('cascadeTitle')}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {r.cascadeChains.map((chain, i) => (
                <div key={i} className="card p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold" style={{ color: 'var(--primary-600)' }}>{chain.parent}</span>
                    <ArrowRight size={14} style={{ color: 'var(--neutral-400)' }} />
                    <span className="font-semibold" style={{ color: 'var(--accent-600)' }}>{chain.childName}</span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--neutral-500)' }}>{chain.relationship}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sunset Alerts */}
        {r.sunsetAlerts?.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={18} style={{ color: 'var(--danger-500)' }} />
              <h3 className="font-bold" style={{ color: 'var(--neutral-900)' }}>{T('sunsetTitle')}</h3>
            </div>
            {r.sunsetAlerts.map((alert, i) => (
              <div key={i} className="card p-4 mb-3" style={{ borderLeft: '4px solid var(--danger-500)' }}>
                <h4 className="font-semibold text-sm" style={{ color: 'var(--danger-600)' }}>{alert.schemeName}</h4>
                <p className="text-xs mt-1" style={{ color: 'var(--neutral-600)' }}>{alert.alert}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-medium" style={{ color: 'var(--danger-500)' }}>Deadline: {alert.deadline}</span>
                  <div className="h-1.5 flex-1 rounded-full" style={{ background: 'var(--neutral-200)' }}>
                    <div className="h-full rounded-full" style={{ width: `${alert.confidence}%`, background: 'var(--danger-500)' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Document Gaps */}
        {r.documentGaps?.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={18} style={{ color: 'var(--primary-500)' }} />
              <h3 className="font-bold" style={{ color: 'var(--neutral-900)' }}>{T('docGapTitle')}</h3>
            </div>
            <div className="progress-bar mb-3">
              <div className="progress-bar-fill" style={{ width: `${((profile.documents?.length || 0) / 12) * 100}%` }} />
            </div>
            <span className="text-xs" style={{ color: 'var(--neutral-500)' }}>{profile.documents?.length || 0} / 12 {T('docsReady')}</span>
            <div className="flex flex-col gap-3 mt-3">
              {r.documentGaps.map((gap, i) => (
                <div key={i} className="card p-4">
                  <h4 className="font-semibold text-sm" style={{ color: 'var(--neutral-800)' }}>{gap.document}</h4>
                  <p className="text-xs mt-1" style={{ color: 'var(--neutral-600)' }}>📋 {gap.howToGet}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: 'var(--neutral-500)' }}>
                    <span>⏱ {gap.timeRequired}</span>
                    {gap.unlocksSchemes && <span>🔓 Unlocks: {gap.unlocksSchemes.join(', ')}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat CTA */}
        <div className="mt-8 mb-8">
          <Link href="/chat" className="btn btn-accent w-full btn-lg">
            <Sparkles size={18} />
            Have questions? Ask our AI Assistant
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
