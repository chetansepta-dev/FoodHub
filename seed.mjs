import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env.local
const envContent = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf8');
let supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim() || '';
const supabaseKey = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim() || '';

if (supabaseUrl.endsWith('/rest/v1/')) {
    supabaseUrl = supabaseUrl.substring(0, supabaseUrl.length - 9);
} else if (supabaseUrl.endsWith('/rest/v1')) {
    supabaseUrl = supabaseUrl.substring(0, supabaseUrl.length - 8);
}
supabaseUrl = supabaseUrl.replace(/\/+$/, '');

if (!supabaseUrl || !supabaseKey) {
  console.error('Could not parse Supabase credentials from .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const foodItems = [
  {
    id: 1,
    name: "Crispy Calamari",
    description: "Lightly breaded calamari rings served with a side of zesty marinara sauce and fresh lemon wedges.",
    price: 349.00,
    category: "Starters",
    image_url: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Garlic Parmesan Wings",
    description: "Crispy chicken wings tossed in a rich garlic parmesan sauce, served with celery and ranch.",
    price: 399.00,
    category: "Starters",
    image_url: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Truffle Fries",
    description: "Shoestring fries tossed with white truffle oil, parsley, and aged parmesan cheese.",
    price: 249.00,
    category: "Starters",
    image_url: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "Classic Bruschetta",
    description: "Toasted baguette slices topped with a fresh mixture of tomatoes, basil, garlic, and balsamic glaze.",
    price: 299.00,
    category: "Starters",
    image_url: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    name: "Spinach Artichoke Dip",
    description: "Creamy blend of spinach, artichoke hearts, and melted cheeses, served with warm tortilla chips.",
    price: 299.00,
    category: "Starters",
    image_url: "https://images.unsplash.com/photo-1588880628678-04664b4c10eb?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    name: "Grilled Ribeye Steak",
    description: "14oz premium ribeye steak grilled to perfection, served with garlic mashed potatoes and asparagus.",
    price: 1299.00,
    category: "Main Course",
    image_url: "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    name: "Pan-Seared Salmon",
    description: "Fresh Atlantic salmon pan-seared with a lemon butter caper sauce, served over quinoa.",
    price: 899.00,
    category: "Main Course",
    image_url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 8,
    name: "Classic Cheeseburger",
    description: "Half-pound Angus beef patty with cheddar cheese, lettuce, tomato, and house sauce on a brioche bun.",
    price: 499.00,
    category: "Main Course",
    image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 9,
    name: "Margherita Pizza",
    description: "Wood-fired pizza with San Marzano tomato sauce, fresh mozzarella, and basil leaves.",
    price: 599.00,
    category: "Main Course",
    image_url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 10,
    name: "Truffle Mushroom Risotto",
    description: "Creamy arborio rice simmered with wild mushrooms, white wine, and finished with truffle oil.",
    price: 699.00,
    category: "Main Course",
    image_url: "https://images.unsplash.com/photo-1633337474564-1d9e26b1c4fb?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 11,
    name: "Spicy Chicken Alfredo",
    description: "Fettuccine pasta tossed in a spicy, creamy alfredo sauce with blackened chicken breast.",
    price: 599.00,
    category: "Main Course",
    image_url: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 12,
    name: "BBQ Pork Ribs",
    description: "Slow-cooked, fall-off-the-bone pork ribs smothered in smoky BBQ sauce. Served with coleslaw.",
    price: 799.00,
    category: "Main Course",
    image_url: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 13,
    name: "New York Cheesecake",
    description: "Rich and creamy traditional New York style cheesecake with a graham cracker crust and berry compote.",
    price: 249.00,
    category: "Desserts",
    image_url: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 14,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a molten truffle center, served with vanilla bean ice cream.",
    price: 279.00,
    category: "Desserts",
    image_url: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 15,
    name: "Classic Tiramisu",
    description: "Elegant Italian dessert made with espresso-soaked ladyfingers and mascarpone cheese.",
    price: 269.00,
    category: "Desserts",
    image_url: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 16,
    name: "Vanilla Bean Panna Cotta",
    description: "Silky, chilled Italian cream dessert flavored with real vanilla bean and topped with fresh fruit.",
    price: 229.00,
    category: "Desserts",
    image_url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 17,
    name: "Classic Mojito",
    description: "Refreshing cocktail made with white rum, fresh mint leaves, lime juice, and club soda.",
    price: 299.00,
    category: "Drinks",
    image_url: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 18,
    name: "Mango Smoothie",
    description: "Tropical blend of fresh mangoes, yogurt, and a touch of honey.",
    price: 199.00,
    category: "Drinks",
    image_url: "https://images.unsplash.com/photo-1623065422900-058f96e41793?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 19,
    name: "Iced Caramel Macchiato",
    description: "Freshly pulled espresso poured over cold milk and ice, topped with a sweet caramel drizzle.",
    price: 149.00,
    category: "Drinks",
    image_url: "https://images.unsplash.com/photo-1461023058943-07cb1ce8db12?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 20,
    name: "Craft Lemonade",
    description: "House-made sparkling lemonade infused with fresh berries and a sprig of rosemary.",
    price: 129.00,
    category: "Drinks",
    image_url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80"
  }
];

async function seedDatabase() {
// Removed auth logic since it is rate limited

  console.log('Clearing existing food items...');
  const { error: deleteError } = await supabase.from('food_items').delete().neq('id', 0);
  
  if (deleteError) {
    console.error('Error clearing old data:', deleteError);
  }

  console.log('Inserting 20 realistic food items without IDs...');
  const itemsWithoutId = foodItems.map(({id, ...rest}) => rest);
  const { data, error } = await supabase.from('food_items').insert(itemsWithoutId);

  if (error) {
    console.error('Failed to seed food_items:', error);
  } else {
    console.log('Successfully seeded 20 food items!');
  }
}

seedDatabase();
