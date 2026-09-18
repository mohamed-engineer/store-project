'use client';

import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

export function Testimonials() {
  const { language, t } = useI18n();

  const testimonials = [
    {
      name: language === 'ar' ? 'سلطان القحطاني' : 'Sultan Al-Qahtani',
      city: language === 'ar' ? 'الرياض' : 'Riyadh',
      role: language === 'ar' ? 'مهندس برمجيات' : 'Senior Software Engineer',
      rating: 5,
      comment:
        language === 'ar'
          ? 'شاحن 100W GaN حل لي أزمة الفوضى على المكتب بالكامل، يشحن الماك بوك والآيباد بنفس السرعة وبدون أي حرارة تذكر. التوصيل كان في أقل من 24 ساعة.'
          : 'The 100W GaN desktop charger completely decluttered my workstation. It powers my MacBook Pro and iPad at maximum speeds without getting warm. Delivery was under 24 hours.',
    },
    {
      name: language === 'ar' ? 'نورة الشمري' : 'Noura Al-Shammari',
      city: language === 'ar' ? 'الدمام' : 'Dammam',
      role: language === 'ar' ? 'صانعة محتوى' : 'Tech Creator',
      rating: 5,
      comment:
        language === 'ar'
          ? 'سماعات أبيكس برو عزل الضوضاء فيها خيالي وينافس سماعات أبل وبوز بشكل مدهش. المايكروفون في المكالمات واضح جداً والتصميم خفيف ومريح.'
          : 'The Apex Pro earbuds have phenomenal ANC that easily rivals top-tier flagship headphones. Mic clarity on Zoom calls is razor sharp and the battery life is unmatched.',
    },
    {
      name: language === 'ar' ? 'فهد الغامدي' : 'Fahad Al-Ghamdi',
      city: language === 'ar' ? 'جدة' : 'Jeddah',
      role: language === 'ar' ? 'مصمم ومستخدم ماك' : 'UI Designer',
      rating: 5,
      comment:
        language === 'ar'
          ? 'منصة الشحن المغناطيسية 3 في 1 وحامل اللابتوب الألومنيوم غيروا شكل السيت اب عندي 180 درجة. جودة الخامات والتصنيع مذهلة وتستحق كل ريال.'
          : 'The 3-in-1 MagSafe stand and the aluminum laptop riser transformed my desk setup. The machining and solid build quality are truly Apple-tier.',
    },
  ];

  return (
    <section className="py-16 bg-slate-50/50 dark:bg-slate-900/30 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            {t.home.testimonialsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t.home.testimonialsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <div
              key={i}
              className="relative p-6 sm:p-7 rounded-2xl bg-card border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-start"
            >
              <div className="space-y-3.5">
                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(item.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                  "{item.comment}"
                </p>
              </div>

              <div className="pt-5 border-t border-border/60 mt-5 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>{item.name}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    {item.role} • {item.city}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
