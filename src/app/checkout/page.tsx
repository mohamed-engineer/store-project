'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Smartphone,
  Lock,
  ArrowRight,
  ArrowLeft,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useProductStore } from '@/store/productStore';
import { useI18n } from '@/context/I18nContext';
import { PaymentMethod, OrderItem } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { generateOrderNumber } from '@/lib/utils';

const checkoutSchema = z.object({
  fullName: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  email: z.string().email({ message: 'Valid email address required' }),
  phone: z.string().min(9, { message: 'Valid phone number required (e.g. 05XXXXXXXX)' }),
  country: z.string().min(2, { message: 'Country is required' }),
  city: z.string().min(2, { message: 'City is required' }),
  district: z.string().min(2, { message: 'District is required' }),
  streetAddress: z.string().min(5, { message: 'Street address is required' }),
  postalCode: z.string().optional(),
  notes: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  cardHolder: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { language, t, formatPrice, isRtl } = useI18n();
  const {
    items,
    getSubtotal,
    getDiscount,
    getTax,
    getShipping,
    getTotal,
    couponCode,
    clearCart,
  } = useCartStore();

  const addOrder = useProductStore((s) => s.addOrder);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mada');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const tax = getTax();
  const shipping = getShipping();
  const total = getTotal();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: 'Mohammed Al-Qahtani',
      email: 'm.qahtani@example.com',
      phone: '0501234567',
      country: 'Saudi Arabia',
      city: 'Riyadh',
      district: 'Al-Olaya',
      streetAddress: 'King Fahd Rd, Tower 4, Apt 1204',
      postalCode: '12211',
    },
  });

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">{t.cart.emptyTitle}</h2>
        <Link href="/products">
          <Button variant="primary">{t.cart.startShopping}</Button>
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);

    // Simulate fast checkout processing
    await new Promise((res) => setTimeout(res, 1000));

    const orderNumber = generateOrderNumber();

    const orderItems: OrderItem[] = items.map((item) => ({
      productId: item.product.id,
      productTitle: item.product.title,
      productImage: item.product.thumbnail,
      price: item.unitPrice,
      quantity: item.quantity,
      variantInfo: [item.selectedVolume, item.selectedSize, item.selectedColor].filter(Boolean).join(', '),
    }));

    const createdOrder = addOrder({
      orderNumber,
      customer: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        country: data.country,
        city: data.city,
        district: data.district,
        streetAddress: data.streetAddress,
        postalCode: data.postalCode,
        notes: data.notes,
      },
      items: orderItems,
      subtotal,
      discount,
      tax,
      shipping,
      total,
      status: 'processing',
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      couponCode: couponCode || undefined,
      trackingNumber: `SMSA-${Math.floor(10000000 + Math.random() * 90000000)}`,
    });

    clearCart();
    router.push(`/checkout/success?orderNumber=${createdOrder.orderNumber}`);
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-start">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {t.checkout.title}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {language === 'ar' ? 'أدخل عنوان التوصيل واختر وسيلة الدفع الآمنة' : 'Enter shipping details and choose secure payment'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-start">
            {/* Left Column: Form Fields & Payment */}
            <div className="lg:col-span-7 space-y-8">
              {/* Step 1: Shipping Address */}
              <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold text-xs flex items-center justify-center">
                    1
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-foreground">{t.checkout.step1}</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Input
                      label={t.checkout.fullName}
                      {...register('fullName')}
                      error={errors.fullName?.message}
                      placeholder={language === 'ar' ? 'محمد القحطاني' : 'Mohammed Al-Qahtani'}
                    />
                  </div>

                  <Input
                    label={t.checkout.email}
                    type="email"
                    {...register('email')}
                    error={errors.email?.message}
                    placeholder="email@example.com"
                  />

                  <Input
                    label={t.checkout.phone}
                    type="tel"
                    {...register('phone')}
                    error={errors.phone?.message}
                    placeholder="05XXXXXXXX"
                  />

                  <Input
                    label={t.checkout.country}
                    {...register('country')}
                    error={errors.country?.message}
                    placeholder={language === 'ar' ? 'المملكة العربية السعودية' : 'Saudi Arabia'}
                  />

                  <Input
                    label={t.checkout.city}
                    {...register('city')}
                    error={errors.city?.message}
                    placeholder={language === 'ar' ? 'الرياض' : 'Riyadh'}
                  />

                  <Input
                    label={t.checkout.district}
                    {...register('district')}
                    error={errors.district?.message}
                    placeholder={language === 'ar' ? 'حي العليا' : 'Al-Olaya'}
                  />

                  <Input
                    label={t.checkout.postalCode}
                    {...register('postalCode')}
                    error={errors.postalCode?.message}
                    placeholder="12211"
                  />

                  <div className="sm:col-span-2">
                    <Input
                      label={t.checkout.streetAddress}
                      {...register('streetAddress')}
                      error={errors.streetAddress?.message}
                      placeholder={language === 'ar' ? 'طريق الملك فهد، برج 4' : 'King Fahd Rd, Tower 4'}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Input
                      label={t.checkout.orderNotes}
                      {...register('notes')}
                      placeholder={language === 'ar' ? 'ملاحظات إضافية للتوصيل' : 'Optional delivery instructions'}
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold text-xs flex items-center justify-center">
                    2
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-foreground">{t.checkout.step2}</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Mada */}
                  <div
                    onClick={() => setPaymentMethod('mada')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'mada'
                        ? 'border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-950/30 shadow-sm'
                        : 'border-border bg-card hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-foreground">{t.checkout.paymentMada}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-[10px]">MADA</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{t.checkout.paymentMadaDesc}</p>
                  </div>

                  {/* Apple Pay */}
                  <div
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'apple_pay'
                        ? 'border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-950/30 shadow-sm'
                        : 'border-border bg-card hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-foreground">{t.checkout.paymentApplePay}</span>
                      <Smartphone className="w-4 h-4 text-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">{t.checkout.paymentApplePayDesc}</p>
                  </div>

                  {/* Credit Card */}
                  <div
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'credit_card'
                        ? 'border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-950/30 shadow-sm'
                        : 'border-border bg-card hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-foreground">{t.checkout.paymentCard}</span>
                      <CreditCard className="w-4 h-4 text-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">{t.checkout.paymentCardDesc}</p>
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'cod'
                        ? 'border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-950/30 shadow-sm'
                        : 'border-border bg-card hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-foreground">{t.checkout.paymentCod}</span>
                      <Banknote className="w-4 h-4 text-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">{t.checkout.paymentCodDesc}</p>
                  </div>
                </div>

                {/* Simulated Card Fields */}
                {(paymentMethod === 'credit_card' || paymentMethod === 'mada') && (
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border space-y-4 animate-in fade-in duration-200">
                    <Input
                      label={t.checkout.cardNumber}
                      placeholder="4000 1234 5678 9010"
                      leftIcon={<CreditCard className="w-4 h-4" />}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input label={t.checkout.cardExpiry} placeholder="08/28" />
                      <Input label={t.checkout.cardCvc} placeholder="123" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary & Place Order */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-6 sticky top-24">
                <h2 className="text-base font-bold text-foreground pb-3 border-b border-border">
                  {t.checkout.orderSummary} ({items.length} {t.common.items})
                </h2>

                {/* Ordered Items Preview */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 shrink-0 border border-border p-1">
                          <Image
                            src={item.product.thumbnail}
                            alt={language === 'ar' ? item.product.title.ar : item.product.title.en}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-foreground line-clamp-1">
                            {language === 'ar' ? item.product.title.ar : item.product.title.en}
                          </p>
                          <p className="text-muted-foreground text-[11px]">
                            Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor}` : ''}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-foreground">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calculations */}
                <div className="space-y-2.5 text-xs text-muted-foreground pt-4 border-t border-border">
                  <div className="flex justify-between">
                    <span>{t.cart.subtotal}</span>
                    <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                      <span>{t.cart.discount} ({couponCode})</span>
                      <span className="font-semibold">-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>{t.cart.tax}</span>
                    <span className="font-semibold text-foreground">{formatPrice(tax)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>{t.cart.shipping}</span>
                    <span className="font-semibold text-foreground">
                      {shipping === 0 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {t.cart.shippingFree}
                        </span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-black text-foreground pt-3 border-t border-border">
                    <span>{t.cart.total}</span>
                    <span className="text-foreground text-xl font-black">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Submit Order Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                  variant="primary"
                  size="lg"
                  className="w-full gap-2 shadow-sm font-bold"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isSubmitting ? t.checkout.placingOrder : t.checkout.placeOrder}</span>
                  <ArrowIcon className="w-4 h-4" />
                </Button>

                <div className="flex items-center justify-center gap-2 text-center text-[11px] text-muted-foreground pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>{t.checkout.secureNotice}</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
