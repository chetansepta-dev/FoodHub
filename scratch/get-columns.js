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
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(url, key);

async function run() {
  const tables = ['food_items', 'profiles', 'orders', 'order_items'];
  for (const table of tables) {
    console.log(`\n--- COLUMNS FOR ${table} ---`);
    // Query PostgREST's schema description endpoint if accessible, or query using RPC if configured.
    // Since we don't have direct SQL or RPC, let's try inserting a dummy object and check the error message which lists valid columns,
    // or try fetching from PostgREST API schema documentation (GET /).
    // Let's first try fetching the root OpenAPI spec of PostgREST which describes all tables and columns!
    try {
      const response = await fetch(`${url}/rest/v1/`, {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`
        }
      });
      const spec = await response.json();
      if (spec.definitions && spec.definitions[table]) {
        const properties = spec.definitions[table].properties;
        for (const [colName, colSpec] of Object.entries(properties)) {
          console.log(`- ${colName}: ${colSpec.type} (${colSpec.format || ''}) ${colSpec.description || ''}`);
        }
      } else {
        console.log(`No definitions found in OpenAPI spec for ${table}, trying to fetch one row or error out`);
        // Try inserting an empty object to see the validation error or columns
        const { error } = await supabase.from(table).insert({});
        console.log('Error output for empty insert:', error);
      }
    } catch (e) {
      console.error('Failed to get schema info for table:', table, e);
    }
  }
}

run();
