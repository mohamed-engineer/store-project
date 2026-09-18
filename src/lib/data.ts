/**
 * Utility Exports (Deprecated)
 * All mock data has been removed. Use Supabase services instead.
 * 
 * MIGRATION GUIDE:
 * - INITIAL_CATEGORIES → Use categoriesService.fetchAll()
 * - INITIAL_PRODUCTS → Use productsService.fetchAll()
 * - INITIAL_REVIEWS → Use reviewsService.fetchByProductId()
 * - INITIAL_ORDERS → Use ordersService.fetchById() or fetchByOrderNumber()
 * - VALID_COUPONS → Use couponsService.validate()
 * 
 * All data now comes exclusively from Supabase.
 */

// This file is kept for backward compatibility during migration
// New code should import from @/lib/supabaseServices instead
