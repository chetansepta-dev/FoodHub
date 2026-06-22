const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manually parse .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] ? match[2].trim() : '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.substring(1, value.length - 1);
    }
    env[match[1]] = value;
  }
});

let url = env.NEXT_PUBLIC_SUPABASE_URL;
if (url && url.endsWith('/rest/v1/')) {
  url = url.substring(0, url.length - 8);
}
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Using URL:', url);
console.log('Using Key suffix:', key ? key.substring(key.length - 5) : 'none');

const supabase = createClient(url, key);

async function run() {
  try {
    const { data: items, error: itemsErr } = await supabase.from('food_items').select('*').limit(1);
    console.log('food_items sample:', items, 'error:', itemsErr);

    const { data: profiles, error: profilesErr } = await supabase.from('profiles').select('*').limit(1);
    console.log('profiles sample:', profiles, 'error:', profilesErr);

    const { data: orders, error: ordersErr } = await supabase.from('orders').select('*').limit(1);
    console.log('orders sample:', orders, 'error:', ordersErr);

    const { data: orderItems, error: orderItemsErr } = await supabase.from('order_items').select('*').limit(1);
    console.log('order_items sample:', orderItems, 'error:', orderItemsErr);
  } catch (e) {
    console.error('Error running query:', e);
  }
}

run();
