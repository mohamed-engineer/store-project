'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  User,
  ShieldCheck,
  Menu,
  X,
  Zap,
  Headphones,
  BatteryCharging,
  Watch,
  Layers,
} from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { useCartStore } from '@/store/cartStore';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';
import { InstantSearchModal } from './InstantSearchModal';
import { CartDrawer } from './CartDrawer';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const { language, t, isRtl } = useI18n();
  const { toggleCart, getItemCount } = useCartStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/products', label: t.nav.shop },
    { href: '/products?category=audio', label: t.nav.audio },
    { href: '/products?category=chargers', label: t.nav.chargers },
    { href: '/products?category=wearables', label: t.nav.wearables },
    { href: '/products?category=power', label: t.nav.power },
    { href: '/products?category=accessories', label: t.nav.accessories },
  ];

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-200 border-b',
          isScrolled
            ? 'bg-background/90 backdrop-blur-md border-border/80 shadow-sm py-2'
            : 'bg-background border-border/50 py-3'
        )}
      >
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 shrink-0">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-foreground hover:bg-muted transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Link href="/" className="flex items-center gap-2.5 group select-none min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className="text-lg font-black tracking-[-0.04em] text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {language === 'ar' ? 'حكيم' : 'HAKIM'}
                  </span>
                  <span className="text-lg font-black tracking-[-0.04em] text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {language === 'ar' ? 'تك' : 'TECH'}
                  </span>
                </div>
              </Link>
            </div>

            <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 flex-1 overflow-hidden">
              <div className="flex items-center gap-1 xl:gap-2 flex-nowrap whitespace-nowrap overflow-x-auto no-scrollbar">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 whitespace-nowrap',
                        isActive
                          ? 'text-foreground bg-slate-100 dark:bg-slate-800 font-bold shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 h-10 px-3 rounded-xl border border-border bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground text-xs transition-all shadow-sm"
                title={language === 'ar' ? 'بحث فوري (Ctrl+K)' : 'Instant Search (Ctrl+K)'}
              >
                <Search className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="hidden md:inline font-medium">{language === 'ar' ? 'بحث...' : 'Search...'}</span>
                <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-semibold text-muted-foreground bg-background border border-border rounded">
                  ⌘K
                </kbd>
              </button>

              <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-border bg-card shadow-sm">
                <LanguageSwitcher compact />
              </div>

              <ThemeToggle />

              <Link
                href="/admin"
                className="p-2 rounded-xl text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors hidden sm:flex items-center"
                title={language === 'ar' ? 'لوحة تحكم الإدارة' : 'Admin Dashboard'}
              >
                <ShieldCheck className="w-5 h-5" />
              </Link>

              <Link
                href="/account"
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:flex items-center"
                title={t.common.account}
              >
                <User className="w-5 h-5" />
              </Link>

              <button
                onClick={toggleCart}
                className="relative p-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-sm transition-all active:scale-95 flex items-center justify-center"
                aria-label={t.common.cart}
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -end-1.5 min-w-5 h-5 px-1 rounded-full bg-blue-600 text-white font-extrabold text-[10px] flex items-center justify-center border-2 border-background">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card px-4 pt-3 pb-6 mt-3 space-y-3 shadow-lg animate-in slide-in-from-top-4 duration-150">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <Link
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-foreground font-semibold px-3 py-2 rounded-xl hover:bg-muted"
              >
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{t.common.account}</span>
              </Link>

              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t.common.admin}</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Modals & Drawers */}
      <InstantSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer />
    </>
  );
}
