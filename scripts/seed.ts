/**
 * Supabase Database Seeding Utility
 * 
 * Usage:
 * npx ts-node scripts/seed.ts
 * 
 * This script seeds your Supabase database with initial data for testing
 */

import { supabase } from '../src/lib/supabase';

interface SeedData {
  categories: any[];
  products: any[];
  coupons: any[];
  reviews: any[];
}

const seedData: SeedData = {
  categories: [
    {
      slug: 'audio',
      name_en: 'Wireless Audio',
      name_ar: 'سماعات وصوتيات لاسلكية',
      description_en: 'Active Noise Cancelling earbuds, spatial sound headphones, and Hi-Fi speakers.',
      description_ar: 'سماعات بلوتوث مع عزل ضوضاء نشط، صوت مكاني ثلاثي الأبعاد، ومكبرات صوت فائقة النقاء.',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      item_count: 8,
      featured: true,
    },
    {
      slug: 'chargers',
      name_en: 'GaN Fast Chargers',
      name_ar: 'شواحن GaN الذكية فائقة السرعة',
      description_en: 'Gallium Nitride high-output wall adapters for laptops, tablets, and smartphones.',
      description_ar: 'محولات شحن بتقنية نيتريد الغاليوم بقدرة تصل إلى 140 واط للهواتف والحواسب المحمولة.',
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
      item_count: 6,
      featured: true,
    },
    {
      slug: 'wearables',
      name_en: 'Smartwatches & Wearables',
      name_ar: 'ساعات ذكية وأجهزة تتبع',
      description_en: 'AMOLED displays, multi-sport GPS tracking, and advanced health biometric monitors.',
      description_ar: 'شاشات أموليد ساطعة، نظام تتبع GPS مزدوج، ومستشعرات دقيقة لمراقبة الصحة والنشاط.',
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80',
      item_count: 5,
      featured: true,
    },
    {
      slug: 'power',
      name_en: 'Power Banks & Batteries',
      name_ar: 'بنوك طاقة وبطاريات متنقلة',
      description_en: 'High-capacity laptop portable batteries and ultra-slim MagSafe power packs.',
      description_ar: 'بطاريات متنقلة بسعات ضخمة تدعم الشحن السريع 65W وشواحن ماج سيف المغناطيسية.',
      image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80',
      item_count: 4,
      featured: true,
    },
    {
      slug: 'accessories',
      name_en: 'Desk & Phone Accessories',
      name_ar: 'إكسسوارات المكتب والجوال',
      description_en: 'Aluminum ergonomic stands, MagSafe cases, and custom mechanical wireless keyboards.',
      description_ar: 'حوامل لابتوب ألومنيوم مريحة، كفرات حماية ماج سيف، ولوحات مفاتيح ميكانيكية لاسلكية.',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      item_count: 7,
      featured: true,
    },
  ],
  products: [
    {
      sku: 'HKM-AUD-001',
      title_en: 'Apex Pro Wireless ANC Earbuds',
      title_ar: 'سماعات أبيكس برو اللاسلكية مع عزل الضوضاء',
      description_en: 'Next-gen true wireless earbuds with 45dB Hybrid Active Noise Cancellation.',
      description_ar: 'سماعات لاسلكية متطورة مع تقنية عزل الضوضاء النشط الهجين 45dB.',
      features_en: ['45dB ANC', 'Bluetooth 5.4', '40-hour battery', 'IPX5 waterproof'],
      features_ar: ['عزل ضوضاء 45ديسيبل', 'بلوتوث 5.4', 'بطارية 40 ساعة', 'مقاومة الماء IPX5'],
      price: 399.00,
      compare_at_price: 499.00,
      category_slug: 'audio',
      images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80'],
      thumbnail: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
      stock: 24,
      rating: 4.92,
      review_count: 56,
      is_featured: true,
      is_new: true,
      is_bestseller: true,
      discount_percentage: 20,
      tags: ['audio', 'earbuds', 'anc', 'bluetooth'],
    },
    {
      sku: 'HKM-CHG-002',
      title_en: '100W GaN III 4-Port Fast Desktop Charger',
      title_ar: 'شاحن مكتبي 100W GaN III بـ 4 منافذ سريعة',
      description_en: 'Compact Gallium Nitride fast charger with 3x USB-C and 1x USB-A.',
      description_ar: 'شاحن مكتبي سريع بتقنية نيتريد الغاليوم III مع 3 منافذ USB-C.',
      features_en: ['100W output', 'GaN III technology', '4 ports', 'Smart distribution'],
      features_ar: ['إخراج 100 واط', 'تقنية GaN III', '4 منافذ', 'توزيع ذكي'],
      price: 249.00,
      compare_at_price: 299.00,
      category_slug: 'chargers',
      images: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1000&q=80'],
      thumbnail: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80',
      stock: 18,
      rating: 4.88,
      review_count: 43,
      is_featured: true,
      is_new: false,
      is_bestseller: true,
      discount_percentage: 17,
      tags: ['charger', 'gan', 'usbc'],
    },
    {
      sku: 'HKM-WAT-003',
      title_en: 'Titan GPS Ultra Smartwatch',
      title_ar: 'ساعة تايتان الذكية بنظام GPS فائق الدقة',
      description_en: 'Rugged titanium smartwatch with Sapphire AMOLED display and dual-frequency GPS.',
      description_ar: 'ساعة ذكية فائقة المتانة بهيكل تيتانيوم وشاشة أموليد ياقوتية.',
      features_en: ['1.96" AMOLED', 'Dual-freq GPS', 'ECG monitor', '14-day battery'],
      features_ar: ['شاشة 1.96" أموليد', 'نظام GPS ثنائي', 'مستشعر ECG', 'بطارية 14 يوم'],
      price: 699.00,
      compare_at_price: 849.00,
      category_slug: 'wearables',
      images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1000&q=80'],
      thumbnail: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80',
      stock: 12,
      rating: 4.95,
      review_count: 38,
      is_featured: true,
      is_new: true,
      is_bestseller: false,
      discount_percentage: 18,
      tags: ['smartwatch', 'gps', 'fitness'],
    },
    {
      sku: 'HKM-POW-004',
      title_en: '25,000mAh 65W Laptop Power Bank',
      title_ar: 'بنك طاقة 25,000mAh بقدرة 65W',
      description_en: 'Flight-approved portable charger with OLED display and 65W output.',
      description_ar: 'بطارية متنقلة معتمدة للطيران مع شاشة OLED وإخراج 65W.',
      features_en: ['65W USB-C', '25000mAh', 'OLED display', 'Airline-safe'],
      features_ar: ['USB-C 65W', '25000 مللي أمبير', 'شاشة OLED', 'آمنة للطائرة'],
      price: 299.00,
      compare_at_price: 350.00,
      category_slug: 'power',
      images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1000&q=80'],
      thumbnail: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=600&q=80',
      stock: 20,
      rating: 4.89,
      review_count: 31,
      is_featured: true,
      is_new: false,
      is_bestseller: true,
      discount_percentage: 15,
      tags: ['powerbank', 'battery', 'laptop'],
    },
  ],
  coupons: [
    {
      code: 'TECH10',
      discount_type: 'percentage',
      discount_value: 10.0,
      min_spend: 150.0,
      expires_at: new Date('2026-12-31').toISOString(),
      description_en: '10% instant discount on all electronics & gadgets',
      description_ar: 'خصم فوري 10% على كافة الأجهزة والإلكترونيات',
      is_active: true,
    },
    {
      code: 'GADGET20',
      discount_type: 'percentage',
      discount_value: 20.0,
      min_spend: 400.0,
      expires_at: new Date('2026-12-31').toISOString(),
      description_en: '20% discount on orders over 400 SAR',
      description_ar: 'خصم 20% على الطلبات فوق 400 ريال',
      is_active: true,
    },
    {
      code: 'WELCOME50',
      discount_type: 'fixed',
      discount_value: 50.0,
      min_spend: 250.0,
      expires_at: new Date('2026-12-31').toISOString(),
      description_en: '50 SAR discount for new customers',
      description_ar: 'خصم 50 ريال للعملاء الجدد',
      is_active: true,
    },
    {
      code: 'FREESHIP',
      discount_type: 'fixed',
      discount_value: 25.0,
      min_spend: 500.0,
      expires_at: new Date('2026-12-31').toISOString(),
      description_en: 'Free shipping on orders over 500 SAR',
      description_ar: 'شحن مجاني على الطلبات فوق 500 ريال',
      is_active: true,
    },
  ],
};

