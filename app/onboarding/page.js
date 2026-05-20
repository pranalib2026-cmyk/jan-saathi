'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '../lib/store';
import { t } from '../lib/translations';
import { indianStates, stateDistricts, occupationIcons, commonSchemes, religions, disabilityTypes, rationCardTypes } from '../lib/data';
import Header from '../components/Header';
import { ArrowLeft, ArrowRight, HelpCircle, Check, User, Users, Briefcase, FileText, Target, BookOpen } from 'lucide-react';

const sections = [
  { id: 'identity', icon: User, key: 'sectionIdentity' },
  { id: 'household', icon: Users, key: 'sectionHousehold' },
  { id: 'economic', icon: Briefcase, key: 'sectionEconomic' },
  { id: 'documents', icon: FileText, key: 'sectionDocuments' },
  { id: 'currentSchemes', icon: BookOpen, key: 'sectionCurrentSchemes' },
  { id: 'goals', icon: Target, key: 'sectionGoals' },
];

function OptionButton({ selected, onClick, children, style }) {
  return (
    <button onClick={onClick} className="text-left p-4 rounded-xl border-2 transition-all" style={{
      borderColor: selected ? 'rgba(61,129,227,0.7)' : 'rgba(255,255,255,0.12)',
      background: selected ? 'rgba(61,129,227,0.18)' : 'rgba(255,255,255,0.04)',
      cursor: 'pointer', width: '100%', ...style
    }}>
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{
          borderColor: selected ? 'rgba(61,129,227,0.85)' : 'rgba(255,255,255,0.16)',
          background: selected ? 'rgba(61,129,227,1)' : 'transparent'
        }}>
          {selected && <Check size={12} color="white" />}
        </div>
        <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.86)' }}>{children}</span>
      </div>
    </button>
  );
}

function CheckboxButton({ checked, onChange, children, emoji }) {
  return (
    <button onClick={() => onChange(!checked)} className="text-left p-3 rounded-xl border-2 transition-all" style={{
      borderColor: checked ? 'rgba(61,129,227,0.7)' : 'rgba(255,255,255,0.12)',
      background: checked ? 'rgba(61,129,227,0.18)' : 'rgba(255,255,255,0.04)',
      cursor: 'pointer', width: '100%',
    }}>
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0" style={{
          borderColor: checked ? 'rgba(61,129,227,0.85)' : 'rgba(255,255,255,0.16)',
          background: checked ? 'rgba(61,129,227,1)' : 'transparent',
          borderRadius: 4,
        }}>
          {checked && <Check size={12} color="white" />}
        </div>
        {emoji && <span>{emoji}</span>}
        <span className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{children}</span>
      </div>
    </button>
  );
}

