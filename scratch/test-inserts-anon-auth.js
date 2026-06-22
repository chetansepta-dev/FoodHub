const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local
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
  console.log('1. Signing in anonymously...');
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) {
    console.error('Anonymous sign in failed:', error);
    return;
  }
  const user = data.user;
  console.log('Anonymous sign in success! User ID:', user.id);

  // Test Profile CamelCase
  console.log('\n2. Testing PROFILES with camelCase fields:');
  const profilePayload = {
    id: user.id,
    email: 'anon@foodhub.com',
    name: 'Anon Customer',
    address: '123 Test St',
    phone: '555-555-5555',
    avatarUrl: 'https://avatar.url',
    role: 'customer'
  };
  const { data: pData, error: pError } = await supabase.from('profiles').insert([profilePayload]).select();
  console.log('Profiles camelCase result:', pData, 'error:', pError);

  // Test Food Items CamelCase
  console.log('\n3. Testing FOOD_ITEMS with camelCase:');
  const foodPayload = {
    id: 'test_item_3',
    name: 'Test Garlic Bread 3',
    description: 'Crispy garlic bread',
    price: 5.99,
    category: 'Starters',
    image: 'https://images.unsplash.com',
    isAvailable: true,
    rating: 4.5,
    preparationTime: 10,
    spiceLevel: 1,
    calories: 200,
    vegetarian: true
  };
  const { data: fData, error: fError } = await supabase.from('food_items').insert([foodPayload]).select();
  console.log('Food Items camelCase result:', fData, 'error:', fError);

  // Test Orders CamelCase
  console.log('\n4. Testing ORDERS with camelCase:');
  const orderPayload = {
    user_id: user.id, // wait, is it user_id or userId? Let's check both
    total: 10.99,
    status: 'Pending',
    deliveryAddress: '123 Test St',
    phone: '555-555-5555',
    paymentMethod: 'Credit Card'
  };
  const { data: oData, error: oError } = await supabase.from('orders').insert([orderPayload]).select();
  console.log('Orders camelCase result:', oData, 'error:', oError);

  if (oData && oData.length > 0) {
    const orderId = oData[0].id;
    // Test Order Items CamelCase
    console.log('\n5. Testing ORDER_ITEMS with camelCase:');
    const orderItemPayload = {
      orderId,
      foodItemId: 'test_item_3',
      name: 'Test Garlic Bread 3',
      price: 5.99,
      quantity: 1,
      size: 'Regular',
      spiceLevel: 'Medium'
    };
    const { data: oiData, error: oiError } = await supabase.from('order_items').insert([orderItemPayload]).select();
    console.log('Order Items camelCase result:', oiData, 'error:', oiError);
  }
}

run();
