'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import { useProductStore } from '@/store/productStore';
import { useI18n } from '@/context/I18nContext';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export function ProductModal({ isOpen, onClose, productToEdit }: ProductModalProps) {
  const { language, t } = useI18n();
  const categories = useProductStore((s) => s.categories);
  const createProduct = useProductStore((s) => s.createProduct);
  const updateProduct = useProductStore((s) => s.updateProduct);

  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descAr, setDescAr] = useState('');
  const [price, setPrice] = useState<number>(299);
  const [comparePrice, setComparePrice] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState<string>('chargers');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState<number>(20);
  const [thumbnail, setThumbnail] = useState('');
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNew, setIsNew] = useState(true);

  useEffect(() => {
    if (productToEdit) {
      setTitleEn(productToEdit.title.en);
      setTitleAr(productToEdit.title.ar);
      setDescEn(productToEdit.description.en);
      setDescAr(productToEdit.description.ar);
      setPrice(productToEdit.price);
      setComparePrice(productToEdit.compareAtPrice);
      setCategory(productToEdit.category);
      setSku(productToEdit.sku);
      setStock(productToEdit.stock);
      setThumbnail(productToEdit.thumbnail);
      setIsBestSeller(Boolean(productToEdit.isBestSeller));
      setIsNew(Boolean(productToEdit.isNew));
    } else {
      setTitleEn('');
      setTitleAr('');
      setDescEn('');
      setDescAr('');
      setPrice(299);
      setComparePrice(350);
      setCategory('chargers');
      setSku(`HKM-TECH-${Math.floor(100 + Math.random() * 900)}`);
      setStock(20);
      setThumbnail('https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80');
      setIsBestSeller(false);
      setIsNew(true);
    }
  }, [productToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn.trim() || !titleAr.trim() || !sku.trim()) return;

    try {
      if (productToEdit) {
        await updateProduct(productToEdit.id, {
          title: { en: titleEn, ar: titleAr },
          description: { en: descEn, ar: descAr },
          price,
          compareAtPrice: comparePrice || undefined,
          category,
          sku,
          stock,
          thumbnail,
          images: productToEdit.images.length > 0 ? productToEdit.images : [thumbnail],
          isBestSeller,
          isNew,
        });
      } else {
        await createProduct({
          sku,
          title: { en: titleEn, ar: titleAr },
          description: { en: descEn, ar: descAr },
          features: {
            en: ['High-performance GaN & Smart Power Delivery', '2-Year Official Manufacturer Warranty'],
            ar: ['شحن سريع بتقنية GaN وإدارة طاقة ذكية', 'ضمان رسمي لمدة سنتين ضد عيوب التصنيع'],
          },
          price,
          compareAtPrice: comparePrice || undefined,
          category,
          images: [thumbnail],
          thumbnail,
          stock,
          rating: 5.0,
          reviewCount: 0,
          isFeatured: true,
          isNew,
          isBestSeller,
          tags: [category, 'electronics', 'tech'],
        });
      }

      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={productToEdit ? t.admin.products.editProduct : t.admin.products.addNew}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-start">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t.admin.products.form.titleEn}
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            required
            placeholder="e.g. 65W GaN Fast Wall Charger"
          />

          <Input
            label={t.admin.products.form.titleAr}
            value={titleAr}
            onChange={(e) => setTitleAr(e.target.value)}
            required
            placeholder="مثال: شاحن جداري 65W GaN سريع"
          />

          <div className="sm:col-span-2 space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.admin.products.form.descEn}
            </label>
            <textarea
              value={descEn}
              onChange={(e) => setDescEn(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-input bg-card p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.admin.products.form.descAr}
            </label>
            <textarea
              value={descAr}
              onChange={(e) => setDescAr(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-input bg-card p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <Input
            label={t.admin.products.form.price}
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />

          <Input
            label={t.admin.products.form.comparePrice}
            type="number"
            value={comparePrice || ''}
            onChange={(e) => setComparePrice(e.target.value ? Number(e.target.value) : undefined)}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.admin.products.form.category}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-11 px-3 text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {language === 'ar' ? c.name.ar : c.name.en}
                </option>
              ))}
            </select>
          </div>

          <Input
            label={t.admin.products.form.sku}
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            required
          />

          <Input
            label={t.admin.products.form.stock}
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            required
          />

          <Input
            label={t.admin.products.form.imageUrl}
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            required
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={isBestSeller}
              onChange={(e) => setIsBestSeller(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <span>{t.admin.products.form.isBestSeller}</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={isNew}
              onChange={(e) => setIsNew(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <span>{t.admin.products.form.isNew}</span>
          </label>
        </div>

        <div className="pt-4 border-t border-border flex justify-end gap-2.5">
          <Button type="button" variant="outline" onClick={onClose}>
            {t.common.cancel}
          </Button>
          <Button type="submit" variant="primary">
            {t.common.save}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
