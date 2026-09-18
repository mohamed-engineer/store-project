'use client';

import React, { useState } from 'react';
import { Star, CheckCircle, Plus, Image as ImageIcon } from 'lucide-react';
import { Review, Product } from '@/types';
import { useProductStore } from '@/store/productStore';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { formatDate } from '@/lib/utils';

interface ReviewsSectionProps {
  product: Product;
}

export function ReviewsSection({ product }: ReviewsSectionProps) {
  const { language, t } = useI18n();
  const reviews = useProductStore((s) => s.getReviewsByProductId(product.id));
  const addReview = useProductStore((s) => s.addReview);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  // Rating distribution calculation
  const totalReviews = reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage: totalReviews > 0 ? Math.round((reviews.filter((r) => r.rating === star).length / totalReviews) * 100) : 0,
  }));

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) return;

    addReview({
      productId: product.id,
      userName: userName.trim(),
      rating,
      title: title.trim() || (language === 'ar' ? 'أداء ممتاز' : 'Great Performance'),
      comment: comment.trim(),
      verifiedPurchase: true,
    });

    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setIsModalOpen(false);
      setUserName('');
      setTitle('');
      setComment('');
      setRating(5);
    }, 1500);
  };

  return (
    <section className="py-12 border-t border-border mt-16 text-start">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
            {t.product.customerReviews}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {t.product.rating.replace('{rating}', product.rating.toString()).replace('{count}', totalReviews.toString())}
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          size="md"
          className="gap-2 self-start md:self-auto text-xs font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>{t.product.writeReview}</span>
        </Button>
      </div>

      {/* Review Metrics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 rounded-3xl bg-slate-50/70 dark:bg-slate-900/40 border border-border mb-10">
        {/* Left Big Score */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b lg:border-b-0 lg:border-e border-border">
          <div className="text-5xl font-black text-foreground">{product.rating}</div>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-5 h-5 ${
                  s <= Math.round(product.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-border'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {language === 'ar' ? `بناءً على ${totalReviews} تقييم موثق` : `Based on ${totalReviews} verified reviews`}
          </p>
        </div>

        {/* Right Star Distribution Bars */}
        <div className="lg:col-span-8 space-y-2.5 flex flex-col justify-center">
          {ratingCounts.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 w-12 text-muted-foreground font-semibold">
                <span>{star}</span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </div>

              <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-900 dark:bg-white rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <span className="w-10 text-end text-muted-foreground font-mono">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border rounded-3xl text-muted-foreground">
            <p className="text-sm">{t.product.noReviewsYet}</p>
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 sm:p-6 rounded-2xl bg-card border border-border space-y-2.5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">{rev.userName}</span>
                    {rev.verifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle className="w-3 h-3" />
                        {t.product.verifiedBuyer}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-border'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  {formatDate(rev.date, language)}
                </span>
              </div>

              {rev.title && (
                <h4 className="text-sm font-bold text-foreground">{rev.title}</h4>
              )}

              <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed">
                {rev.comment}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Write Review Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t.product.reviewModalTitle}
        maxWidth="lg"
      >
        {submittedMessage ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-foreground">{t.product.reviewSubmitted}</h4>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Interactive Star Picker */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t.product.reviewRatingLabel}
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-muted-foreground hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-border'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <Input
              label={language === 'ar' ? 'الاسم الكامل' : 'Your Name'}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder={language === 'ar' ? 'مثال: محمد القحطاني' : 'e.g. Sultan Al-Otaibi'}
              required
            />

            <Input
              label={t.product.reviewTitleLabel}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={language === 'ar' ? 'عنوان موجز لتجربتك' : 'Summary of your experience'}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t.product.reviewCommentLabel}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                required
                placeholder={language === 'ar' ? 'اكتب رأيك بالتفصيل في سرعة الشحن، جودة الصوت، وسهولة الاستخدام...' : 'Detail your thoughts on charging speed, build quality, usability...'}
                className="w-full rounded-xl border border-input bg-card p-3 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                {t.common.cancel}
              </Button>
              <Button type="submit" variant="primary">
                {t.product.submitReview}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </section>
  );
}