async function seed() {
  console.log('🌱 Starting database seeding...\n');

  if (!supabase) {
    console.error('❌ Supabase not configured. Check your environment variables.');
    process.exit(1);
  }

  try {
    // Seed categories
    console.log('📁 Seeding categories...');
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .insert(seedData.categories)
      .select();

    if (categoriesError) throw new Error(`Categories: ${categoriesError.message}`);
    console.log(`✅ Created ${categoriesData?.length || 0} categories\n`);

    // Seed products
    console.log('📦 Seeding products...');
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .insert(seedData.products)
      .select();

    if (productsError) throw new Error(`Products: ${productsError.message}`);
    console.log(`✅ Created ${productsData?.length || 0} products\n`);

    // Seed coupons
    console.log('🎟️  Seeding coupons...');
    const { data: couponsData, error: couponsError } = await supabase
      .from('coupons')
      .insert(seedData.coupons)
      .select();

    if (couponsError) throw new Error(`Coupons: ${couponsError.message}`);
    console.log(`✅ Created ${couponsData?.length || 0} coupons\n`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`  • Categories: ${categoriesData?.length || 0}`);
    console.log(`  • Products: ${productsData?.length || 0}`);
    console.log(`  • Coupons: ${couponsData?.length || 0}`);
    console.log('\n✨ Your Supabase database is ready to use!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeding function
seed();
