import { create } from 'zustand';
import { Product, Category, Review } from '@/types';
import { productsService, categoriesService, reviewsService } from '@/lib/supabaseServices';

interface ProductState {
  // State
  products: Product[];
  categories: Category[];
  reviews: Record<string, Review[]>; // productId -> reviews
  isLoading: boolean;
  isLoadingCategories: boolean;
  error: string | null;

  // Product Actions
  fetchProducts: (filters?: {
    categorySlug?: string;
    isFeatured?: boolean;
    isNew?: boolean;
    isBestSeller?: boolean;
    limit?: number;
    offset?: number;
  }) => Promise<void>;
  fetchProductById: (id: string) => Promise<Product>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product>;
  createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  searchProducts: (query: string) => Promise<Product[]>;

  // Category Actions
  fetchCategories: () => Promise<void>;
  fetchCategoryBySlug: (slug: string) => Promise<Category>;
  createCategory: (category: Omit<Category, 'id'>) => Promise<Category>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;

  // Review Actions
  fetchReviews: (productId: string, limit?: number, offset?: number) => Promise<void>;
  createReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<Review>;
  updateReviewHelpful: (productId: string, reviewId: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  // Initial state
  products: [],
  categories: [],
  reviews: {},
  isLoading: false,
  isLoadingCategories: false,
  error: null,

  // ========== PRODUCTS ==========
  fetchProducts: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const products = await productsService.fetchAll(filters);
      set({ products, isLoading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMsg, isLoading: false });
      console.error('Error fetching products:', error);
    }
  },

  fetchProductById: async (id: string) => {
    try {
      const product = await productsService.fetchById(id);
      return product;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  addProduct: async (product) => {
    return get().createProduct(product);
  },

  createProduct: async (product) => {
    try {
      const newProduct = await productsService.create(product);
      set((state) => ({
        products: [...state.products, newProduct],
      }));
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  updateProduct: async (id, updates) => {
    try {
      const updated = await productsService.update(id, updates);
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updated : p)),
      }));
      return updated;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      await productsService.delete(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  searchProducts: async (query) => {
    try {
      return await productsService.search(query);
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  // ========== CATEGORIES ==========
  fetchCategories: async () => {
    set({ isLoadingCategories: true, error: null });
    try {
      const categories = await categoriesService.fetchAll();
      set({ categories, isLoadingCategories: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMsg, isLoadingCategories: false });
      console.error('Error fetching categories:', error);
    }
  },

  fetchCategoryBySlug: async (slug) => {
    try {
      return await categoriesService.fetchBySlug(slug);
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },

  createCategory: async (category) => {
    try {
      const newCategory = await categoriesService.create(category);
      set((state) => ({
        categories: [...state.categories, newCategory],
      }));
      return newCategory;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  updateCategory: async (id, updates) => {
    try {
      const updated = await categoriesService.update(id, updates);
      set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? updated : c)),
      }));
      return updated;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      await categoriesService.delete(id);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  // ========== REVIEWS ==========
  fetchReviews: async (productId, limit = 10, offset = 0) => {
    set({ isLoading: true, error: null });
    try {
      const reviews = await reviewsService.fetchByProductId(productId, limit, offset);
      set((state) => ({
        reviews: {
          ...state.reviews,
          [productId]: reviews,
        },
        isLoading: false,
      }));
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMsg, isLoading: false });
      console.error('Error fetching reviews:', error);
    }
  },

  createReview: async (review) => {
    try {
      const newReview = await reviewsService.create(review);
      set((state) => ({
        reviews: {
          ...state.reviews,
          [review.productId]: [...(state.reviews[review.productId] || []), newReview],
        },
      }));
      return newReview;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  updateReviewHelpful: async (productId, reviewId) => {
    try {
      await reviewsService.updateHelpful(reviewId);
      // Refetch reviews to get the updated count
      await get().fetchReviews(productId);
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },
}));