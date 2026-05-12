'use client';

import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import { subscribeNewsletter, type NewsletterState } from '@/app/actions/newsletter';

const socialLinks = [
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    ),
  },
  {
    name: 'X',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.01a8.16 8.16 0 004.77 1.52V7.08a4.85 4.85 0 01-1-.39z"/>
      </svg>
    ),
  },
];

const footerLinks = {
  company: [
    { label: { en: 'About Us', ar: 'من نحن' }, href: '/about' },
    { label: { en: 'Our Team', ar: 'فريقنا' }, href: '/team' },
    { label: { en: 'Careers', ar: 'الوظائف' }, href: '/careers' },
    { label: { en: 'Press', ar: 'الصحافة' }, href: '/press' },
  ],
  services: [
    { label: { en: 'VIP Trips', ar: 'رحلات VIP' }, href: '#trips' },
    { label: { en: 'Luxury Hotels', ar: 'الفنادق الفاخرة' }, href: '#hotels' },
    { label: { en: 'Transportation', ar: 'المواصلات' }, href: '#transport' },
    { label: { en: 'Nightlife', ar: 'الترفيه' }, href: '#nightlife' },
  ],
  support: [
    { label: { en: 'Help Center', ar: 'مركز المساعدة' }, href: '/help' },
    { label: { en: 'Privacy Policy', ar: 'سياسة الخصوصية' }, href: '/privacy' },
    { label: { en: 'Terms of Service', ar: 'شروط الخدمة' }, href: '/terms' },
    { label: { en: 'Contact', ar: 'اتصل بنا' }, href: '/contact' },
  ],
};

export default function Footer() {
  const { language } = useAppStore();
  const [email, setEmail] = useState('');
  const initialNewsletter: NewsletterState = { ok: false };
  const [newsletterState, newsletterAction, newsletterPending] = useActionState(
    subscribeNewsletter,
    initialNewsletter
  );
  const tr = (key: Parameters<typeof t>[0]) => t(key, language);
  const l = (obj: { en: string; ar: string }) => obj[language];

  useEffect(() => {
    if (newsletterState.ok) setEmail('');
  }, [newsletterState.ok]);

  return (
    <footer
      className="relative overflow-hidden border-t border-[rgba(201,169,110,0.1)]"
      style={{ background: 'linear-gradient(to top, #030812 0%, #0A1628 100%)' }}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#C9A96E] opacity-[0.03] blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 relative">
                <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
                  <circle cx="20" cy="20" r="18" stroke="#C9A96E" strokeWidth="1.5" />
                  <path d="M10 20 Q20 8 30 20 Q20 32 10 20Z" fill="#C9A96E" opacity="0.8" />
                  <circle cx="20" cy="20" r="3" fill="#C9A96E" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gradient-gold" style={{ fontFamily: 'var(--font-display, serif)' }}>
                PoliTrip
              </span>
            </div>
            <p className="text-[rgba(245,240,232,0.5)] text-sm leading-relaxed mb-6 max-w-xs">
              {tr('footer.tagline')} —{' '}
              {language === 'ar'
                ? 'نحن نصمم تجارب سفر لا تُنسى للضيوف الخليجيين.'
                : 'crafting unforgettable travel experiences for Gulf guests.'}
            </p>

            {/* Newsletter */}
            <div>
              <p className="text-xs uppercase tracking-widest text-[#C9A96E] mb-3">{tr('footer.newsletter')}</p>
              <form action={newsletterAction} className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={tr('footer.placeholder')}
                    className="flex-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(201,169,110,0.2)] rounded-full px-4 py-2.5 text-xs text-[rgba(245,240,232,0.8)] placeholder:text-[rgba(245,240,232,0.3)] focus:outline-none focus:border-[rgba(201,169,110,0.5)]"
                  />
                  <button
                    type="submit"
                    disabled={newsletterPending}
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-[#030812] bg-gradient-to-r from-[#E8CC9A] to-[#C9A96E] hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    {newsletterState.ok ? '✓' : newsletterPending ? '…' : tr('footer.subscribe')}
                  </button>
                </div>
                {newsletterState.error === 'invalid' ? (
                  <p className="text-[11px] text-red-400/90">{tr('footer.subscribeInvalid')}</p>
                ) : null}
                {newsletterState.error === 'server' ? (
                  <p className="text-[11px] text-red-400/90">{tr('footer.subscribeError')}</p>
                ) : null}
              </form>
            </div>

            {/* Social */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((s) => (
                <Link
                  key={s.name}
                  href={s.href}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-[rgba(201,169,110,0.2)] text-[rgba(245,240,232,0.5)] hover:text-[#C9A96E] hover:border-[rgba(201,169,110,0.5)] transition-all duration-300"
                >
                  {s.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {([
            { title: { en: 'Company', ar: 'الشركة' }, links: footerLinks.company },
            { title: { en: 'Services', ar: 'الخدمات' }, links: footerLinks.services },
            { title: { en: 'Support', ar: 'الدعم' }, links: footerLinks.support },
          ] as const).map((col) => (
            <div key={col.title.en}>
              <p className="text-xs uppercase tracking-widest text-[#C9A96E] mb-4">{l(col.title)}</p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[rgba(245,240,232,0.5)] hover:text-[rgba(245,240,232,0.9)] transition-colors"
                    >
                      {l(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact strip */}
        <div className="glass rounded-2xl p-6 mb-10 flex flex-wrap gap-6 items-center justify-between">
          <div className="flex flex-wrap gap-6">
            {[
              { label: language === 'ar' ? 'إسطنبول' : 'Istanbul', value: '+90 212 000 0000' },
              { label: language === 'ar' ? 'دبي' : 'Dubai', value: '+971 4 000 0000' },
              { label: language === 'ar' ? 'الرياض' : 'Riyadh', value: '+966 11 000 0000' },
              { label: 'WhatsApp', value: '+90 530 000 0000' },
            ].map((c) => (
              <div key={c.label}>
                <p className="text-[10px] uppercase tracking-widest text-[#C9A96E] mb-0.5">{c.label}</p>
                <p className="text-sm text-[rgba(245,240,232,0.8)] ltr-only">{c.value}</p>
              </div>
            ))}
          </div>
          <div className="text-sm text-[rgba(245,240,232,0.5)]">
            info@politrip.com
          </div>
        </div>

        {/* Bottom bar */}
        <div className="divider-gold mb-8" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[rgba(245,240,232,0.3)]">
            © {new Date().getFullYear()} PoliTrip. {tr('footer.rights')}
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-[rgba(245,240,232,0.3)]">
              {language === 'ar' ? 'مرخص في تركيا' : 'Licensed in Türkiye'}
            </span>
            <div className="flex gap-2">
              {['SA', 'AE', 'QA', 'KW', 'BH', 'OM'].map((flag) => (
                <span key={flag} className="text-xs bg-[rgba(201,169,110,0.1)] px-2 py-0.5 rounded text-[rgba(201,169,110,0.7)]">{flag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
