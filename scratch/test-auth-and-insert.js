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
  const email = `test_customer_${Math.floor(Math.random() * 100000)}@foodhub.com`;
  const password = 'Password123!';

  console.log('1. Signing up test user:', email);
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: 'Test Customer',
        role: 'customer'
      }
    }
  });

  if (signUpError) {
    console.error('Sign up failed:', signUpError);
    return;
  }
  const user = signUpData.user;
  console.log('Sign up success! User ID:', user.id);

  console.log('2. Inserting profile for user:', user.id);
  // Let's try snake_case fields first
  const profilePayload = {
    id: user.id,
    email: user.email,
    name: 'Test Customer',
    address: '123 Test St',
    phone: '555-555-5555',
    avatar_url: 'https://avatar.url',
    role: 'customer'
  };

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .insert([profilePayload])
    .select();

  console.log('Profile insert result:', profileData, 'error:', profileError);

  console.log('3. Trying to insert a food item (as this authenticated user):');
  const foodPayload = {
    id: 'test_item_1',
    name: 'Test Garlic Bread',
    description: 'Crispy garlic bread',
    price: 5.99,
    category: 'Starters',
    image: 'https://images.unsplash.com',
    is_available: true,
    rating: 4.5,
    preparation_time: 10,
    spice_level: 1,
    calories: 200,
    vegetarian: true
  };

  const { data: foodData, error: foodError } = await supabase
    .from('food_items')
    .insert([foodPayload])
    .select();

  console.log('Food item insert result:', foodData, 'error:', foodError);

  // Let's try creating an order
  console.log('4. Trying to insert an order:');
  const orderPayload = {
    user_id: user.id,
    total: 10.99,
    status: 'Pending',
    delivery_address: '123 Test St',
    phone: '555-555-5555',
    payment_method: 'Credit Card'
  };

  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert([orderPayload])
    .select();

  console.log('Order insert result:', orderData, 'error:', orderError);

  if (orderData && orderData.length > 0) {
    const orderId = orderData[0].id;
    console.log('5. Trying to insert order item for order:', orderId);
    const orderItemPayload = {
      order_id: orderId,
      food_item_id: 'test_item_1',
      name: 'Test Garlic Bread',
      price: 5.99,
      quantity: 1,
      size: 'Regular',
      spice_level: 'Medium'
    };

    const { data: orderItemData, error: orderItemError } = await supabase
      .from('order_items')
      .insert([orderItemPayload])
      .select();

    console.log('Order Item insert result:', orderItemData, 'error:', orderItemError);
  }
}

run();
