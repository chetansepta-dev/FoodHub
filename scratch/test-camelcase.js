const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] ? match[2].trim() : '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    env[match[1]] = value;
  }
});

let url = env.NEXT_PUBLIC_SUPABASE_URL;
if (url && url.endsWith('/rest/v1/')) {
  url = url.substring(0, url.length - 8);
}
url = url.replace(/\/+$/, '');
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(url, key);

async function run() {
  const email = `test_camel_${Math.floor(Math.random() * 1000000)}@foodhub.com`;
  console.log('Signing up user:', email);
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password: 'Password123!',
  });

  if (signUpError) {
    console.error('Sign up failed:', signUpError);
    return;
  }
  const user = signUpData.user;
  console.log('User created:', user.id);

  // 1. Test profiles with camelCase
  const profilePayload = {
    id: user.id,
    email: user.email,
    name: 'Camel Tester',
    address: '123 Camel St',
    phone: '111-222-3333',
    avatarUrl: 'https://avatar.url',
    role: 'customer'
  };
  const { data: pData, error: pError } = await supabase.from('profiles').insert([profilePayload]).select();
  console.log('Profiles insert:', pData ? 'SUCCESS' : 'FAILED', pError ? pError.message : '');

  // 2. Test food_items with camelCase
  const foodPayload = {
    id: 'test_camel_food',
    name: 'Camel Burger',
    description: 'Camel burger with cheese',
    price: 12.99,
    category: 'Main Course',
    image: 'https://image.url',
    isAvailable: true,
    rating: 4.8,
    preparationTime: 15,
    spiceLevel: 1,
    calories: 550,
    vegetarian: false
  };
  const { data: fData, error: fError } = await supabase.from('food_items').insert([foodPayload]).select();
  console.log('Food Items insert:', fData ? 'SUCCESS' : 'FAILED', fError ? fError.message : '');

  // 3. Test orders with camelCase
  const orderPayload = {
    id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', // Try standard uuid
    userId: user.id,
    total: 25.98,
    status: 'Pending',
    deliveryAddress: '123 Camel St',
    phone: '111-222-3333',
    paymentMethod: 'Credit Card'
  };
  const { data: oData, error: oError } = await supabase.from('orders').insert([orderPayload]).select();
  console.log('Orders insert:', oData ? 'SUCCESS' : 'FAILED', oError ? oError.message : '');

  // 4. Test order_items with camelCase
  if (oData && oData.length > 0) {
    const orderItemPayload = {
      orderId: oData[0].id,
      foodItemId: 'test_camel_food',
      name: 'Camel Burger',
      price: 12.99,
      quantity: 2,
      size: 'Regular',
      spiceLevel: 'Medium'
    };
    const { data: oiData, error: oiError } = await supabase.from('order_items').insert([orderItemPayload]).select();
    console.log('Order Items insert:', oiData ? 'SUCCESS' : 'FAILED', oiError ? oiError.message : '');
  }
}

run();
