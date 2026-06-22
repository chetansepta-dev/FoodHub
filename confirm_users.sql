-- ============================================================
-- SQL to Auto-Confirm Users, Pre-Create Admin Account & Setup RLS
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Confirm all existing users
UPDATE auth.users
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;

-- 2. Create trigger to auto-confirm all FUTURE users on signup
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  NEW.email_confirmed_at := COALESCE(NEW.email_confirmed_at, NOW());
  NEW.confirmed_at := COALESCE(NEW.confirmed_at, NOW());
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_auto_confirm ON auth.users;

CREATE TRIGGER on_auth_user_created_auto_confirm
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_user();

-- 3. Pre-create the admin account (admin@foodhub.com / Password123!) if it doesn't exist
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
      confirmed_at,
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

-- 4. Create the admin check helper function
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

-- 5. Enable RLS on all tables (if not already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public food_items read" ON public.food_items;
DROP POLICY IF EXISTS "Auth users insert food_items" ON public.food_items;
DROP POLICY IF EXISTS "Auth users update food_items" ON public.food_items;
DROP POLICY IF EXISTS "Auth users delete food_items" ON public.food_items;
DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users read own orders" ON public.orders;
DROP POLICY IF EXISTS "Users insert own orders" ON public.orders;
DROP POLICY IF EXISTS "Users update own orders" ON public.orders;
DROP POLICY IF EXISTS "Users read own order_items" ON public.order_items;
DROP POLICY IF EXISTS "Users insert own order_items" ON public.order_items;
DROP POLICY IF EXISTS "Users read own profile or admin reads all" ON public.profiles;
DROP POLICY IF EXISTS "Public read food_items" ON public.food_items;
DROP POLICY IF EXISTS "Admin write food_items" ON public.food_items;
DROP POLICY IF EXISTS "Users read own orders or admin reads all" ON public.orders;
DROP POLICY IF EXISTS "Admin update orders" ON public.orders;
DROP POLICY IF EXISTS "Users read own order_items or admin reads all" ON public.order_items;

-- 6. Apply secure RLS policies
-- FOOD ITEMS: Public read, admin write
CREATE POLICY "Public read food_items" ON public.food_items FOR SELECT USING (true);
CREATE POLICY "Admin write food_items" ON public.food_items FOR ALL USING (public.is_admin());

-- PROFILES: Users can read/write their own profile, admin can read all
CREATE POLICY "Users read own profile or admin reads all" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ORDERS: Users can read and insert their own orders; admin can read/update all
CREATE POLICY "Users read own orders or admin reads all" ON public.orders FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin update orders" ON public.orders FOR UPDATE USING (public.is_admin());

-- ORDER ITEMS: Users can read/write their own order items; admin can read all
CREATE POLICY "Users read own order_items or admin reads all" ON public.order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.user_id = auth.uid() OR public.is_admin())
  )
);
CREATE POLICY "Users insert own order_items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);
