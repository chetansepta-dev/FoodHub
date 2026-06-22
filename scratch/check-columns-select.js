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

async function checkColumns(table, candidates) {
  console.log(`\nChecking columns for table: ${table}`);
  for (const col of candidates) {
    const { error } = await supabase.from(table).select(col).limit(0);
    if (error) {
      if (error.message.includes('Could not find') || error.message.includes('does not exist')) {
        console.log(`- ${col}: NOT FOUND`);
      } else {
        console.log(`- ${col}: FOUND but other error (${error.message})`);
      }
    } else {
      console.log(`- ${col}: FOUND (OK)`);
    }
  }
}

async function run() {
  await checkColumns('profiles', [
    'id', 'email', 'name', 'address', 'phone',
    'avatarUrl', 'avatar_url',
    'role',
    'updatedAt', 'updated_at'
  ]);

  await checkColumns('food_items', [
    'id', 'name', 'description', 'price', 'category', 'image',
    'isAvailable', 'is_available',
    'rating',
    'preparationTime', 'preparation_time',
    'spiceLevel', 'spice_level',
    'calories',
    'vegetarian',
    'createdAt', 'created_at'
  ]);

  await checkColumns('orders', [
    'id',
    'userId', 'user_id',
    'userName', 'user_name',
    'userEmail', 'user_email',
    'total', 'status',
    'createdAt', 'created_at',
    'deliveryAddress', 'delivery_address',
    'phone',
    'paymentMethod', 'payment_method'
  ]);

  await checkColumns('order_items', [
    'id',
    'orderId', 'order_id',
    'menuItemId', 'menu_item_id', 'foodItemId', 'food_item_id',
    'name', 'price', 'quantity', 'size',
    'spiceLevel', 'spice_level'
  ]);
}

run();
