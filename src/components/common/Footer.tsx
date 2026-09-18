'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Zap, Mail, Send, ShieldCheck, Phone, MapPin, CheckCircle2, RotateCcw, Truck } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';

export function Footer() {
  const { language, t } = useI18n();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => setIsSubscribed(false), 5000);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-border mt-20 transition-colors">
      {/* Top Value Propositions */}
      <div className="border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-start">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-foreground">{t.home.trustBadge1Title}</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">{t.home.trustBadge1Desc}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-foreground">{t.home.trustBadge2Title}</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">{t.home.trustBadge2Desc}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-foreground">{t.home.trustBadge3Title}</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">{t.home.trustBadge3Desc}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-foreground">{t.home.trustBadge4Title}</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">{t.home.trustBadge4Desc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-start">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-3.5">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 flex items-center justify-center">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-foreground">
                {language === 'ar' ? 'حكيم تك' : 'HAKIM TECH'}
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              {t.footer.aboutText}
            </p>
            <div className="pt-2 text-xs text-muted-foreground space-y-1.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>{language === 'ar' ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Kingdom of Saudi Arabia'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span dir="ltr">+966 800 123 4567</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {t.footer.quickLinks}
            </h5>
            <ul className="space-y-2 text-xs text-muted-foreground font-medium">
              <li>
                <Link href="/products" className="hover:text-foreground transition-colors">
                  {t.nav.shop}
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-foreground transition-colors">
                  {t.nav.myOrders}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-foreground transition-colors">
                  {t.nav.adminDashboard}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {t.footer.categories}
            </h5>
            <ul className="space-y-2 text-xs text-muted-foreground font-medium">
              <li>
                <Link href="/products?category=audio" className="hover:text-foreground transition-colors">
                  {t.nav.audio}
                </Link>
              </li>
              <li>
                <Link href="/products?category=chargers" className="hover:text-foreground transition-colors">
                  {t.nav.chargers}
                </Link>
              </li>
              <li>
                <Link href="/products?category=wearables" className="hover:text-foreground transition-colors">
                  {t.nav.wearables}
                </Link>
              </li>
              <li>
                <Link href="/products?category=power" className="hover:text-foreground transition-colors">
                  {t.nav.power}
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="hover:text-foreground transition-colors">
                  {t.nav.accessories}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {t.home.newsletterTitle}
            </h5>
            <p className="text-xs text-muted-foreground">
              {t.home.newsletterSubtitle}
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.home.newsletterPlaceholder}
                  className="w-full h-9 ps-9 pe-3 text-xs bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button type="submit" variant="primary" size="sm" className="w-full h-9 text-xs">
                {t.home.newsletterBtn}
              </Button>
            </form>

            {isSubscribed && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                {t.home.newsletterSuccess}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar & Payments */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>{t.footer.copyright.replace('{year}', currentYear.toString())}</p>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-background border border-border font-bold text-[10px] text-foreground">MADA</span>
            <span className="px-2 py-0.5 rounded bg-background border border-border font-bold text-[10px] text-foreground">APPLE PAY</span>
            <span className="px-2 py-0.5 rounded bg-background border border-border font-bold text-[10px] text-foreground">VISA</span>
            <span className="px-2 py-0.5 rounded bg-background border border-border font-bold text-[10px] text-foreground">MASTERCARD</span>
            <span className="px-2 py-0.5 rounded bg-background border border-border font-bold text-[10px] text-foreground">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
