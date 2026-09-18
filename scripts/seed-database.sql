#!/bin/bash

# Hakim Store - Data Seeding Guide
# Run this script to populate your Supabase database with initial data

# OPTION 1: Direct SQL Execution
# Copy the SQL below and run it directly in Supabase SQL Editor

cat << 'EOF'
-- ============================================================================
-- HAKIM STORE - INITIAL DATA SEEDING SCRIPT
-- Execute this in Supabase SQL Editor: https://app.supabase.com/projects
-- ============================================================================

-- 1. INSERT CATEGORIES
INSERT INTO public.categories (slug, name_en, name_ar, description_en, description_ar, image, item_count, featured)
VALUES
  (
    'audio',
    'Wireless Audio',
    'سماعات وصوتيات لاسلكية',
    'Active Noise Cancelling earbuds, spatial sound headphones, and Hi-Fi speakers.',
    'سماعات بلوتوث مع عزل ضوضاء نشط، صوت مكاني ثلاثي الأبعاد، ومكبرات صوت فائقة النقاء.',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    8,
    true
  ),
  (
    'chargers',
    'GaN Fast Chargers',
    'شواحن GaN الذكية فائقة السرعة',
    'Gallium Nitride high-output wall adapters for laptops, tablets, and smartphones.',
    'محولات شحن بتقنية نيتريد الغاليوم بقدرة تصل إلى 140 واط للهواتف والحواسب المحمولة.',
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    6,
    true
  ),
  (
    'wearables',
    'Smartwatches & Wearables',
    'ساعات ذكية وأجهزة تتبع',
    'AMOLED displays, multi-sport GPS tracking, and advanced health biometric monitors.',
    'شاشات أموليد ساطعة، نظام تتبع GPS مزدوج، ومستشعرات دقيقة لمراقبة الصحة والنشاط.',
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80',
    5,
    true
  ),
  (
    'power',
    'Power Banks & Batteries',
    'بنوك طاقة وبطاريات متنقلة',
    'High-capacity laptop portable batteries and ultra-slim MagSafe power packs.',
    'بطاريات متنقلة بسعات ضخمة تدعم الشحن السريع 65W وشواحن ماج سيف المغناطيسية.',
    'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80',
    4,
    true
  ),
  (
    'accessories',
    'Desk & Phone Accessories',
    'إكسسوارات المكتب والجوال',
    'Aluminum ergonomic stands, MagSafe cases, and custom mechanical wireless keyboards.',
    'حوامل لابتوب ألومنيوم مريحة، كفرات حماية ماج سيف، ولوحات مفاتيح ميكانيكية لاسلكية.',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    7,
    true
  );

