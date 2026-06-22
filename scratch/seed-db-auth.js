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

const mockMenuItems = [
  {
    id: 1,
    name: 'Garlic Bruschetta',
    description: 'Toasted artisan bread topped with diced vine-ripened tomatoes, fresh garlic, basil, and a drizzle of extra virgin olive oil and balsamic glaze.',
    price: 199.00,
    category: 'Starters',
    image_url: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    name: 'Crispy Stuffed Mushrooms',
    description: 'Plump cremini mushrooms filled with a savory blend of three cheeses, fresh herbs, and breadcrumbs, baked until golden brown.',
    price: 249.00,
    category: 'Starters',
    image_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    name: 'Spicy Chicken Satay',
    description: 'Grilled skewered chicken marinated in aromatic spices, served with a creamy cucumber relish and our signature house peanut dipping sauce.',
    price: 279.00,
    category: 'Starters',
    image_url: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    name: 'Signature Ribeye Steak',
    description: '12oz USDA Prime Ribeye steak, garlic-herb butter-basted, grilled to perfection. Served with truffle mashed potatoes and roasted asparagus.',
    price: 1299.00,
    category: 'Main Course',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 5,
    name: 'Pan-Seared Salmon Fillet',
    description: 'Crispy skin salmon served over wild rice pilaf, wilted baby spinach, and topped with a bright lemon dill butter sauce.',
    price: 899.00,
    category: 'Main Course',
    image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 6,
    name: 'Truffle Mushroom Risotto',
    description: 'Creamy Arborio rice simmered with wild forest mushrooms, Parmigiano-Reggiano, and finished with white truffle oil and fresh parsley.',
    price: 699.00,
    category: 'Main Course',
    image_url: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 7,
    name: 'Thai Spicy Green Curry',
    description: 'A rich and fiery green coconut curry loaded with broccoli, bamboo shoots, bell peppers, fresh basil, and chicken. Served with jasmine rice.',
    price: 499.00,
    category: 'Main Course',
    image_url: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 8,
    name: 'Chocolate Lava Cake',
    description: 'Warm dark chocolate cake with a molten chocolate center, served with fresh raspberries and a scoop of vanilla bean gelato.',
    price: 249.00,
    category: 'Desserts',
    image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 9,
    name: 'Classic Espresso Tiramisu',
    description: 'Layers of espresso-soaked ladyfingers, whipped mascarpone cream, dusted with dark cocoa powder and espresso beans.',
    price: 229.00,
    category: 'Desserts',
    image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 10,
    name: 'Strawberry NY Cheesecake',
    description: 'Rich and creamy New York-style cheesecake on a graham cracker crust, smothered with sweet strawberry compote.',
    price: 229.00,
    category: 'Desserts',
    image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 11,
    name: 'Fresh Mint Mojito',
    description: 'A refreshing muddle of fresh mint leaves, lime wedges, sugar cane syrup, topped with sparkling soda water and crushed ice.',
    price: 149.00,
    category: 'Drinks',
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 12,
    name: 'Premium Iced Latte',
    description: 'Double shot of organic espresso poured over chilled whole milk and sweet vanilla bean syrup, served over ice.',
    price: 179.00,
    category: 'Drinks',
    image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 13,
    name: 'Wild Berry Smoothie',
    description: 'A delicious blended treat of wild strawberries, blueberries, blackberries, Greek yogurt, and a touch of wild honey.',
    price: 199.00,
    category: 'Drinks',
    image_url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80'
  }
];

async function run() {
  const email = 'admin@foodhub.com';
  const password = 'Password123!';

  console.log('1. Authenticating as admin...');
  let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError) {
    console.log('Admin sign in failed, attempting signup...', authError.message);
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    });
    if (signUpError) {
      console.error('Failed to sign up admin:', signUpError);
      return;
    }
    authData = signUpData;
  }

  console.log('Auth success! User ID:', authData.user?.id || authData.session?.user?.id);

  console.log('Clearing existing food items to prevent residual USD records...');
  const { error: deleteError } = await supabase.from('food_items').delete().neq('id', 0);
  if (deleteError) {
    console.error('Error clearing old data:', deleteError);
  }

  console.log('2. Seeding food_items with correct columns while authenticated as admin...');
  const { data: insertedData, error: insertErr } = await supabase
    .from('food_items')
    .upsert(mockMenuItems)
    .select();

  if (insertErr) {
    console.error('Insert error:', insertErr);
  } else {
    console.log('Food items seeded successfully! Count:', insertedData ? insertedData.length : 0);
  }
}

run();
