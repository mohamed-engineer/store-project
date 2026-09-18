/**
 * Coupon Management Utilities
 * Helper functions for coupon validation and application
 */

import { couponsService } from './supabaseServices';
import { Coupon } from '@/types';

export interface CouponValidationResult {
  success: boolean;
  coupon?: Coupon;
  error?: string;
}

/**
 * Validate a coupon code and check eligibility
 */
export async function validateCoupon(
  code: string,
  subtotal?: number
): Promise<CouponValidationResult> {
  try {
    const coupon = await couponsService.validate(code);

    // Check minimum spend requirement
    if (subtotal !== undefined && coupon.minSpend && subtotal < coupon.minSpend) {
      return {
        success: false,
        error: `Minimum spend of ${coupon.minSpend} SAR required`,
      };
    }

    return {
      success: true,
      coupon,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid coupon code',
    };
  }
}

/**
 * Calculate discount amount based on coupon type
 */
export function calculateDiscount(coupon: Coupon, subtotal: number): number {
  if (coupon.discountType === 'percentage') {
    const discount = (subtotal * coupon.discountValue) / 100;
    // Apply maximum discount cap if set
    if (coupon.maxDiscount) {
      return Math.min(discount, coupon.maxDiscount);
    }
    return discount;
  } else {
    // Fixed discount
    return Math.min(coupon.discountValue, subtotal);
  }
}

/**
 * Format coupon description based on language
 */
export function getCouponDescription(coupon: Coupon, language: 'en' | 'ar' = 'en'): string {
  return language === 'ar' ? coupon.description?.ar || '' : coupon.description?.en || '';
}

/**
 * Format coupon display value
 */
export function formatCouponValue(coupon: Coupon): string {
  if (coupon.discountType === 'percentage') {
    return `${coupon.discountValue}%`;
  } else {
    return `SAR ${coupon.discountValue}`;
  }
}

/**
 * Check if coupon has expired
 */
export function isCouponExpired(coupon: Coupon): boolean {
  if (!coupon.expiresAt) return false;
  return new Date(coupon.expiresAt) < new Date();
}
