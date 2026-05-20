'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useStore from '../lib/store';
import { t, languages } from '../lib/translations';
import { Menu, X, Globe, Home, LayoutDashboard, MessageCircle, FileText, Settings, ChevronDown } from 'lucide-react';

export default function Header({ showAnnouncement = false }) {
  const { language, setLanguage, sidebarOpen, toggleSidebar } = useStore();
  const [langOpen, setLangOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: t(language, 'navHome'), icon: Home },
    { href: '/dashboard', label: t(language, 'navDashboard'), icon: LayoutDashboard },
    { href: '/schemes', label: t(language, 'navSchemes'), icon: FileText },
    { href: '/chat', label: t(language, 'navChat'), icon: MessageCircle },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[70]">
        {showAnnouncement && (
          <div className="w-full py-3 px-4" style={{ background: 'white', borderBottom: '1px solid var(--neutral-200)' }}>
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-2 text-center text-xs sm:text-sm" style={{ color: 'var(--neutral-600)' }}>
              <span>{t(language, 'step1Desc')}</span>
              <span>{t(language, 'step2Desc')}</span>
              <span>{t(language, 'step3Desc')}</span>
            </div>
          </div>
        )}
        <div className="glass" style={{ borderBottom: '1px solid var(--neutral-200)' }}>
          <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4" style={{ minHeight: 'var(--header-height)' }}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 no-underline">
            <div className="flex items-center justify-center rounded-xl" style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))' }}>
              <span className="text-white font-bold text-lg">जन</span>
            </div>
            <div>
              <span className="font-bold text-lg" style={{ color: 'var(--neutral-900)' }}>Jan Saathi</span>
              <span className="hidden sm:inline text-xs ml-2" style={{ color: 'var(--neutral-500)' }}>{t(language, 'tagline')}</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all no-underline"
                style={{
                  color: pathname === item.href ? 'var(--primary-600)' : 'var(--neutral-600)',
                  background: pathname === item.href ? 'var(--primary-50)' : 'transparent',
                }}>
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language selector */}
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)} className="btn btn-ghost btn-sm flex items-center gap-1" aria-label="Select language">
                <Globe size={16} />
                <span className="hidden sm:inline text-xs">{languages.find(l => l.code === language)?.nativeName}</span>
                <ChevronDown size={14} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 py-2 rounded-xl shadow-xl z-50" style={{ background: 'white', border: '1px solid var(--neutral-200)', minWidth: 180 }}>
                  {languages.map(lang => (
                    <button key={lang.code} onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                      className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-colors"
                      style={{ 
                        color: language === lang.code ? 'var(--primary-600)' : 'var(--neutral-700)',
                        background: language === lang.code ? 'var(--primary-50)' : 'transparent',
                        border: 'none', cursor: 'pointer',
                      }}>
                      <span>{lang.flag}</span>
                      <span className="font-medium">{lang.nativeName}</span>
                      <span style={{ color: 'var(--neutral-400)', fontSize: 12 }}>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Mobile menu */}
            <button onClick={toggleSidebar} className="md:hidden btn btn-ghost btn-sm" aria-label="Menu">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          </div>
        </div>
      </header>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={toggleSidebar} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-xl animate-slide-left" style={{ paddingTop: showAnnouncement ? 'calc(var(--header-height) + var(--announcement-height))' : 'var(--header-height)' }}>
            <nav className="p-4 flex flex-col gap-1">
              {navItems.map(item => (
                <Link key={item.href} href={item.href} onClick={toggleSidebar}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium no-underline transition-all"
                  style={{
                    color: pathname === item.href ? 'var(--primary-600)' : 'var(--neutral-700)',
                    background: pathname === item.href ? 'var(--primary-50)' : 'transparent',
                  }}>
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}
              <hr style={{ border: 'none', borderTop: '1px solid var(--neutral-200)', margin: '8px 0' }} />
              <Link href="/settings" onClick={toggleSidebar} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm no-underline" style={{ color: 'var(--neutral-600)' }}>
                <Settings size={18} />
                {t(language, 'navSettings')}
              </Link>
            </nav>
          </div>
        </div>
      )}
      {langOpen && <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />}
    </>
  );
}
