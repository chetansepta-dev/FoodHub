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
url = url.replace(/\/+$/, '');
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function run() {
  const foodItemsUrl = `${url}/rest/v1/food_items`;
  console.log('\n--- Fetching OPTIONS from:', foodItemsUrl);
  try {
    const response = await fetch(foodItemsUrl, {
      method: 'OPTIONS',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    console.log('Status:', response.status);
    console.log('Headers:');
    for (const [name, val] of response.headers.entries()) {
      console.log(`  ${name}: ${val}`);
    }
    const text = await response.text();
    console.log('Body:', text);
  } catch (e) {
    console.error('Failed OPTIONS:', e);
  }
}

run();
