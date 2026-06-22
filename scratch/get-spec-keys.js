const fs = require('fs');
const path = require('path');

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
// Clean trailing slashes
url = url.replace(/\/+$/, '');
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function run() {
  const targetUrl = `${url}/rest/v1/`;
  console.log('Fetching spec from:', targetUrl);
  try {
    const response = await fetch(targetUrl, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    const spec = await response.json();
    console.log('Root keys:', Object.keys(spec));
    console.log('Definitions:', Object.keys(spec.definitions || {}));
    if (spec.message) {
      console.log('Message:', spec.message);
    } else {
      // Print food_items definition details if exists
      if (spec.definitions && spec.definitions.food_items) {
        console.log('food_items properties:', Object.keys(spec.definitions.food_items.properties || {}));
      }
      if (spec.definitions && spec.definitions.profiles) {
        console.log('profiles properties:', Object.keys(spec.definitions.profiles.properties || {}));
      }
      if (spec.definitions && spec.definitions.orders) {
        console.log('orders properties:', Object.keys(spec.definitions.orders.properties || {}));
      }
      if (spec.definitions && spec.definitions.order_items) {
        console.log('order_items properties:', Object.keys(spec.definitions.order_items.properties || {}));
      }
    }
  } catch (e) {
    console.error('Failed:', e);
  }
}

run();