-- 2. INSERT PRODUCTS
INSERT INTO public.products (
  sku,
  title_en,
  title_ar,
  description_en,
  description_ar,
  features_en,
  features_ar,
  price,
  compare_at_price,
  category_slug,
  images,
  thumbnail,
  stock,
  rating,
  review_count,
  is_featured,
  is_new,
  is_bestseller,
  discount_percentage,
  tags
) VALUES
  (
    'HKM-AUD-001',
    'Apex Pro Wireless ANC Earbuds',
    'سماعات أبيكس برو اللاسلكية مع عزل الضوضاء',
    'Next-gen true wireless earbuds with 45dB Hybrid Active Noise Cancellation, Bluetooth 5.4, 40-hour total battery life, and spatial audio with dynamic head tracking.',
    'سماعات لاسلكية متطورة مع تقنية عزل الضوضاء النشط الهجين 45dB، بلوتوث 5.4، بطارية تدوم حتى 40 ساعة، وصوت مكاني ثلاثي الأبعاد مع تتبع حركة الرأس.',
    '["Hybrid Active Noise Cancellation (up to 45dB reduction)", "Bluetooth 5.4 with LDAC & AAC Hi-Res Audio codecs", "Battery: 9 hours per charge + 31 hours in MagSafe case", "Dual-device multipoint seamless switching", "IPX5 Water & Sweat Resistance"]',
    '["عزل ضوضاء هجين نشط بقدرة خفض تصل إلى 45 ديسيبل", "بلوتوث 5.4 مع دعم صوت عالي الدقة LDAC و AAC", "البطارية: 9 ساعات تشغيل متواصل + 31 ساعة إضافية مع علبة الشحن", "اتصال متزامن بجهازين مع تنقل فوري وسلس", "مقاومة لرذاذ الماء والتعرق بمعيار IPX5"]',
    399.00,
    499.00,
    'audio',
    '["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80"]',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    24,
    4.92,
    56,
    true,
    true,
    true,
    20,
    '["audio", "earbuds", "anc", "bluetooth", "bestseller"]'
  ),
  (
    'HKM-CHG-002',
    '100W GaN III 4-Port Fast Desktop Charger',
    'شاحن مكتبي 100W GaN III بـ 4 منافذ سريعة',
    'Compact Gallium Nitride fast charger equipped with 3x USB-C Power Delivery 3.0 ports and 1x USB-A port.',
    'شاحن مكتبي سريع وفائق الصغر بتقنية نيتريد الغاليوم III مع 3 منافذ USB-C ومنفذ USB-A.',
    '["100W Maximum Total Power Delivery Output", "GaN III Technology for cooler and 40% smaller footprint", "Smart Dynamic Power Distribution across 4 ports", "Comprehensive ActiveShield 2.0 temperature monitoring"]',
    '["إجمالي قدرة خرج تصل إلى 100 واط بتقنية Power Delivery", "تقنية GaN III لكفاءة طاقة أعلى وحجم أصغر بنسبة 40%", "توزيع ذكي للطاقة تلقائياً حسب احتياج كل جهاز متصل"]',
    249.00,
    299.00,
    'chargers',
    '["https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1000&q=80"]',
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80',
    18,
    4.88,
    43,
    true,
    false,
    true,
    17,
    '["charger", "gan", "usbc", "fastcharge"]'
  ),
  (
    'HKM-WAT-003',
    'Titan GPS Ultra Smartwatch',
    'ساعة تايتان الذكية بنظام GPS فائق الدقة',
    'Rugged aerospace-grade titanium smartwatch with 1.96" Sapphire AMOLED display, dual-frequency GPS, ECG monitor, and 14-day battery life.',
    'ساعة ذكية فائقة المتانة بهيكل تيتانيوم فضائي وشاشة أموليد ياقوتية 1.96 بوصة.',
    '["1.96-inch Always-On Sapphire AMOLED (410x502 resolution)", "Dual-frequency L1+L5 Precision GPS", "Heart Rate, SpO2, ECG, and Stress biometric monitoring", "100m Water Resistance (10 ATM)"]',
    '["شاشة أموليد ياقوتية دائمة العمل مقاس 1.96 بوصة", "نظام ملاحة GPS ثنائي التردد L1+L5", "مراقبة دقيقة لنبضات القلب والأكسجين وتخطيط القلب"]',
    699.00,
    849.00,
    'wearables',
    '["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1000&q=80"]',
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80',
    12,
    4.95,
    38,
    true,
    true,
    false,
    18,
    '["smartwatch", "wearables", "fitness", "gps"]'
  ),
  (
    'HKM-POW-004',
    '25,000mAh 65W Laptop Power Bank',
    'بنك طاقة 25,000mAh بقدرة 65W مع شاشة OLED',
    'High-density flight-approved portable charger capable of fast-charging laptops, Steam Decks, and phones.',
    'بطارية متنقلة معتمدة للطيران بسعة ضخمة 25,000mAh وشحن سريع 65W.',
    '["65W High-Speed USB-C Power Delivery 3.0 output", "25,000mAh (92.5Wh) Airline-safe capacity", "Integrated real-time OLED power monitor display", "Triple output: 2x USB-C + 1x USB-A"]',
    '["منفذ USB-C بقدرة 65W يشحن اللابتوب والجوال بأقصى سرعة", "سعة ضخمة 25,000 مللي أمبير آمنة للطائرة", "شاشة OLED مدمجة لعرض الواط اللحظي"]',
    299.00,
    350.00,
    'power',
    '["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1000&q=80"]',
    'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=600&q=80',
    20,
    4.89,
    31,
    true,
    false,
    true,
    15,
    '["powerbank", "battery", "laptop", "fastcharge"]'
  ),
  (
    'HKM-ACC-005',
    'Foldable 3-in-1 MagSafe Wireless Charging Stand',
    'منصة شحن لاسلكية مغناطيسية 3 في 1',
    'Sleek aircraft-grade aluminum charging station with official 15W MagSafe fast charging.',
    'منصة شحن مصنوعة من ألومنيوم الطائرات الفاخر، تدعم الشحن المغناطيسي السريع 15W.',
    '["15W Official MagSafe strong magnetic alignment", "Simultaneously powers Phone, Watch, and Earbuds", "Precision CNC machined space-gray aluminum chassis", "Foldable ultra-compact form factor"]',
    '["شحن مغناطيسي ماج سيف بقوة 15 واط مع محاذاة قوية", "شحن متزامن للهاتف والساعة وسماعات الأذن", "هيكل معدني مصنع بدقة CNC"]',
    219.00,
    279.00,
    'accessories',
    '["https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=1000&q=80"]',
    'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=600&q=80',
    15,
    4.96,
    47,
    true,
    false,
    true,
    22,
    '["magsafe", "wireless", "stand", "iphone"]'
  );

