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
  await checkColumns('orders', [
    'phone_no', 'contact_phone', 'phone', 'phone_number',
    'payment_type', 'payment_mode', 'payment_option', 'payment_method',
    'notes', 'customization', 'metadata'
  ]);

  await checkColumns('order_items', [
    'customization', 'notes', 'options', 'metadata', 'size', 'spice_level'
  ]);
}

run();
