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
  const { data, error } = await supabase
    .from('order_items')
    .select('id, food_id, food_items(name)')
    .limit(0);

  if (error) {
    console.log('Relation check failed:', error.message);
  } else {
    console.log('Relation check succeeded! We can fetch food item names via join.');
  }
}

run();