-- 3. INSERT COUPONS
INSERT INTO public.coupons (code, discount_type, discount_value, min_spend, expires_at, description_en, description_ar, is_active)
VALUES
  (
    'TECH10',
    'percentage',
    10.00,
    150.00,
    '2026-12-31 23:59:59',
    '10% instant discount on all electronics & gadgets',
    'خصم فوري 10% على كافة الأجهزة والإلكترونيات',
    true
  ),
  (
    'GADGET20',
    'percentage',
    20.00,
    400.00,
    '2026-12-31 23:59:59',
    '20% discount on orders over 400 SAR',
    'خصم 20% على الطلبات فوق 400 ريال',
    true
  ),
  (
    'WELCOME50',
    'fixed',
    50.00,
    250.00,
    '2026-12-31 23:59:59',
    '50 SAR discount for new tech patrons',
    'خصم 50 ريال للعملاء الجدد',
    true
  ),
  (
    'FREESHIP',
    'percentage',
    100.00,
    500.00,
    '2026-12-31 23:59:59',
    'Free shipping on orders over 500 SAR',
    'شحن مجاني على الطلبات فوق 500 ريال',
    true
  );

-- 4. INSERT SAMPLE REVIEWS
INSERT INTO public.reviews (product_id, user_name, rating, title, comment, verified_purchase, helpful_count)
SELECT 
  id,
  'Turki Al-Otaibi',
  5,
  'Incredible ANC and Deep Bass',
  'The noise cancellation on these earbuds easily matches products double the price. Worked flawlessly during my flight.',
  true,
  18
FROM products WHERE sku = 'HKM-AUD-001'
LIMIT 1;

INSERT INTO public.reviews (product_id, user_name, rating, title, comment, verified_purchase, helpful_count)
SELECT 
  id,
  'Sara Al-Dosari',
  5,
  'One charger to rule them all',
  'Replaced 4 different chargers with this 100W GaN block. Stays cool even when charging multiple devices.',
  true,
  12
FROM products WHERE sku = 'HKM-CHG-002'
LIMIT 1;

-- Done! Your database is now seeded with initial data.
-- Verify in Supabase Dashboard:
-- - Tables > categories: Should show 5 rows
-- - Tables > products: Should show 5 rows
-- - Tables > coupons: Should show 4 rows
-- - Tables > reviews: Should show 2 rows

EOF