function Tooltip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex ml-1">
      <button onClick={() => setShow(!show)} className="flex items-center" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        <HelpCircle size={15} style={{ color: 'rgba(255,255,255,0.5)' }} />
      </button>
      {show && (
        <div className="absolute left-0 bottom-full mb-2 p-3 rounded-lg shadow-lg text-xs z-10 animate-fade-in-down glass-dark" style={{ width: 250 }}>
          {text}
          <button onClick={() => setShow(false)} className="block mt-2 text-xs underline" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 0 }}>Got it</button>
        </div>
      )}
    </span>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { language, profile, updateProfile, onboardingStep, setOnboardingStep, setOnboardingComplete } = useStore();
  const step = onboardingStep;
  const T = (key) => t(language, key);

  const progress = ((step + 1) / sections.length) * 100;

  const goNext = () => {
    if (step < sections.length - 1) setOnboardingStep(step + 1);
    else { setOnboardingComplete(true); router.push('/dashboard'); }
  };
  const goBack = () => { if (step > 0) setOnboardingStep(step - 1); };

  const districts = stateDistricts[profile.state] || [];

  return (
    <div className="min-h-screen" style={{ background: 'transparent' }}>
      <Header />
      <div style={{ paddingTop: 80, maxWidth: 640, marginLeft: 'auto', marginRight: 'auto', paddingLeft: 16, paddingRight: 16, paddingBottom: 100 }}>
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium" style={{ color: 'var(--neutral-500)' }}>Step {step + 1} of {sections.length}</span>
            <span className="text-xs font-medium" style={{ color: 'var(--primary-600)' }}>{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div>
          <div className="flex gap-1 mt-3">
            {sections.map((s, i) => (
              <button key={s.id} onClick={() => setOnboardingStep(i)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-all" style={{
                background: i === step ? 'var(--primary-50)' : i < step ? 'var(--success-50)' : 'transparent',
                color: i === step ? 'var(--primary-600)' : i < step ? 'var(--success-600)' : 'var(--neutral-400)',
                border: 'none', cursor: 'pointer',
              }}>
                {i < step ? <Check size={12} /> : <s.icon size={12} />}
                <span className="hidden sm:inline">{T(s.key)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section Title */}
        <h2 className="text-2xl font-bold mb-6 animate-fade-in" style={{ color: 'white' }}>{T(sections[step].key)}</h2>

        {/* SECTION A: Identity */}
        {step === 0 && (
          <div className="flex flex-col gap-5 animate-fade-in-up">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>{T('fullName')}</label>
              <input className="input" placeholder={T('fullNamePlaceholder')} value={profile.fullName} onChange={e => updateProfile({ fullName: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>{T('age')}</label>
              <input className="input" type="number" min="1" max="120" placeholder={T('agePlaceholder')} value={profile.age} onChange={e => updateProfile({ age: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>{T('gender')}</label>
              <div className="grid grid-cols-3 gap-3">
                {['male', 'female', 'other'].map(g => (
                  <OptionButton key={g} selected={profile.gender === g} onClick={() => updateProfile({ gender: g })}>
                    {T(`gender${g.charAt(0).toUpperCase() + g.slice(1)}`)}
                  </OptionButton>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>{T('state')}</label>
              <select className="input" value={profile.state} onChange={e => updateProfile({ state: e.target.value, district: '' })}>
                <option value="">{T('selectState')}</option>
                {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {profile.state && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>{T('district')}</label>
                <select className="input" value={profile.district} onChange={e => updateProfile({ district: e.target.value })}>
                  <option value="">{T('selectDistrict')}</option>
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>{T('blockVillage')}</label>
              <input className="input" placeholder={T('blockVillagePlaceholder')} value={profile.blockVillage} onChange={e => updateProfile({ blockVillage: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>
                {T('community')} <Tooltip text={T('communityTooltip')} />
              </label>
              <div className="grid grid-cols-1 gap-2">
                {['General', 'OBC', 'SC', 'ST', 'Minority'].map(c => (
                  <OptionButton key={c} selected={profile.community === c} onClick={() => updateProfile({ community: c })}>
                    {T(`community${c}`)}
                  </OptionButton>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>{T('maritalStatus')}</label>
              <div className="grid grid-cols-2 gap-2">
                {['Single', 'Married', 'Widowed', 'Divorced'].map(m => (
                  <OptionButton key={m} selected={profile.maritalStatus === m.toLowerCase()} onClick={() => updateProfile({ maritalStatus: m.toLowerCase() })}>
                    {T(`marital${m}`)}
                  </OptionButton>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION B: Household */}
        {step === 1 && (
          <div className="flex flex-col gap-5 animate-fade-in-up">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>
                {T('familyMembers')} <Tooltip text={T('familyMembersTooltip')} />
              </label>
              <div className="flex items-center gap-4">
                <button className="btn btn-secondary btn-sm" onClick={() => updateProfile({ familyMembers: Math.max(1, profile.familyMembers - 1) })}>−</button>
                <span className="text-3xl font-bold" style={{ color: 'var(--primary-600)', minWidth: 40, textAlign: 'center' }}>{profile.familyMembers}</span>
                <button className="btn btn-secondary btn-sm" onClick={() => updateProfile({ familyMembers: profile.familyMembers + 1 })}>+</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>{T('headOfHousehold')}</label>
              <div className="grid grid-cols-2 gap-3">
                <OptionButton selected={profile.isHeadOfHousehold === true} onClick={() => updateProfile({ isHeadOfHousehold: true })}>{T('yes')}</OptionButton>
                <OptionButton selected={profile.isHeadOfHousehold === false} onClick={() => updateProfile({ isHeadOfHousehold: false })}>{T('no')}</OptionButton>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>{T('anyDisability')}</label>
              <div className="grid grid-cols-2 gap-3">
                <OptionButton selected={profile.hasDisability === true} onClick={() => updateProfile({ hasDisability: true })}>{T('yes')}</OptionButton>
                <OptionButton selected={profile.hasDisability === false} onClick={() => updateProfile({ hasDisability: false })}>{T('no')}</OptionButton>
              </div>
            </div>
            {profile.hasDisability && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>{T('disabilityType')}</label>
                <select className="input" value={profile.disabilityType} onChange={e => updateProfile({ disabilityType: e.target.value })}>
                  <option value="">Select type</option>
                  {disabilityTypes.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>{T('anySeniorCitizen')}</label>
              <div className="grid grid-cols-2 gap-3">
                <OptionButton selected={profile.hasSeniorCitizen === true} onClick={() => updateProfile({ hasSeniorCitizen: true })}>{T('yes')}</OptionButton>
                <OptionButton selected={profile.hasSeniorCitizen === false} onClick={() => updateProfile({ hasSeniorCitizen: false })}>{T('no')}</OptionButton>
              </div>
            </div>
          </div>
        )}

        {/* SECTION C: Economic */}
        {step === 2 && (
          <div className="flex flex-col gap-5 animate-fade-in-up">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>{T('occupation')}</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(occupationIcons).map(([key, emoji]) => (
                  <OptionButton key={key} selected={profile.occupation === key} onClick={() => updateProfile({ occupation: key })}>
                    <span>{emoji} {T(`occupations.${key}`)}</span>
                  </OptionButton>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>{T('annualIncome')}</label>
              <div className="grid grid-cols-1 gap-2">
                {[['below1L','incomeBelow1L'], ['1to2_5L','income1to2_5L'], ['2_5to5L','income2_5to5L'], ['above5L','incomeAbove5L']].map(([val, key]) => (
                  <OptionButton key={val} selected={profile.annualIncome === val} onClick={() => updateProfile({ annualIncome: val })}>{T(key)}</OptionButton>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>{T('bplCard')}</label>
              <div className="grid grid-cols-3 gap-2">
                <OptionButton selected={profile.hasBplCard === true} onClick={() => updateProfile({ hasBplCard: true })}>{T('yes')}</OptionButton>
                <OptionButton selected={profile.hasBplCard === false} onClick={() => updateProfile({ hasBplCard: false })}>{T('no')}</OptionButton>
                <OptionButton selected={profile.hasBplCard === 'dontKnow'} onClick={() => updateProfile({ hasBplCard: 'dontKnow' })}>{T('dontKnow')}</OptionButton>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>{T('ownLand')}</label>
              <div className="grid grid-cols-2 gap-3">
                <OptionButton selected={profile.ownsLand === true} onClick={() => updateProfile({ ownsLand: true })}>{T('yes')}</OptionButton>
                <OptionButton selected={profile.ownsLand === false} onClick={() => updateProfile({ ownsLand: false })}>{T('no')}</OptionButton>
              </div>
            </div>
            {profile.ownsLand && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>{T('landAcres')}</label>
                  <input className="input" type="number" min="0" step="0.5" value={profile.landAcres} onChange={e => updateProfile({ landAcres: e.target.value })} placeholder="e.g. 2.5" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>{T('landType')}</label>
                  <div className="flex flex-col gap-2">
                    <OptionButton selected={profile.landType === 'irrigated'} onClick={() => updateProfile({ landType: 'irrigated' })}>{T('irrigated')}</OptionButton>
                    <OptionButton selected={profile.landType === 'rainfed'} onClick={() => updateProfile({ landType: 'rainfed' })}>{T('rainfed')}</OptionButton>
                  </div>
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>{T('ownHome')}</label>
              <div className="grid grid-cols-3 gap-2">
                <OptionButton selected={profile.ownsHome === 'owned'} onClick={() => updateProfile({ ownsHome: 'owned' })}>{T('homeOwned')}</OptionButton>
                <OptionButton selected={profile.ownsHome === 'rented'} onClick={() => updateProfile({ ownsHome: 'rented' })}>{T('homeRented')}</OptionButton>
                <OptionButton selected={profile.ownsHome === 'no'} onClick={() => updateProfile({ ownsHome: 'no' })}>{T('homeNo')}</OptionButton>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--neutral-700)' }}>{T('bankAccount')}</label>
              <div className="grid grid-cols-1 gap-2">
                <OptionButton selected={profile.bankAccount === 'janDhan'} onClick={() => updateProfile({ bankAccount: 'janDhan' })}>{T('janDhan')}</OptionButton>
                <OptionButton selected={profile.bankAccount === 'regular'} onClick={() => updateProfile({ bankAccount: 'regular' })}>{T('regularBank')}</OptionButton>
                <OptionButton selected={profile.bankAccount === 'none'} onClick={() => updateProfile({ bankAccount: 'none' })}>{T('noBank')}</OptionButton>
              </div>
            </div>
          </div>
        )}

        {/* SECTION D: Documents */}
        {step === 3 && (
          <div className="animate-fade-in-up">
            <p className="text-sm mb-4" style={{ color: 'var(--neutral-600)' }}>
              {T('documentsIntro')} <Tooltip text={T('documentsTooltip')} />
            </p>
            <div className="grid grid-cols-1 gap-2">
              {['aadhaar','rationCard','voterId','mgnrega','pmKisan','kcc','landRecords','casteCert','incomeCert','birthCert','udidCert','eShram'].map(doc => (
                <CheckboxButton key={doc} checked={profile.documents.includes(doc)}
                  onChange={(checked) => {
                    const docs = checked ? [...profile.documents, doc] : profile.documents.filter(d => d !== doc);
                    updateProfile({ documents: docs });
                  }}>
                  {T(doc)}
                </CheckboxButton>
              ))}
            </div>
          </div>
        )}

        {/* SECTION E: Current Schemes */}
        {step === 4 && (
          <div className="animate-fade-in-up">
            <p className="text-sm mb-4" style={{ color: 'var(--neutral-600)' }}>
              {T('currentSchemesIntro')} <Tooltip text={T('currentSchemesTooltip')} />
            </p>
            <div className="grid grid-cols-1 gap-2">
              {commonSchemes.slice(0, 15).map(scheme => (
                <CheckboxButton key={scheme} checked={profile.currentSchemes.includes(scheme)}
                  onChange={(checked) => {
                    const schemes = checked ? [...profile.currentSchemes, scheme] : profile.currentSchemes.filter(s => s !== scheme);
                    updateProfile({ currentSchemes: schemes });
                  }}>
                  {scheme}
                </CheckboxButton>
              ))}
            </div>
          </div>
        )}

        {/* SECTION F: Goals */}
        {step === 5 && (
          <div className="animate-fade-in-up">
            <p className="text-sm mb-4" style={{ color: 'var(--neutral-600)' }}>{T('goalsIntro')}</p>
            <div className="grid grid-cols-1 gap-2">
              {[
                { key: 'farm', emoji: '🌾' }, { key: 'education', emoji: '📚' },
                { key: 'housing', emoji: '🏠' }, { key: 'health', emoji: '💊' },
                { key: 'business', emoji: '💼' }, { key: 'pension', emoji: '👵' },
              ].map(goal => (
                <CheckboxButton key={goal.key} emoji={goal.emoji} checked={profile.goals.includes(goal.key)}
                  onChange={(checked) => {
                    const goals = checked ? [...profile.goals, goal.key] : profile.goals.filter(g => g !== goal.key);
                    updateProfile({ goals });
                  }}>
                  {T(`goal${goal.key.charAt(0).toUpperCase() + goal.key.slice(1)}`)}
                </CheckboxButton>
              ))}
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button onClick={goBack} className="btn btn-secondary flex-1">
              <ArrowLeft size={16} /> {T('back')}
            </button>
          )}
          <button onClick={goNext} className="btn btn-primary flex-1">
            {step === sections.length - 1 ? T('submit') : T('next')}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
