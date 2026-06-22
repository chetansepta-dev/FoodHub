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

// Override global fetch
const originalFetch = globalThis.fetch;
globalThis.fetch = function(input, init) {
  console.log('\n[FETCH CALL]');
  console.log('URL:', input);
  console.log('Headers:', init ? init.headers : 'none');
  return originalFetch.apply(this, arguments);
};

const supabase = createClient(url, key);

async function run() {
  console.log('Running test query...');
  const { data, error } = await supabase.from('food_items').select('*').limit(1);
  console.log('Result data:', data, 'error:', error);
}

run();
