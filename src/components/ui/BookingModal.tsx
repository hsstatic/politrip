'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from '@/hooks/useTranslations';
import { EASE_EXPO_OUT } from '@/lib/motion';

const WA_BASE = 'https://wa.me/905300709555';

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormState {
  name: string;
  destination: string;
  dates: string;
  travelers: string;
  notes: string;
}

const EMPTY: FormState = { name: '', destination: '', dates: '', travelers: '', notes: '' };

export default function BookingModal({ open, onClose }: BookingModalProps) {
  const { t, isRTL } = useTranslations();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [sent, setSent] = useState(false);

  const close = useCallback(() => {
    onClose();
    setTimeout(() => { setForm(EMPTY); setSent(false); }, 400);
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key !== 'Tab') return;
      const root = document.getElementById('booking-dialog');
      if (!root) return;
      const focusable = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handler);
    window.setTimeout(() => {
      document.getElementById('booking-name')?.focus();
    }, 50);
    return () => {
      window.removeEventListener('keydown', handler);
      previouslyFocused?.focus();
    };
  }, [open, close]);

  // Lock body scroll while modal open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const msg = [
      `Hi PoliTrip, I'd like to plan a trip!`,
      `Name: ${form.name}`,
      `Destination: ${form.destination}`,
      `Dates: ${form.dates}`,
      `Travelers: ${form.travelers}`,
      form.notes ? `Notes: ${form.notes}` : '',
    ].filter(Boolean).join('\n');

    window.open(`${WA_BASE}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    setSent(true);
  }

  const field = (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const inputCls = `w-full bg-ink/5 border border-ink/10 rounded-xl px-4 py-3 text-ink text-sm placeholder:text-ink/30 focus:outline-none focus:border-accent/50 focus:bg-ink/10 transition-all duration-200`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/75 backdrop-blur-lg"
            onClick={close}
            aria-hidden
          />

          {/* Panel */}
          <motion.div
            id="booking-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            className="relative z-10 w-full max-w-lg max-h-[92svh] overflow-y-auto rounded-2xl bg-canvas-muted border border-edge"
            style={{
              boxShadow: '0 0 80px color-mix(in srgb, var(--accent) 8%, transparent)',
            }}
            dir={isRTL ? 'rtl' : 'ltr'}
            initial={{ scale: 0.93, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: EASE_EXPO_OUT }}
          >
            {/* Top accent line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

            <div className="px-7 py-8 sm:px-9 sm:py-10">
              {/* Close */}
              <button
                type="button"
                aria-label={t('booking.close')}
                onClick={close}
                className={`absolute top-5 ${isRTL ? 'left-5' : 'right-5'} w-8 h-8 rounded-full border border-ink/15 flex items-center justify-center text-ink/40 hover:text-ink hover:border-ink/30 transition-all duration-200 text-lg leading-none`}
              >
                ×
              </button>

              <AnimatePresence mode="wait">
                {sent ? (
                  /* ── Success state ── */
                  <motion.div
                    key="success"
                    className="text-center py-8"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE_EXPO_OUT }}
                  >
                    <div
                      className="w-14 h-14 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl text-success"
                      style={{ background: 'color-mix(in srgb, var(--accent) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)' }}
                    >
                      ✓
                    </div>
                    <h2
                      className="text-2xl font-light text-ink mb-3"
                      style={{ fontFamily: 'var(--font-display, serif)' }}
                    >
                      {t('booking.successTitle')}
                    </h2>
                    <p className="text-ink/50 text-sm leading-relaxed mb-8">
                      {t('booking.successBody')}
                    </p>
                    <button
                      type="button"
                      onClick={close}
                      className="px-8 py-3 rounded-full text-[11px] uppercase tracking-[0.28em] font-bold bg-accent/15 text-accent border border-accent/30 hover:bg-accent/25 transition-all duration-200"
                    >
                      {t('booking.close')}
                    </button>
                  </motion.div>
                ) : (
                  /* ── Form state ── */
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {/* Header */}
                    <div className="mb-7">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-8 bg-gradient-to-r from-transparent to-accent" aria-hidden />
                        <span className="text-[9px] uppercase tracking-[0.42em] text-accent font-bold">PoliTrip</span>
                      </div>
                      <h2
                        id="booking-title"
                        className="text-[clamp(22px,4vw,30px)] font-light text-ink mb-2"
                        style={{ fontFamily: 'var(--font-display, serif)', letterSpacing: '-0.02em' }}
                      >
                        {t('booking.title')}
                      </h2>
                      <p className="text-ink/45 text-sm leading-relaxed">{t('booking.subtitle')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                      {/* Name */}
                      <div>
                        <label htmlFor="booking-name" className="block text-[10px] uppercase tracking-[0.3em] text-ink/40 mb-2">
                          {t('booking.name')}
                        </label>
                        <input
                          id="booking-name"
                          type="text"
                          required
                          autoComplete="name"
                          value={form.name}
                          onChange={field('name')}
                          placeholder={t('booking.namePlaceholder')}
                          className={inputCls}
                        />
                      </div>

                      {/* Destination */}
                      <div>
                        <label htmlFor="booking-destination" className="block text-[10px] uppercase tracking-[0.3em] text-ink/40 mb-2">
                          {t('booking.destination')}
                        </label>
                        <input
                          id="booking-destination"
                          type="text"
                          required
                          value={form.destination}
                          onChange={field('destination')}
                          placeholder={t('booking.destinationPlaceholder')}
                          className={inputCls}
                        />
                      </div>

                      {/* Dates + Travelers row */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.3em] text-ink/40 mb-2">
                            {t('booking.dates')}
                          </label>
                          <input
                            type="text"
                            value={form.dates}
                            onChange={field('dates')}
                            placeholder="Jun 10 – Jun 17"
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.3em] text-ink/40 mb-2">
                            {t('booking.travelers')}
                          </label>
                          <input
                            type="text"
                            value={form.travelers}
                            onChange={field('travelers')}
                            placeholder={t('booking.travelersPlaceholder')}
                            className={inputCls}
                          />
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.3em] text-ink/40 mb-2">
                          {t('booking.notes')}
                        </label>
                        <textarea
                          rows={3}
                          value={form.notes}
                          onChange={field('notes')}
                          placeholder={t('booking.notesPlaceholder')}
                          className={`${inputCls} resize-none`}
                        />
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        className="mt-2 w-full py-4 rounded-full text-[11px] font-bold tracking-[0.28em] uppercase text-on-accent bg-gradient-to-br from-accent-light via-accent to-accent-dark hover:scale-[1.02] transition-transform duration-200"
                      >
                        {t('booking.submit')}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
