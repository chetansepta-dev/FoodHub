-- ============================================================
-- FoodHub Complete Supabase Setup Script
-- Run this ENTIRE script in Supabase SQL Editor
-- It will set up all tables, policies, and seed data
-- ============================================================

-- This File contains all the code for setting up the FoodHub application in Supabase. It includes:
-- 1. Table creation for profiles, food_items, orders, and order_items
-- 2. Row Level Security (RLS) policies
-- 3. Seed data

-- ============================================================
-- STEP 1: CREATE TABLES (if they don't exist)
-- ============================================================

-- Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  address TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Food items table
CREATE TABLE IF NOT EXISTS food_items (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Starters', 'Main Course', 'Desserts', 'Drinks')),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table (with phone and payment_method columns)
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled')),
  delivery_address TEXT,
  phone TEXT,
  payment_method TEXT DEFAULT 'Credit Card',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add columns to orders if they don't exist (safe migration)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'phone') THEN
    ALTER TABLE orders ADD COLUMN phone TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_method') THEN
    ALTER TABLE orders ADD COLUMN payment_method TEXT DEFAULT 'Credit Card';
  END IF;
END $$;

-- Order items table (with size, spice_level, notes columns)
CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  food_id BIGINT REFERENCES food_items(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  size TEXT DEFAULT '',
  spice_level TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add columns to order_items if they don't exist (safe migration)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'size') THEN
    ALTER TABLE order_items ADD COLUMN size TEXT DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'spice_level') THEN
    ALTER TABLE order_items ADD COLUMN spice_level TEXT DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'notes') THEN
    ALTER TABLE order_items ADD COLUMN notes TEXT DEFAULT '';
  END IF;
END $$;


-- ============================================================
-- STEP 2: SET UP ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Create the admin helper function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public food_items read" ON food_items;
DROP POLICY IF EXISTS "Auth users insert food_items" ON food_items;
DROP POLICY IF EXISTS "Auth users update food_items" ON food_items;
DROP POLICY IF EXISTS "Auth users delete food_items" ON food_items;
DROP POLICY IF EXISTS "Users read own profile" ON profiles;
DROP POLICY IF EXISTS "Users update own profile" ON profiles;
DROP POLICY IF EXISTS "Users insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users read own orders" ON orders;
DROP POLICY IF EXISTS "Users insert own orders" ON orders;
DROP POLICY IF EXISTS "Users update own orders" ON orders;
DROP POLICY IF EXISTS "Users read own order_items" ON order_items;
DROP POLICY IF EXISTS "Users insert own order_items" ON order_items;
DROP POLICY IF EXISTS "Users read own profile or admin reads all" ON profiles;
DROP POLICY IF EXISTS "Public read food_items" ON food_items;
DROP POLICY IF EXISTS "Admin write food_items" ON food_items;
DROP POLICY IF EXISTS "Users read own orders or admin reads all" ON orders;
DROP POLICY IF EXISTS "Admin update orders" ON orders;
DROP POLICY IF EXISTS "Users read own order_items or admin reads all" ON order_items;

-- FOOD ITEMS: Public read, admin write
CREATE POLICY "Public read food_items" ON food_items FOR SELECT USING (true);
CREATE POLICY "Admin write food_items" ON food_items FOR ALL USING (public.is_admin());

-- PROFILES: Users can read/write their own profile, admin can read all
CREATE POLICY "Users read own profile or admin reads all" ON profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ORDERS: Users can read and insert their own orders; admin can read/update all
CREATE POLICY "Users read own orders or admin reads all" ON orders FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin update orders" ON orders FOR UPDATE USING (public.is_admin());

-- ORDER ITEMS: Users can read/write their own order items; admin can read all
CREATE POLICY "Users read own order_items or admin reads all" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.user_id = auth.uid() OR public.is_admin())
  )
);
CREATE POLICY "Users insert own order_items" ON order_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);


-- ============================================================
-- STEP 3: SEED FOOD ITEMS DATA
-- ============================================================

-- Disable RLS temporarily to allow seeding from SQL editor
ALTER TABLE food_items DISABLE ROW LEVEL SECURITY;

-- Clear existing data
TRUNCATE TABLE order_items;
TRUNCATE TABLE food_items RESTART IDENTITY;

