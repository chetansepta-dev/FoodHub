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
        // do nothing
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
    'full_name', 'fullname', 'username', 'display_name',
    'avatar', 'avatar_url', 'avatarUrl',
    'created_at', 'updated_at', 'role'
  ]);

  await checkColumns('food_items', [
    'image_url', 'imageUrl', 'img', 'img_url',
    'available', 'availability',
    'prep_time', 'prepTime',
    'spice', 'spice_level', 'spiceLevel',
    'rating', 'stars',
    'cal', 'calories',
    'veg', 'vegetarian', 'is_veg', 'is_vegetarian'
  ]);

  await checkColumns('orders', [
    'user_id', 'userId',
    'userName', 'user_name', 'customer_name', 'customerName',
    'userEmail', 'user_email', 'customer_email', 'customerEmail',
    'total', 'total_price', 'total_amount', 'amount',
    'status', 'order_status',
    'created_at', 'createdAt',
    'delivery_address', 'deliveryAddress', 'address',
    'phone', 'phone_number',
    'payment_method', 'paymentMethod'
  ]);

  await checkColumns('order_items', [
    'order_id', 'orderId',
    'menuItemId', 'menu_item_id', 'foodItemId', 'food_item_id', 'food_id', 'foodId',
    'name', 'dish_name', 'title',
    'price', 'unit_price',
    'quantity', 'qty',
    'size', 'portion_size',
    'spiceLevel', 'spice_level'
  ]);
}

run();
