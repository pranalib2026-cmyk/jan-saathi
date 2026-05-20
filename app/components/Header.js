'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useStore from '../lib/store';
import { t, languages } from '../lib/translations';
import { Menu, X, Globe, Home, LayoutDashboard, MessageCircle, FileText, Settings, ChevronDown } from 'lucide-react';

export default function Header() {
  const { language, setLanguage, sidebarOpen, toggleSidebar } = useStore();
  const [langOpen, setLangOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  const navItems = [
    { href: '/', label: t(language, 'navHome'), icon: Home },
    { href: '/dashboard', label: t(language, 'navDashboard'), icon: LayoutDashboard },
    { href: '/schemes', label: t(language, 'navSchemes'), icon: FileText },
    { href: '/chat', label: t(language, 'navChat'), icon: MessageCircle },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    if (langOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [langOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="relative flex items-center justify-between px-4 lg:px-8" style={{ height: 56, maxWidth: 'var(--max-width)', margin: '0 auto' }}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 no-underline justify-self-start">
            <div className="flex items-center justify-center rounded-xl" style={{ width: 30, height: 30, background: 'linear-gradient(135deg, var(--primary-500), var(--accent-500))', boxShadow: '0 10px 24px rgba(61,129,227,0.25)' }}>
              <span className="text-white font-bold text-sm">जन</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold tracking-tight" style={{ fontSize: 15, color: 'white' }}>Jan Saathi</span>
              <span className="hidden lg:inline text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{t(language, 'tagline')}</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center justify-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navItems.map(item => (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium transition-all no-underline"
                style={{
                  color: pathname === item.href ? 'white' : 'rgba(255,255,255,0.68)',
                  background: pathname === item.href ? 'rgba(61,129,227,0.16)' : 'transparent',
                }}>
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side — vertically centered */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Language dropdown selector */}
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setLangOpen(!langOpen)} className="btn btn-ghost btn-sm flex items-center gap-1" aria-label="Select language" style={{ height: 36, paddingLeft: 14, paddingRight: 14 }}>
                <Globe size={16} />
                <span className="hidden sm:inline text-xs">{languages.find(l => l.code === language)?.nativeName}</span>
                <ChevronDown size={14} style={{ transform: langOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 py-2 rounded-xl shadow-xl z-50 animate-fade-in-down glass-dark" style={{ minWidth: 180 }}>
                  {languages.map(lang => (
                    <button key={lang.code} onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                      className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-colors"
                      style={{
                        color: language === lang.code ? 'white' : 'rgba(255,255,255,0.72)',
                        background: language === lang.code ? 'rgba(61,129,227,0.18)' : 'transparent',
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
            <button onClick={toggleSidebar} className="md:hidden btn btn-ghost btn-sm" aria-label="Menu" style={{ height: 36, width: 40 }}>
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={toggleSidebar} />
          <div className="absolute right-0 top-0 bottom-0 w-72 glass-dark shadow-xl animate-slide-left" style={{ paddingTop: 56 }}>
            <nav className="p-4 flex flex-col gap-1">
              {navItems.map(item => (
                <Link key={item.href} href={item.href} onClick={toggleSidebar}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium no-underline transition-all"
                  style={{
                    color: pathname === item.href ? 'white' : 'rgba(255,255,255,0.72)',
                    background: pathname === item.href ? 'rgba(61,129,227,0.18)' : 'transparent',
                  }}>
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}
              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.12)', margin: '8px 0' }} />
              <Link href="/settings" onClick={toggleSidebar} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm no-underline" style={{ color: 'rgba(255,255,255,0.72)' }}>
                <Settings size={18} />
                {t(language, 'navSettings')}
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
