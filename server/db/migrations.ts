import bcrypt from 'bcryptjs';
import { localStorage } from './index';

export async function runMigrationsAndSeed(force: boolean = false) {
  console.log('[Database] Checking migrations & seed data...');

  if (force) {
    localStorage.clearAll();
  }

  // 1. Seed Categories if empty
  if (localStorage.count('categories') === 0) {
    const categories = [
      // Food categories
      { name: 'Starters', slug: 'starters', type: 'food', display_order: 1, is_active: 1 },
      { name: 'Main Courses', slug: 'main-courses', type: 'food', display_order: 2, is_active: 1 },
      { name: 'Burgers', slug: 'burgers', type: 'food', display_order: 3, is_active: 1 },
      { name: 'Pizza', slug: 'pizza', type: 'food', display_order: 4, is_active: 1 },
      { name: 'Chicken', slug: 'chicken', type: 'food', display_order: 5, is_active: 1 },
      { name: 'Chips', slug: 'chips', type: 'food', display_order: 6, is_active: 1 },
      { name: 'Sandwiches', slug: 'sandwiches', type: 'food', display_order: 7, is_active: 1 },
      { name: 'Desserts', slug: 'desserts', type: 'food', display_order: 8, is_active: 1 },
      { name: 'Other Food', slug: 'other-food', type: 'food', display_order: 9, is_active: 1 },

      // Drinks categories
      { name: 'Popular Drinks', slug: 'popular-drinks', type: 'drink', display_order: 10, is_active: 1 },
      { name: 'Mocktails', slug: 'mocktails', type: 'drink', display_order: 11, is_active: 1 },
      { name: 'Cocktails', slug: 'cocktails', type: 'drink', display_order: 12, is_active: 1 },
      { name: 'Wine', slug: 'wine', type: 'drink', display_order: 13, is_active: 1 },
      { name: 'Soft Drinks', slug: 'soft-drinks', type: 'drink', display_order: 14, is_active: 1 },
      { name: 'Other Drinks', slug: 'other-drinks', type: 'drink', display_order: 15, is_active: 1 }
    ];

    for (const cat of categories) {
      localStorage.insert('categories', cat);
    }
    console.log(`[Database] Seeded ${categories.length} categories.`);
  }

  // 2. Seed Initial Menu Items
  if (localStorage.count('menu_items') === 0) {
    const starterCat = localStorage.findOne('categories', (c) => c.slug === 'starters');
    const mainCat = localStorage.findOne('categories', (c) => c.slug === 'main-courses');
    const dessertCat = localStorage.findOne('categories', (c) => c.slug === 'desserts');
    const popDrinkCat = localStorage.findOne('categories', (c) => c.slug === 'popular-drinks');
    const mocktailCat = localStorage.findOne('categories', (c) => c.slug === 'mocktails');
    const cocktailCat = localStorage.findOne('categories', (c) => c.slug === 'cocktails');
    const wineCat = localStorage.findOne('categories', (c) => c.slug === 'wine');

    const menuItems = [
      // STARTERS
      {
        category_id: starterCat?.id || 1,
        name: 'Avocado Carpaccio',
        description: 'Delicately sliced Hass avocado infused with cold-pressed citrus oil, shaved baby radishes, toasted pine nuts, and micro-herbs.',
        price: 6000,
        image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 1
      },
      {
        category_id: starterCat?.id || 1,
        name: 'Pumpkin & Ginger Soup',
        description: 'Velvety roasted Musanze pumpkin soup infused with fresh ginger root, lemongrass, coconut cream swirl, and spiced pepitas.',
        price: 5500,
        image_url: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 0
      },
      {
        category_id: starterCat?.id || 1,
        name: 'Goat Cheese Bruschetta',
        description: 'Artisanal sourdough crostini layered with warm goat cheese, fig reduction, crushed walnuts, and fresh thyme from Kigali gardens.',
        price: 7000,
        image_url: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 1
      },

      // MAIN COURSES
      {
        category_id: mainCat?.id || 2,
        name: 'Grilled Nile Perch with Lemon Butter',
        description: 'Fresh Lake Victoria perch fillet pan-seared with herb-infused lemon butter sauce, served on a bed of sautéed greens and roasted baby potatoes.',
        price: 15000,
        image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 1
      },
      {
        category_id: mainCat?.id || 2,
        name: 'Moroccan Lamb Tagine',
        description: 'Slow-braised tender lamb shank with sweet apricots, toasted almonds, aromatic saffron-cinnamon broth, served with steamed couscous.',
        price: 18000,
        image_url: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 1
      },
      {
        category_id: mainCat?.id || 2,
        name: 'Wild Mushroom Risotto',
        description: 'Creamy carnaroli rice simmered in rich vegetable reduction with wild forest mushrooms, Parmigiano-Reggiano, and white truffle oil drizzle.',
        price: 14000,
        image_url: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 0
      },
      {
        category_id: mainCat?.id || 2,
        name: 'Boho Buddha Bowl',
        description: 'Organic Rwandan quinoa, grilled zucchini ribbons, spiced chickpeas, creamy avocado fan, and tahini-maple drizzle.',
        price: 12000,
        image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 0
      },

      // DRINKS
      {
        category_id: popDrinkCat?.id || 10,
        name: 'Fresh Hibiscus Iced Tea',
        description: 'Handcrafted infusion of organic hibiscus petals, wild mint, crushed ginger, and pure Rwandan raw honey over crystal ice.',
        price: 4500,
        image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
        type: 'drink',
        is_available: 1,
        is_popular: 1
      },
      {
        category_id: cocktailCat?.id || 12,
        name: 'Kigali Sunset Spritz',
        description: 'Craft cocktail featuring artisanal Aperol, prosecco, fresh passion fruit nectar, and sparkling botanical soda.',
        price: 9500,
        image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
        type: 'drink',
        is_available: 1,
        is_popular: 1
      },
      {
        category_id: cocktailCat?.id || 12,
        name: 'Golden Smoked Old Fashioned',
        description: 'Premium bourbon, Angostura bitters, raw demerara syrup, smoked with cedar wood and garnished with edible gold leaf.',
        price: 11000,
        image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
        type: 'drink',
        is_available: 1,
        is_popular: 1
      },
      {
        category_id: wineCat?.id || 13,
        name: 'Bordeaux Grand Reserve Glass',
        description: 'Deep ruby French red blend with opulent aromas of blackcurrant, dark chocolate, and French oak.',
        price: 12500,
        image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
        type: 'drink',
        is_available: 1,
        is_popular: 1
      },
      {
        category_id: wineCat?.id || 13,
        name: 'Sauvignon Blanc Imported Glass',
        description: 'Crisp, vibrant white wine with bright citrus blossom, passion fruit notes, and a refreshing mineral finish.',
        price: 11000,
        image_url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80',
        type: 'drink',
        is_available: 1,
        is_popular: 0
      },
      {
        category_id: mocktailCat?.id || 11,
        name: 'Rwandan Garden Basil Mocktail',
        description: 'Signature mocktail with muddled garden basil, cold-pressed lime juice, crushed cucumber, and sparkling ginger beer.',
        price: 6500,
        image_url: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=800&q=80',
        type: 'drink',
        is_available: 1,
        is_popular: 1
      },

      // DESSERTS
      {
        category_id: dessertCat?.id || 8,
        name: 'Passion Fruit Cheesecake',
        description: 'Velvety baked New York style cheesecake crowned with tart Rwandan passion fruit coulis on a buttery speculoos crust.',
        price: 7500,
        image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 1
      },
      {
        category_id: dessertCat?.id || 8,
        name: 'Chocolate Lava Cake',
        description: 'Warm Valrhona dark chocolate cake with a molten truffle center, accompanied by house-made bourbon vanilla bean gelato.',
        price: 8000,
        image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 1
      },
      {
        category_id: dessertCat?.id || 8,
        name: 'Exotic Fruit Tart',
        description: 'Crisp almond sablé pastry shell filled with silky vanilla diplomat cream, topped with fresh seasonal tropical fruits.',
        price: 6500,
        image_url: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 0
      }
    ];

    for (const item of menuItems) {
      localStorage.insert('menu_items', item);
    }
    console.log(`[Database] Seeded ${menuItems.length} initial menu items.`);
  }

  // 3. Seed Default Admin
  if (localStorage.count('admins') === 0) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('Admin@Eko2026!', salt);

    localStorage.insert('admins', {
      username: 'admin',
      email: 'mugishamp7@gmail.com',
      password_hash: passwordHash,
      role: 'superadmin'
    });
    console.log('[Database] Seeded default administrator account.');
  }

  // 4. Seed Restaurant Settings
  if (localStorage.count('restaurant_settings') === 0) {
    const settings = [
      { setting_key: 'restaurant_name', setting_value: 'Eko Restaurant', description: 'Official Restaurant Brand' },
      { setting_key: 'restaurant_type', setting_value: 'Luxury Fine-Dining Restaurant', description: 'Dining Classification' },
      { setting_key: 'location_address', setting_value: 'Kigali, KK 554', description: 'Physical Address' },
      { setting_key: 'phone_number', setting_value: '0701537890', description: 'Primary Phone' },
      { setting_key: 'whatsapp_number', setting_value: '0701537890', description: 'WhatsApp Business Number' },
      { setting_key: 'email_address', setting_value: 'mugishamp7@gmail.com', description: 'Official Admin Email' },
      { setting_key: 'opening_hours', setting_value: 'Every day, 10:00–23:00', description: 'Operating Hours' },
      { setting_key: 'currency', setting_value: 'RWF', description: 'Currency Code' },
      { setting_key: 'slogan', setting_value: 'A Symphony of Flavors, Where Kigali Meets Culinary Artistry', description: 'Official Slogan' },
      { setting_key: 'about_story', setting_value: 'Eko Restaurant in Kigali celebrates the harmony of authentic Rwandan ingredients elevated by French and international culinary techniques.', description: 'Brand Story' },
      { setting_key: 'max_table_capacity', setting_value: '60', description: 'Configurable Table Seating Capacity' },
      { setting_key: 'delivery_base_fee', setting_value: '1500', description: 'Base Kigali Delivery Fee (RWF)' },
      { setting_key: 'delivery_fee_per_km', setting_value: '500', description: 'Delivery Fee Per KM (RWF)' }
    ];

    for (const s of settings) {
      localStorage.insert('restaurant_settings', s);
    }
    console.log(`[Database] Seeded ${settings.length} restaurant settings.`);
  }

  // 5. Seed Initial Gallery
  if (localStorage.count('gallery') === 0) {
    const galleryItems = [
      {
        title: 'Grand Dining Hall',
        description: 'Immerse yourself in understated luxury with warm ambient lighting and bespoke table settings.',
        image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
        category: 'Interior',
        display_order: 1
      },
      {
        title: 'Gastronomic Artistry',
        description: 'Every plate is an orchestrated balance of texture, color, and exquisite flavor.',
        image_url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
        category: 'Food',
        display_order: 2
      },
      {
        title: 'The Golden Bar & Lounge',
        description: 'Handcrafted signature cocktails and premier wines curated by master mixologists.',
        image_url: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=1200&q=80',
        category: 'Bar',
        display_order: 3
      },
      {
        title: 'VIP Private Dining Suite',
        description: 'Exclusive, intimate dining sanctuary for business dinners and celebratory occasions.',
        image_url: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1200&q=80',
        category: 'Interior',
        display_order: 4
      },
      {
        title: 'Kigali Sunset Terrace',
        description: 'Breathtaking open-air terrace overlooking the illuminated hills of Kigali.',
        image_url: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=1200&q=80',
        category: 'Terrace',
        display_order: 5
      },
      {
        title: 'Artisanal Patisserie & Desserts',
        description: 'Handcrafted confectioneries and rich Belgian-Rwandan chocolate creations.',
        image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1200&q=80',
        category: 'Food',
        display_order: 6
      },
      {
        title: 'Mixology Craft Station',
        description: 'Smoked infusions, Rwandan botanical syrups, and bespoke crystal glassware.',
        image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80',
        category: 'Bar',
        display_order: 7
      },
      {
        title: 'Romantic Candlelit Garden',
        description: 'Secluded garden alcove beneath the stars for extraordinary dining memories.',
        image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
        category: 'Terrace',
        display_order: 8
      }
    ];

    for (const g of galleryItems) {
      localStorage.insert('gallery', g);
    }
    console.log(`[Database] Seeded ${galleryItems.length} gallery images.`);
  }

  console.log('[Database] Migrations and seeding completed successfully.');
}
