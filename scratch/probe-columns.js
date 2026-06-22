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

async function probeProfiles(userId) {
  console.log('\nProbing columns for PROFILES table:');
  const candidates = ['avatar_url', 'avatarUrl', 'role', 'name', 'phone', 'address', 'email', 'updated_at', 'updatedAt'];
  for (const field of candidates) {
    const payload = { id: userId };
    payload[field] = 'test';
    const { error } = await supabase.from('profiles').insert([payload]);
    if (error && error.message.includes('Could not find the')) {
      console.log(`- ${field} is NOT a valid column`);
    } else {
      console.log(`- ${field} IS a valid column (or type mismatch / success) - error was:`, error ? error.message : 'none (success!)');
    }
  }
}

async function probeFoodItems() {
  console.log('\nProbing columns for FOOD_ITEMS table:');
  const candidates = [
    'id', 'name', 'description', 'price', 'category', 'image',
    'is_available', 'isAvailable', 'rating', 'preparation_time', 'preparationTime',
    'spice_level', 'spiceLevel', 'calories', 'vegetarian', 'created_at', 'createdAt'
  ];
  for (const field of candidates) {
    const payload = {};
    payload[field] = field === 'price' || field === 'rating' ? 1.0 : (field === 'is_available' || field === 'isAvailable' || field === 'vegetarian' ? true : 'test');
    const { error } = await supabase.from('food_items').insert([payload]);
    if (error && error.message.includes('Could not find the')) {
      console.log(`- ${field} is NOT a valid column`);
    } else {
      console.log(`- ${field} IS a valid column (or type mismatch / success) - error was:`, error ? error.message : 'none (success!)');
    }
  }
}

async function probeOrders(userId) {
  console.log('\nProbing columns for ORDERS table:');
  const candidates = [
    'id', 'user_id', 'userId', 'userName', 'user_name', 'userEmail', 'user_email',
    'total', 'status', 'createdAt', 'created_at', 'deliveryAddress', 'delivery_address',
    'phone', 'paymentMethod', 'payment_method'
  ];
  for (const field of candidates) {
    const payload = {};
    if (field === 'user_id' || field === 'userId') {
      payload[field] = userId;
    } else {
      payload[field] = field === 'total' ? 10.0 : 'test';
    }
    const { error } = await supabase.from('orders').insert([payload]);
    if (error && error.message.includes('Could not find the')) {
      console.log(`- ${field} is NOT a valid column`);
    } else {
      console.log(`- ${field} IS a valid column (or type mismatch / success) - error was:`, error ? error.message : 'none (success!)');
    }
  }
}

async function probeOrderItems() {
  console.log('\nProbing columns for ORDER_ITEMS table:');
  const candidates = [
    'id', 'order_id', 'orderId', 'menuItemId', 'menu_item_id', 'food_item_id', 'foodItemId',
    'name', 'price', 'quantity', 'size', 'spice_level', 'spiceLevel'
  ];
  for (const field of candidates) {
    const payload = {};
    payload[field] = field === 'price' ? 5.99 : (field === 'quantity' ? 1 : 'test');
    const { error } = await supabase.from('order_items').insert([payload]);
    if (error && error.message.includes('Could not find the')) {
      console.log(`- ${field} is NOT a valid column`);
    } else {
      console.log(`- ${field} IS a valid column (or type mismatch / success) - error was:`, error ? error.message : 'none (success!)');
    }
  }
}

async function run() {
  // Use existing test user
  const email = 'test_customer_93166@foodhub.com';
  const password = 'Password123!';
  console.log('Logging in with:', email);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error('Sign in failed during probing:', error);
    return;
  }
  const userId = data.user.id;
  console.log('Probing with user ID:', userId);

  await probeProfiles(userId);
  await probeFoodItems();
  await probeOrders(userId);
  await probeOrderItems();
}

run();
