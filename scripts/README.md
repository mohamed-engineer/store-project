# Data Seeding Guide

This directory contains scripts to populate your Supabase database with initial data.

## 📋 Contents

- `seed.ts` - TypeScript seeding utility (programmatic approach)
- `seed-database.sql` - SQL seeding script (direct database approach)

---

## ✅ Option 1: SQL Direct Seeding (Recommended for Beginners)

**Fastest way to get started.**

### Steps:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor** → **New Query**
4. Open `seed-database.sql` and copy all the SQL code
5. Paste it into the Supabase SQL editor
6. Click **Run** or press `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows)

### Verify:

Go to **Table Editor** and check:
- `categories` table: Should have **5 rows**
- `products` table: Should have **4 rows**
- `coupons` table: Should have **4 rows**
- `reviews` table: Should have **2 rows**

---

## 🚀 Option 2: TypeScript Programmatic Seeding

**Better for automation and CI/CD pipelines.**

### Prerequisites:

Ensure `ts-node` is available (it should be with your dev setup):

```bash
npm ls -D ts-node
# or install it
npm install -D ts-node @types/node
```

### Steps:

1. From project root, run:
   ```bash
   npx ts-node scripts/seed.ts
   ```

2. Watch the progress output:
   ```
   🌱 Starting database seeding...
   
   📁 Seeding categories...
   ✅ Created 5 categories
   
   📦 Seeding products...
   ✅ Created 4 products
   
   🎟️  Seeding coupons...
   ✅ Created 4 coupons
   
   🎉 Database seeding completed successfully!
   ```

### Troubleshooting:

- **Error: "Cannot find module"** → Run `npm install` first
- **Error: "Supabase not configured"** → Check `.env.local` file has Supabase credentials
- **Error: "connection refused"** → Ensure you're connected to internet and Supabase project is active

---

## 📊 What Gets Seeded?

### Categories (5 total)
- Wireless Audio
- GaN Fast Chargers
- Smartwatches & Wearables
- Power Banks & Batteries
- Desk & Phone Accessories

### Products (4 total)
- Apex Pro Wireless ANC Earbuds (₪399)
- 100W GaN III 4-Port Charger (₪249)
- Titan GPS Ultra Smartwatch (₪699)
- 25,000mAh 65W Power Bank (₪299)

### Coupons (4 total)
- **TECH10**: 10% off (min ₪150)
- **GADGET20**: 20% off (min ₪400)
- **WELCOME50**: ₪50 off (min ₪250)
- **FREESHIP**: Free shipping (min ₪500)

### Reviews (2 sample reviews)
- Review for Earbuds (5⭐)
- Review for Charger (5⭐)

---

## 🔄 Clearing & Re-seeding

### Option A: Delete data via Supabase Dashboard
1. Go to **Table Editor**
2. Select table (reviews, products, categories, coupons)
3. Click **Delete all rows** (be careful!)
4. Re-run the seed script

### Option B: Via SQL
```sql
-- Clear in this order (respects foreign keys)
DELETE FROM public.reviews;
DELETE FROM public.order_items;
DELETE FROM public.orders;
DELETE FROM public.products;
DELETE FROM public.coupons;
DELETE FROM public.categories;
```

Then re-run the seed script.

---

## 🛡️ Notes

- Both scripts are **idempotent** (safe to run multiple times)
- Only inserts new data; won't update existing records
- Soft-delete friendly: Uses natural keys where possible
- All data includes bilingual content (English & Arabic)

---

## 🆘 Needing Help?

1. **Check Supabase Status**: https://status.supabase.com
2. **Verify RLS Policies**: Table Editor → Click table → "Auth" tab
3. **Check Logs**: Supabase Dashboard → Logs
4. **Test Connection**: Try connecting via Supabase CLI: `supabase status`

---

## ✨ Next Steps

After seeding:

1. **Test in App**: Browse products, apply coupons in checkout
2. **Create Custom Data**: Use Admin Dashboard → Products/Coupons
3. **Add Real Orders**: Place test orders via checkout flow
4. **Expand Seed Data**: Modify scripts to add more products/categories

Happy coding! 🚀