-- Insert 20 realistic food items
INSERT INTO food_items (name, description, price, category, image_url) VALUES
('Garlic Bruschetta', 'Toasted artisan bread topped with diced vine-ripened tomatoes, fresh garlic, basil, and a drizzle of extra virgin olive oil and balsamic glaze.', 199, 'Starters', 'https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&w=600&q=80'),
('Crispy Stuffed Mushrooms', 'Plump cremini mushrooms filled with a savory blend of three cheeses, fresh herbs, and breadcrumbs, baked until golden brown.', 249, 'Starters', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80'),
('Spicy Chicken Satay', 'Grilled skewered chicken marinated in aromatic spices, served with a creamy cucumber relish and our signature house peanut dipping sauce.', 279, 'Starters', 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=600&q=80'),
('Caesar Salad', 'Crisp romaine lettuce tossed in creamy Caesar dressing, topped with garlic croutons and shaved parmesan.', 199, 'Starters', 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=600&q=80'),
('Signature Ribeye Steak', '12oz USDA Prime Ribeye steak, garlic-herb butter-basted, grilled to perfection. Served with truffle mashed potatoes and roasted asparagus.', 1299, 'Main Course', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'),
('Pan-Seared Salmon Fillet', 'Crispy skin salmon served over wild rice pilaf, wilted baby spinach, and topped with a bright lemon dill butter sauce.', 899, 'Main Course', 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80'),
('Truffle Mushroom Risotto', 'Creamy Arborio rice simmered with wild forest mushrooms, Parmigiano-Reggiano, and finished with white truffle oil and fresh parsley.', 699, 'Main Course', 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=600&q=80'),
('Thai Spicy Green Curry', 'A rich and fiery green coconut curry loaded with broccoli, bamboo shoots, bell peppers, fresh basil, and chicken. Served with jasmine rice.', 499, 'Main Course', 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=600&q=80'),
('Margherita Pizza', 'Classic Neapolitan pizza with San Marzano tomato sauce, fresh buffalo mozzarella, and fresh basil leaves.', 349, 'Main Course', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80'),
('Classic Beef Burger', 'Juicy beef patty with aged cheddar cheese, crisp lettuce, tomato, caramelized onions, and house sauce on a brioche bun. Served with fries.', 399, 'Main Course', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'),
('Chicken Parmesan', 'Breaded chicken breast smothered in marinara sauce and melted mozzarella, served over al dente spaghetti.', 549, 'Main Course', 'https://images.unsplash.com/photo-1632778149955-f6c6d091a134?auto=format&fit=crop&w=600&q=80'),
('Chocolate Lava Cake', 'Warm dark chocolate cake with a molten chocolate center, served with fresh raspberries and a scoop of vanilla bean gelato.', 249, 'Desserts', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80'),
('Classic Espresso Tiramisu', 'Layers of espresso-soaked ladyfingers, whipped mascarpone cream, dusted with dark cocoa powder and espresso beans.', 229, 'Desserts', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80'),
('Strawberry NY Cheesecake', 'Rich and creamy New York-style cheesecake on a graham cracker crust, smothered with sweet strawberry compote.', 229, 'Desserts', 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80'),
('Vanilla Panna Cotta', 'Silky Italian cream dessert flavored with vanilla bean and topped with a mixed berry coulis and fresh mint.', 199, 'Desserts', 'https://images.unsplash.com/photo-1587248720327-8eb72564be1e?auto=format&fit=crop&w=600&q=80'),
('Mango Sorbet', 'Refreshing handcrafted mango sorbet made with Alphonso mangoes, served with a fresh mint sprig and lime zest.', 149, 'Desserts', 'https://images.unsplash.com/photo-1488900128323-21503983a07e?auto=format&fit=crop&w=600&q=80'),
('Fresh Mint Mojito', 'A refreshing muddle of fresh mint leaves, lime wedges, sugar cane syrup, topped with sparkling soda water and crushed ice.', 149, 'Drinks', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80'),
('Premium Iced Latte', 'Double shot of organic espresso poured over chilled whole milk and sweet vanilla bean syrup, served over ice.', 179, 'Drinks', 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80'),
('Wild Berry Smoothie', 'A delicious blended treat of wild strawberries, blueberries, blackberries, Greek yogurt, and a touch of wild honey.', 199, 'Drinks', 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80'),
('Matcha Green Tea Latte', 'Premium Japanese ceremonial matcha whisked with steamed oat milk, offering a smooth, earthy, and naturally sweet flavor.', 149, 'Drinks', 'https://images.unsplash.com/photo-1582793988951-9aed550c184c?auto=format&fit=crop&w=600&q=80');

-- Re-enable RLS
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- STEP 4: CREATE PROFILE AUTO-CREATION TRIGGER
-- ============================================================

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    CASE 
      WHEN NEW.email = 'admin@foodhub.com' THEN 'admin'
      ELSE COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- STEP 5: VERIFY EVERYTHING WORKED
-- ============================================================
SELECT 
  'food_items' as table_name,
  COUNT(*) as row_count
FROM food_items
UNION ALL
SELECT 
  'profiles' as table_name,
  COUNT(*) as row_count
FROM profiles
UNION ALL
SELECT 
  'orders' as table_name,
  COUNT(*) as row_count
FROM orders;


-- ============================================================
-- STEP 6: AUTO-CONFIRM USERS & PRE-CREATE ADMIN ACCOUNT
-- ============================================================

-- Confirm all existing users (confirmed_at is a generated column — only set email_confirmed_at)
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- Create trigger to auto-confirm all future signups
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- confirmed_at is a generated column; only set email_confirmed_at
  NEW.email_confirmed_at := COALESCE(NEW.email_confirmed_at, NOW());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_auto_confirm ON auth.users;

CREATE TRIGGER on_auth_user_created_auto_confirm
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_user();

-- Pre-create the admin account (admin@foodhub.com / Password123!) if it doesn't exist
DO $$
DECLARE
  new_user_id UUID := gen_random_uuid();
  hashed_pwd TEXT;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@foodhub.com') THEN
    hashed_pwd := extensions.crypt('Password123!', extensions.gen_salt('bf'));
    
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      aud,
      confirmation_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'admin@foodhub.com',
      hashed_pwd,
      NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Admin User", "role": "admin"}',
      NOW(),
      NOW(),
      'authenticated',
      'authenticated',
      ''
    );

    INSERT INTO public.profiles (id, full_name, role)
    VALUES (new_user_id, 'Admin User', 'admin')
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

