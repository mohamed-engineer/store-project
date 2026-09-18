'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  Star,
  Layers,
  Filter,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Loader2,
} from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { useI18n } from '@/context/I18nContext';
import { ProductModal } from '@/components/admin/ProductModal';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { exportProductsToCSV } from '@/lib/exportUtils';

export default function AdminProductsPage() {
  const { language, t, formatPrice } = useI18n();
  const products = useProductStore((s) => s.products);
  const categories = useProductStore((s) => s.categories);
  const deleteProduct = useProductStore((s) => s.deleteProduct);
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const isLoading = useProductStore((s) => s.isLoading);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // Delete confirm modal
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // جلب المنتجات من Supabase فور تحميل الصفحة
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
      if (!matchCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const titleMatch =
        p.title.en.toLowerCase().includes(q) ||
        p.title.ar.toLowerCase().includes(q);
      const skuMatch = p.sku.toLowerCase().includes(q);

      return titleMatch || skuMatch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleOpenAdd = () => {
    setProductToEdit(null);
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setProductToEdit(product);
    setIsAddEditOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6 text-start">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
            {t.admin.products.title}
            {isLoading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {t.admin.products.subtitle} ({products.length} {t.common.items})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => exportProductsToCSV(products, language)}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            {language === 'ar' ? 'تصدير CSV' : 'Export CSV'}
          </Button>

          <Button onClick={handleOpenAdd} variant="primary" size="sm" className="gap-1.5 font-bold">
            <Plus className="w-4 h-4" />
            <span>{t.admin.products.addNew}</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-card border border-border/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.admin.products.searchProducts}
            className="w-full h-10 ps-10 pe-4 text-xs bg-muted/40 border border-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 px-3 text-xs font-semibold bg-muted/40 border border-input rounded-2xl focus:ring-2 focus:ring-primary text-foreground cursor-pointer"
          >
            <option value="all">{language === 'ar' ? 'جميع الأقسام' : 'All Categories'}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {language === 'ar' ? c.name.ar : c.name.en}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Data Table */}
      <div className="rounded-3xl bg-card border border-border/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-muted/40 border-b border-border/80 text-muted-foreground font-semibold">
              <tr>
                <th className="p-4 text-start">{t.admin.products.colImage}</th>
                <th className="p-4 text-start">{t.admin.products.colTitle}</th>
                <th className="p-4 text-start">{t.admin.products.colSku}</th>
                <th className="p-4 text-start">{t.admin.products.colCategory}</th>
                <th className="p-4 text-start">{t.admin.products.colPrice}</th>
                <th className="p-4 text-start">{t.admin.products.colStock}</th>
                <th className="p-4 text-start">{t.admin.products.colRating}</th>
                <th className="p-4 text-end">{t.admin.products.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {isLoading && products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      <span>{language === 'ar' ? 'جاري تحميل المنتجات من قاعدة البيانات...' : 'Loading products from database...'}</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-muted-foreground">
                    {language === 'ar' ? 'لا توجد منتجات مطابقة' : 'No matching products found'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/60">
                        <Image
                          src={product.thumbnail || '/placeholder.png'}
                          alt={language === 'ar' ? product.title?.ar : product.title?.en}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-4 font-bold text-foreground max-w-xs">
                      <div>{language === 'ar' ? product.title?.ar : product.title?.en}</div>
                      <div className="text-[10px] text-muted-foreground font-normal">
                        {language === 'ar' ? product.title?.en : product.title?.ar}
                      </div>
                    </td>
                    <td className="p-4 font-mono font-semibold text-muted-foreground">
                      {product.sku}
                    </td>
                    <td className="p-4 capitalize">
                      <Badge variant="default" className="text-[10px]">
                        {product.category}
                      </Badge>
                    </td>
                    <td className="p-4 font-bold text-foreground">
                      {formatPrice(product.price)}
                    </td>
                    <td className="p-4">
                      {product.stock > 5 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{product.stock}</span>
                        </span>
                      ) : product.stock > 0 ? (
                        <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{product.stock}</span>
                        </span>
                      ) : (
                        <span className="text-destructive font-semibold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>0</span>
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 font-bold text-foreground">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                      </div>
                    </td>
                    <td className="p-4 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Edit product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setProductToDelete(product)}
                          className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        productToEdit={productToEdit}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        title={t.admin.products.deleteProduct}
        maxWidth="sm"
      >
        <div className="space-y-4 text-start">
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t.admin.products.deleteConfirm}
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setProductToDelete(null)}>
              {t.common.cancel}
            </Button>
            <Button variant="destructive" size="sm" onClick={handleConfirmDelete}>
              {t.common.delete}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}