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
      { name: 'Starters & First Foods', slug: 'starters', type: 'food', display_order: 1, is_active: 1 },
      { name: 'Main Courses', slug: 'main-courses', type: 'food', display_order: 2, is_active: 1 },
      { name: 'Desserts & Sweets', slug: 'desserts', type: 'food', display_order: 3, is_active: 1 },

      // Drinks categories
      { name: 'Cocktails & Spirits', slug: 'cocktails', type: 'drink', display_order: 4, is_active: 1 },
      { name: 'Mocktails & Refreshers', slug: 'mocktails', type: 'drink', display_order: 5, is_active: 1 },
      { name: 'Sommelier Wine Cellar', slug: 'wine', type: 'drink', display_order: 6, is_active: 1 },
      { name: 'Artisanal Coffee & Tea', slug: 'coffee', type: 'drink', display_order: 7, is_active: 1 },
      { name: 'Soft Drinks & Water', slug: 'soft-drinks', type: 'drink', display_order: 8, is_active: 1 }
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
    const cocktailCat = localStorage.findOne('categories', (c) => c.slug === 'cocktails');
    const mocktailCat = localStorage.findOne('categories', (c) => c.slug === 'mocktails');
    const wineCat = localStorage.findOne('categories', (c) => c.slug === 'wine');
    const coffeeCat = localStorage.findOne('categories', (c) => c.slug === 'coffee');

    const menuItems = [
      // 1. STARTERS / FIRST FOODS
      {
        category_id: starterCat?.id || 1,
        name: 'Carpaccio',
        description: 'Delicately sliced ripe Hass avocado and sweet yellow mango arranged in an elegant rosette fan, garnished with whipped goat cheese rosettes, fresh garden basil, and cracked black pepper.',
        price: 6000,
        image_url: '/images/avocado-carpaccio.jpg',
        type: 'food',
        is_available: 1,
        is_popular: 1,
        prep_time_minutes: 10,
        is_chef_special: 1,
        spicy_level: 0
      },
      {
        category_id: starterCat?.id || 1,
        name: 'Akabenz',
        description: 'Succulent pan-crisped pork belly bites glazed in local spiced honey and akabanga chili reduction, served over grilled sourdough crostini with pickled red onions.',
        price: 6500,
        image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 1,
        prep_time_minutes: 15,
        is_chef_special: 1,
        spicy_level: 2
      },
      {
        category_id: starterCat?.id || 1,
        name: 'Pumpkin Soup',
        description: 'Velvety roasted Musanze pumpkin soup infused with fresh ginger root, lemongrass, coconut cream swirl, and spiced pepitas.',
        price: 5500,
        image_url: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 0,
        prep_time_minutes: 15,
        is_chef_special: 0,
        spicy_level: 0
      },
      {
        category_id: starterCat?.id || 1,
        name: 'Bruschetta',
        description: 'Artisanal sourdough crostini layered with warm goat cheese, fig reduction, crushed walnuts, and fresh thyme from Kigali gardens.',
        price: 7000,
        image_url: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 1,
        prep_time_minutes: 12,
        is_chef_special: 1,
        spicy_level: 0
      },
      {
        category_id: starterCat?.id || 1,
        name: 'Ratatouille',
        description: 'Artfully spiraled medallions of golden squash, green zucchini, Japanese eggplant, and ripe vine tomatoes slow-baked over charred bell pepper and herb de Provence piperade coulis.',
        price: 9500,
        image_url: '/images/confit-byaldi-ratatouille.jpg',
        type: 'food',
        is_available: 1,
        is_popular: 1,
        prep_time_minutes: 20,
        is_chef_special: 1,
        spicy_level: 0
      },
      {
        category_id: starterCat?.id || 1,
        name: 'Garden Salad',
        description: 'Crisp organic hydroponic greens, avocado ribbons, cherry tomatoes, toasted pumpkin seeds, and fresh passion fruit vinaigrette.',
        price: 5000,
        image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 0,
        prep_time_minutes: 10,
        is_chef_special: 0,
        spicy_level: 0
      },

      // 2. MAIN COURSES
      {
        category_id: mainCat?.id || 2,
        name: 'Ribeye Steak',
        description: '350g char-grilled aged prime beef ribeye steak cooked to perfection, served with crispy roasted hasselback potato, butter-glazed asparagus, and rich red wine jus.',
        price: 22000,
        image_url: '/images/prime-ribeye-steak.jpg',
        type: 'food',
        is_available: 1,
        is_popular: 1,
        prep_time_minutes: 25,
        is_chef_special: 1,
        spicy_level: 0
      },
      {
        category_id: mainCat?.id || 2,
        name: 'Grilled Fish',
        description: 'Fresh Lake Victoria perch fillet pan-seared with herb-infused lemon butter sauce, served on a bed of sautéed greens and roasted baby potatoes.',
        price: 15000,
        image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 1,
        prep_time_minutes: 20,
        is_chef_special: 1,
        spicy_level: 0
      },
      {
        category_id: mainCat?.id || 2,
        name: 'Lamb Tagine',
        description: 'Slow-braised tender lamb shank with sweet apricots, toasted almonds, aromatic saffron-cinnamon broth, served with steamed couscous.',
        price: 18000,
        image_url: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 1,
        prep_time_minutes: 25,
        is_chef_special: 1,
        spicy_level: 0
      },
      {
        category_id: mainCat?.id || 2,
        name: 'Chicken Schnitzel',
        description: 'Golden panko-crusted chicken cutlet served atop handmade ribbon fettuccine in a velvety garlic-Parmigiano cream sauce, with roasted cherry tomatoes and crispy sage.',
        price: 14500,
        image_url: '/images/chicken-schnitzel-fettuccine.jpg',
        type: 'food',
        is_available: 1,
        is_popular: 1,
        prep_time_minutes: 20,
        is_chef_special: 1,
        spicy_level: 0
      },
      {
        category_id: mainCat?.id || 2,
        name: 'Roast Chicken',
        description: 'Free-range chicken breast with wild thyme jus, velvety potato mousseline, and butter-glazed baby carrots.',
        price: 13500,
        image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 0,
        prep_time_minutes: 20,
        is_chef_special: 0,
        spicy_level: 0
      },
      {
        category_id: mainCat?.id || 2,
        name: 'Risotto',
        description: 'Creamy carnaroli rice simmered in rich vegetable reduction with wild forest mushrooms, Parmigiano-Reggiano, and white truffle oil drizzle.',
        price: 14000,
        image_url: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 0,
        prep_time_minutes: 20,
        is_chef_special: 0,
        spicy_level: 0
      },
      {
        category_id: mainCat?.id || 2,
        name: 'Quinoa Bowl',
        description: 'Organic Rwandan quinoa, grilled zucchini ribbons, spiced chickpeas, creamy avocado fan, and tahini-maple drizzle.',
        price: 12000,
        image_url: '/images/boho-buddha-bowl.jpg',
        type: 'food',
        is_available: 1,
        is_popular: 0,
        prep_time_minutes: 15,
        is_chef_special: 0,
        spicy_level: 0
      },

      // 3. DESSERTS & SWEETS
      {
        category_id: dessertCat?.id || 8,
        name: 'Lava Cake',
        description: 'Warm Valrhona dark chocolate cake with a molten truffle center, accompanied by house-made bourbon vanilla bean gelato.',
        price: 8000,
        image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 1,
        prep_time_minutes: 15,
        is_chef_special: 1,
        spicy_level: 0
      },
      {
        category_id: dessertCat?.id || 8,
        name: 'Cheesecake',
        description: 'Velvety baked New York style cheesecake crowned with tart Rwandan passion fruit coulis on a buttery speculoos crust.',
        price: 7500,
        image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 1,
        prep_time_minutes: 10,
        is_chef_special: 1,
        spicy_level: 0
      },
      {
        category_id: dessertCat?.id || 8,
        name: 'Crème Brûlée',
        description: 'Classic French custard infused with Bourbon vanilla, finished with a caramelized brittle sugar crust and fresh berries.',
        price: 7000,
        image_url: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 1,
        prep_time_minutes: 10,
        is_chef_special: 1,
        spicy_level: 0
      },
      {
        category_id: dessertCat?.id || 8,
        name: 'Honey Cake',
        description: 'Multi-layered delicate sponge cake infused with raw Rwandan forest honey and whipped sweet sour cream frosting.',
        price: 7000,
        image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 0,
        prep_time_minutes: 10,
        is_chef_special: 0,
        spicy_level: 0
      },
      {
        category_id: dessertCat?.id || 8,
        name: 'Fruit Tart',
        description: 'Crisp almond sablé pastry shell filled with silky vanilla diplomat cream, topped with fresh seasonal tropical fruits.',
        price: 6500,
        image_url: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 0,
        prep_time_minutes: 10,
        is_chef_special: 0,
        spicy_level: 0
      },
      {
        category_id: dessertCat?.id || 8,
        name: 'Sorbet',
        description: 'Refreshing trio of house-churned passionfruit, mango-lime, and hibiscus flower sorbets with fresh garden mint.',
        price: 5500,
        image_url: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 0,
        prep_time_minutes: 5,
        is_chef_special: 0,
        spicy_level: 0
      },

      // 4. BEVERAGES & SOMMELIER
      {
        category_id: cocktailCat?.id || 12,
        name: 'Aperol Spritz',
        description: 'Craft cocktail featuring artisanal Aperol, prosecco, fresh passion fruit nectar, and sparkling botanical soda.',
        price: 9500,
        image_url: '/images/kigali-sunset-spritz.jpg',
        type: 'drink',
        is_available: 1,
        is_popular: 1,
        prep_time_minutes: 5,
        is_chef_special: 1,
        spicy_level: 0
      },
      {
        category_id: cocktailCat?.id || 12,
        name: 'Pornstar Martini',
        description: 'Exquisite cocktail blending premium vanilla vodka, Passoã passion fruit liqueur, fresh passion fruit puree, and lime, served with a chilled shot of sparkling Prosecco.',
        price: 9000,
        image_url: '/images/pornstar-martini.jpg',
        type: 'drink',
        is_available: 1,
        is_popular: 1,
        prep_time_minutes: 5,
        is_chef_special: 1,
        spicy_level: 0
      },
      {
        category_id: cocktailCat?.id || 12,
        name: 'Old Fashioned',
        description: 'Premium bourbon, Angostura bitters, raw demerara syrup, smoked with cedar wood and garnished with edible gold leaf.',
        price: 11000,
        image_url: '/images/golden-smoked-cocktail.jpg',
        type: 'drink',
        is_available: 1,
        is_popular: 1,
        prep_time_minutes: 5,
        is_chef_special: 1,
        spicy_level: 0
      },
      {
        category_id: cocktailCat?.id || 12,
        name: 'Margarita',
        description: 'Artisanal golden cocktail with subtle amber botanicals, dried citrus, and delicate honeyed warmth.',
        price: 16500,
        image_url: '/images/golden-goss-cocktail.jpg',
        type: 'drink',
        is_available: 1,
        is_popular: 1,
        prep_time_minutes: 5,
        is_chef_special: 1,
        spicy_level: 0
      },
      {
        category_id: cocktailCat?.id || 12,
        name: 'Gin & Tonic',
        description: 'Vibrant pink botanical gin infused with wild berries and hibiscus, paired with artisanal Indian tonic, fresh pink grapefruit wheel, and crushed crystal ice.',
        price: 8000,
        image_url: '/images/pink-gin-spritz.jpg',
        type: 'drink',
        is_available: 1,
        is_popular: 1,
        prep_time_minutes: 5,
        is_chef_special: 0,
        spicy_level: 0
      },
      {
        category_id: wineCat?.id || 13,
        name: 'Red Wine',
        description: 'Deep ruby French Bordeaux Grand Réserve red blend with opulent aromas of blackcurrant, dark chocolate, and French oak.',
        price: 12500,
        image_url: '/images/bordeaux-grand-reserve.jpg',
        type: 'drink',
        is_available: 1,
        is_popular: 1,
        prep_time_minutes: 3,
        is_chef_special: 1,
        spicy_level: 0
      },
      {
        category_id: wineCat?.id || 13,
        name: 'White Wine',
        description: 'Crisp, vibrant Marlborough Sauvignon Blanc white wine with bright citrus blossom, passion fruit notes, and a refreshing mineral finish.',
        price: 11000,
        image_url: '/images/sauvignon-blanc-wine.jpg',
        type: 'drink',
        is_available: 1,
        is_popular: 0,
        prep_time_minutes: 3,
        is_chef_special: 0,
        spicy_level: 0
      },
      {
        category_id: mocktailCat?.id || 11,
        name: 'Virgin Mojito',
        description: 'Signature mocktail with muddled garden basil and mint, cold-pressed lime juice, crushed cucumber, and sparkling ginger beer.',
        price: 6500,
        image_url: '/images/basil-mocktail.jpg',
        type: 'drink',
        is_available: 1,
        is_popular: 1,
        prep_time_minutes: 5,
        is_chef_special: 1,
        spicy_level: 0
      },
      {
        category_id: mocktailCat?.id || 11,
        name: 'Iced Tea',
        description: 'Handcrafted infusion of organic hibiscus petals, wild mint, crushed ginger, and pure Rwandan raw honey over crystal ice.',
        price: 4500,
        image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
        type: 'drink',
        is_available: 1,
        is_popular: 1,
        prep_time_minutes: 5,
        is_chef_special: 0,
        spicy_level: 0
      },
      {
        category_id: coffeeCat?.id || 16,
        name: 'Espresso',
        description: 'Double shot of high-altitude Lake Kivu Red Bourbon Arabica espresso, featuring rich golden crema, bright citrus blossom undertones, and a velvety dark cocoa finish.',
        price: 3500,
        image_url: '/images/rwanda-bourbon-espresso.jpg',
        type: 'drink',
        is_available: 1,
        is_popular: 1,
        prep_time_minutes: 5,
        is_chef_special: 1,
        spicy_level: 0
      },
      {
        category_id: coffeeCat?.id || 16,
        name: 'Cappuccino',
        description: 'Double shot of Rwandan specialty espresso topped with micro-foamed organic whole milk, handcrafted rosette latte art, and dusted with freshly ground Rwandan hill cinnamon.',
        price: 4500,
        image_url: '/images/artisanal-cappuccino.jpg',
        type: 'drink',
        is_available: 1,
        is_popular: 1,
        prep_time_minutes: 5,
        is_chef_special: 1,
        spicy_level: 0
      },
      {
        category_id: coffeeCat?.id || 16,
        name: 'Iced Latte',
        description: 'Chilled double-extracted Rwandan Arabica espresso swirled through cold fresh creamy milk and pure Madagascar-Nyungwe vanilla syrup over crystal ice rocks.',
        price: 5000,
        image_url: '/images/iced-bourbon-latte.jpg',
        type: 'drink',
        is_available: 1,
        is_popular: 1,
        prep_time_minutes: 5,
        is_chef_special: 0,
        spicy_level: 0
      }
    ];

    for (const item of menuItems) {
      localStorage.insert('menu_items', item);
    }
    console.log(`[Database] Seeded ${menuItems.length} initial menu items.`);
  }

  // 3. Seed Default Admins
  const defaultAdmins = [
    { username: 'admin', email: 'admin@eko.rw' },
    { username: 'mucyo', email: 'mucyo357@gmail.com' },
    { username: 'mugisha', email: 'mugishamp7@gmail.com' },
    { username: 'murasa', email: 'murasa320@gmail.com' }
  ];

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('admin123', salt);

  for (const adm of defaultAdmins) {
    const existing = localStorage.findOne('admins', (a: any) => 
      a.username.toLowerCase() === adm.username.toLowerCase() || 
      a.email.toLowerCase() === adm.email.toLowerCase()
    );
    if (!existing) {
      localStorage.insert('admins', {
        username: adm.username,
        email: adm.email,
        password_hash: passwordHash,
        role: 'superadmin'
      });
    } else {
      localStorage.update('admins', existing.id, {
        password_hash: passwordHash,
        role: 'superadmin'
      });
    }
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

  // Ensure highlighted culinary creations are registered in the menu catalog with famous names
  const newCulinaryCreations = [
    {
      category_slug: 'cocktails',
      name: 'Gin & Tonic',
      description: 'Vibrant pink botanical gin infused with wild berries and hibiscus, paired with artisanal Indian tonic, fresh pink grapefruit wheel, and crushed crystal ice.',
      price: 8000,
      image_url: '/images/pink-gin-spritz.jpg',
      type: 'drink',
      is_available: 1,
      is_popular: 1
    },
    {
      category_slug: 'cocktails',
      name: 'Margarita',
      description: 'Artisanal golden cocktail with subtle amber botanicals, dried citrus, and delicate honeyed warmth.',
      price: 16500,
      image_url: '/images/golden-goss-cocktail.jpg',
      type: 'drink',
      is_available: 1,
      is_popular: 1
    },
    {
      category_slug: 'main-courses',
      name: 'Ribeye Steak',
      description: '350g char-grilled aged prime beef ribeye steak cooked to perfection, served with crispy roasted hasselback potato, butter-glazed asparagus, and rich red wine jus.',
      price: 22000,
      image_url: '/images/prime-ribeye-steak.jpg',
      type: 'food',
      is_available: 1,
      is_popular: 1
    },
    {
      category_slug: 'main-courses',
      name: 'Chicken Schnitzel',
      description: 'Golden panko-crusted chicken cutlet served atop handmade ribbon fettuccine in a velvety garlic-Parmigiano cream sauce, with roasted cherry tomatoes and crispy sage.',
      price: 14500,
      image_url: '/images/chicken-schnitzel-fettuccine.jpg',
      type: 'food',
      is_available: 1,
      is_popular: 1
    },
    {
      category_slug: 'starters',
      name: 'Ratatouille',
      description: 'Artfully spiraled medallions of golden squash, green zucchini, Japanese eggplant, and ripe vine tomatoes slow-baked over charred bell pepper and herb de Provence piperade coulis.',
      price: 9500,
      image_url: '/images/confit-byaldi-ratatouille.jpg',
      type: 'food',
      is_available: 1,
      is_popular: 1
    }
  ];

  for (const item of newCulinaryCreations) {
    const existing = localStorage.findOne('menu_items', (i) => i.name.toLowerCase() === item.name.toLowerCase());
    const cat = localStorage.findOne('categories', (c) => c.slug === item.category_slug);
    const category_id = cat ? cat.id : (item.type === 'food' ? 2 : 12);
    
    if (existing) {
      localStorage.update('menu_items', existing.id, {
        name: item.name,
        description: item.description,
        price: item.price,
        image_url: item.image_url,
        type: item.type,
        category_id,
        is_available: 1,
        is_popular: 1
      });
    }
  }

  // Ensure Avocado Carpaccio has the updated image asset and short famous name
  const carpaccioItems = localStorage.find('menu_items', (item) => item.name.toLowerCase().includes('carpaccio') || item.name.toLowerCase().includes('avocado'));
  for (const item of carpaccioItems) {
    localStorage.update('menu_items', item.id, {
      name: 'Carpaccio',
      image_url: '/images/avocado-carpaccio.jpg',
      description: 'Delicately sliced ripe Hass avocado and sweet yellow mango arranged in an elegant rosette fan, garnished with whipped goat cheese rosettes, fresh garden basil, and cracked black pepper.'
    });
  }

  // Purge removed menu items (Sambaza, Truffle Mushroom, Samosas, Nyama Choma, Grilled Jumbo, Handcrafted Truffle)
  const namesToRemove = [
    'crispy lake kivu sambaza',
    'truffle mushroom & plantain croquettes',
    'spiced gourmet beef samosas',
    'eko signature nyama choma platter',
    'grilled jumbo king prawns',
    'handcrafted truffle tagliatelle'
  ];

  const menuItemsToDelete = localStorage.find('menu_items', (item) => {
    const lower = item.name.toLowerCase();
    return namesToRemove.some(rem => lower.includes(rem) || rem.includes(lower));
  });

  for (const item of menuItemsToDelete) {
    localStorage.delete('menu_items', item.id);
  }

  // Convert all remaining menu items to short single famous names
  const famousRules: { test: (n: string) => boolean; newName: string }[] = [
    // Foods
    { test: (n) => /carpaccio/i.test(n), newName: 'Carpaccio' },
    { test: (n) => /pumpkin|velout/i.test(n), newName: 'Pumpkin Soup' },
    { test: (n) => /bruschetta/i.test(n), newName: 'Bruschetta' },
    { test: (n) => /ratatouille|byaldi/i.test(n), newName: 'Ratatouille' },
    { test: (n) => /akabenz/i.test(n), newName: 'Akabenz' },
    { test: (n) => /garden.*salad|green salad/i.test(n), newName: 'Garden Salad' },
    { test: (n) => /perch|nile perch|grilled fish/i.test(n), newName: 'Grilled Fish' },
    { test: (n) => /tagine|lamb/i.test(n), newName: 'Lamb Tagine' },
    { test: (n) => /risotto/i.test(n), newName: 'Risotto' },
    { test: (n) => /quinoa|buddha/i.test(n), newName: 'Quinoa Bowl' },
    { test: (n) => /ribeye|steak/i.test(n), newName: 'Ribeye Steak' },
    { test: (n) => /schnitzel/i.test(n), newName: 'Chicken Schnitzel' },
    { test: (n) => /chicken supreme|roast chicken|roasted.*chicken/i.test(n), newName: 'Roast Chicken' },
    { test: (n) => /cheesecake/i.test(n), newName: 'Cheesecake' },
    { test: (n) => /lava cake|chocolate lava/i.test(n), newName: 'Lava Cake' },
    { test: (n) => /fruit tart|tart/i.test(n), newName: 'Fruit Tart' },
    { test: (n) => /brûlée|brule/i.test(n), newName: 'Crème Brûlée' },
    { test: (n) => /honey cake/i.test(n), newName: 'Honey Cake' },
    { test: (n) => /sorbet/i.test(n), newName: 'Sorbet' },

    // Drinks
    { test: (n) => /sunset spritz|aperol/i.test(n), newName: 'Aperol Spritz' },
    { test: (n) => /bourbon|old fashioned/i.test(n) && !/espresso/i.test(n), newName: 'Old Fashioned' },
    { test: (n) => /pornstar|martini/i.test(n), newName: 'Pornstar Martini' },
    { test: (n) => /pink gin|gin & tonic|gin and tonic/i.test(n), newName: 'Gin & Tonic' },
    { test: (n) => /golden goss|margarita/i.test(n), newName: 'Margarita' },
    { test: (n) => /iced tea|hibiscus/i.test(n), newName: 'Iced Tea' },
    { test: (n) => /mocktail|basil & lime|virgin mojito|mojito/i.test(n), newName: 'Virgin Mojito' },
    { test: (n) => /bordeaux|red wine/i.test(n), newName: 'Red Wine' },
    { test: (n) => /sauvignon|white wine/i.test(n), newName: 'White Wine' },
    { test: (n) => /espresso/i.test(n), newName: 'Espresso' },
    { test: (n) => /cappuccino/i.test(n), newName: 'Cappuccino' },
    { test: (n) => /latte/i.test(n), newName: 'Iced Latte' }
  ];

  const currentItems = localStorage.find('menu_items', () => true);
  for (const item of currentItems) {
    const match = famousRules.find(r => r.test(item.name));
    if (match && item.name !== match.newName) {
      localStorage.update('menu_items', item.id, { name: match.newName });
    }
  }

  // Ensure each drink only appears once (deduplicate drinks)
  const allDrinks = localStorage.find('menu_items', (i) => i.type === 'drink');
  const seenDrinkNames = new Set<string>();
  for (const drink of allDrinks) {
    const normalized = drink.name.toLowerCase().trim();
    if (seenDrinkNames.has(normalized)) {
      localStorage.delete('menu_items', drink.id);
    } else {
      seenDrinkNames.add(normalized);
    }
  }

  console.log('[Database] Migrations and seeding completed successfully.');
}
