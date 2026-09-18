/**
 * Review Management Utilities
 * Helper functions for review creation and display
 */

import { reviewsService } from './supabaseServices';
import { Review } from '@/types';

export interface ReviewSubmissionPayload {
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  comment: string;
  verifiedPurchase?: boolean;
  images?: string[];
}

/**
 * Submit a new review
 */
export async function submitReview(payload: ReviewSubmissionPayload): Promise<Review> {
  if (!payload.productId) {
    throw new Error('Product ID is required');
  }

  if (payload.rating < 1 || payload.rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  if (!payload.comment || payload.comment.trim().length === 0) {
    throw new Error('Comment is required');
  }

  try {
    const review = await reviewsService.create({
      productId: payload.productId,
      userName: payload.userName || 'Anonymous',
      userAvatar: payload.userAvatar,
      rating: payload.rating,
      title: payload.title,
      comment: payload.comment,
      verifiedPurchase: payload.verifiedPurchase || false,
      images: payload.images,
    });

    return review;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to submit review');
  }
}

/**
 * Mark a review as helpful
 */
export async function markReviewHelpful(reviewId: string): Promise<void> {
  try {
    await reviewsService.updateHelpful(reviewId);
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to update review');
  }
}

/**
 * Calculate average rating from reviews
 */
export function calculateAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 100) / 100;
}

/**
 * Get rating distribution from reviews
 */
export function getRatingDistribution(reviews: Review[]): Record<number, number> {
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  reviews.forEach((review) => {
    distribution[review.rating]++;
  });

  return distribution;
}

/**
 * Filter reviews by rating
 */
export function filterReviewsByRating(reviews: Review[], rating: number): Review[] {
  return reviews.filter((review) => review.rating === rating);
}

/**
 * Sort reviews by most helpful
 */
export function sortReviewsByHelpful(reviews: Review[]): Review[] {
  return [...reviews].sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
}

/**
 * Sort reviews by most recent
 */
export function sortReviewsByDate(reviews: Review[]): Review[] {
  return [...reviews].sort(
    (a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
  );
}

/**
 * Format review date for display
 */
export function formatReviewDate(date: string | undefined, language: 'en' | 'ar' = 'en'): string {
  if (!date) return '';

  const reviewDate = new Date(date);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24));

  if (language === 'ar') {
    if (diffInDays === 0) return 'اليوم';
    if (diffInDays === 1) return 'أمس';
    if (diffInDays < 7) return `قبل ${diffInDays} أيام`;
    if (diffInDays < 30) return `قبل ${Math.floor(diffInDays / 7)} أسابيع`;
    return reviewDate.toLocaleDateString('ar-SA');
  } else {
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return reviewDate.toLocaleDateString('en-US');
  }
}

/**
 * Validate review before submission
 */
export function validateReview(payload: ReviewSubmissionPayload): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!payload.userName || payload.userName.trim().length === 0) {
    errors.push('Name is required');
  }

  if (payload.rating < 1 || payload.rating > 5) {
    errors.push('Rating must be between 1 and 5');
  }

  if (!payload.comment || payload.comment.trim().length < 10) {
    errors.push('Comment must be at least 10 characters');
  }

  if (payload.comment && payload.comment.length > 1000) {
    errors.push('Comment must be less than 1000 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
