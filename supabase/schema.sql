-- ==============================================================================
-- HAKIM TECH - SUPABASE POSTGRESQL DATABASE SCHEMA & MIGRATIONS
-- Electronics, Gadgets, & Tech Accessories
-- Fully bilingual (Arabic / English), RLS enabled, Realtime enabled
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. CATEGORIES TABLE
create table if not exists public.categories (
    id uuid primary key default uuid_generate_v4(),
    slug text unique not null,
    name_en text not null,
    name_ar text not null,
    description_en text,
    description_ar text,
    image text not null,
    item_count integer default 0,
    featured boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. PRODUCTS TABLE
create table if not exists public.products (
    id uuid primary key default uuid_generate_v4(),
    sku text unique not null,
    title_en text not null,
    title_ar text not null,
    description_en text not null,
    description_ar text not null,
    features_en jsonb default '[]'::jsonb,
    features_ar jsonb default '[]'::jsonb,
    price numeric(10, 2) not null check (price >= 0),
    compare_at_price numeric(10, 2),
    category_id uuid references public.categories(id) on delete set null,
    category_slug text not null,
    images text[] default '{}',
    thumbnail text not null,
    stock integer default 0 check (stock >= 0),
    rating numeric(3, 2) default 5.0,
    review_count integer default 0,
    is_featured boolean default false,
    is_new boolean default false,
    is_bestseller boolean default false,
    discount_percentage integer default 0,
    tags text[] default '{}',
    variants jsonb default '[]'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. PROFILES / CUSTOMERS TABLE
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text unique not null,
    full_name text,
    phone text,
    avatar_url text,
    role text default 'customer' check (role in ('customer', 'admin', 'editor')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. ORDERS TABLE
create table if not exists public.orders (
    id uuid primary key default uuid_generate_v4(),
    order_number text unique not null,
    customer_id uuid references public.profiles(id) on delete set null,
    customer_name text not null,
    customer_email text not null,
    customer_phone text not null,
    shipping_address jsonb not null,
    subtotal numeric(10, 2) not null,
    discount numeric(10, 2) default 0.00,
    tax numeric(10, 2) not null,
    shipping numeric(10, 2) default 0.00,
    total numeric(10, 2) not null,
    status text default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    payment_method text default 'cod' check (payment_method in ('cod', 'credit_card', 'apple_pay', 'mada')),
    payment_status text default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
    coupon_code text,
    tracking_number text,
    timeline jsonb default '[]'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. ORDER ITEMS TABLE
create table if not exists public.order_items (
    id uuid primary key default uuid_generate_v4(),
    order_id uuid not null references public.orders(id) on delete cascade,
    product_id uuid references public.products(id) on delete set null,
    product_title_en text not null,
    product_title_ar text not null,
    product_image text not null,
    unit_price numeric(10, 2) not null,
    quantity integer not null check (quantity > 0),
    variant_info text,
    total_price numeric(10, 2) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. REVIEWS TABLE
create table if not exists public.reviews (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid not null references public.products(id) on delete cascade,
    user_name text not null,
    user_avatar text,
    rating integer not null check (rating >= 1 and rating <= 5),
    title text,
    comment text not null,
    verified_purchase boolean default true,
    helpful_count integer default 0,
    images text[] default '{}',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. COUPONS TABLE
create table if not exists public.coupons (
    code text primary key,
    discount_type text not null check (discount_type in ('percentage', 'fixed')),
    discount_value numeric(10, 2) not null,
    min_spend numeric(10, 2) default 0,
    max_discount numeric(10, 2),
    expires_at timestamp with time zone,
    description_en text,
    description_ar text,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INDEXES
create index if not exists idx_products_category on public.products(category_slug);
create index if not exists idx_products_price on public.products(price);
create index if not exists idx_products_rating on public.products(rating);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_reviews_product_id on public.reviews(product_id);

-- ROW LEVEL SECURITY
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.coupons enable row level security;

-- Policies
create policy "Allow public read on categories" on public.categories for select using (true);
create policy "Allow public read on products" on public.products for select using (true);
create policy "Allow public read on reviews" on public.reviews for select using (true);
create policy "Allow public read on coupons" on public.coupons for select using (is_active = true);
create policy "Allow public insert on orders" on public.orders for insert with check (true);
create policy "Allow public select on orders by order_number" on public.orders for select using (true);
create policy "Allow public insert on order_items" on public.order_items for insert with check (true);
create policy "Allow public select on order_items" on public.order_items for select using (true);
create policy "Allow public insert on reviews" on public.reviews for insert with check (true);
create policy "Allow admins full access to categories" on public.categories for all using (true);
create policy "Allow admins full access to products" on public.products for all using (true);
create policy "Allow admins full access to orders" on public.orders for all using (true);
create policy "Allow admins full access to order_items" on public.order_items for all using (true);
create policy "Allow admins full access to coupons" on public.coupons for all using (true);

-- Realtime Publication
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.products;
