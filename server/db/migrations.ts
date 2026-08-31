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
        name: 'Crispy Lake Kivu Sambaza',
        description: 'Golden crispy miniature Lake Kivu silver fish dusted in smoked paprika and sea salt, served with house-whipped dill tartare and charred lemon wedges.',
        price: 4500,
        image_url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 1,
        prep_time_minutes: 15,
        is_chef_special: 1,
        spicy_level: 1
      },
      {
        category_id: starterCat?.id || 1,
        name: 'Mango & Avocado Carpaccio',
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
        name: 'Rwandan Akabenz Pork Crostini',
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
        name: 'Roasted Pumpkin & Ginger Velouté',
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
        name: 'Warm Goat Cheese & Fig Bruschetta',
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
        name: 'Truffle Mushroom & Plantain Croquettes',
        description: 'Crispy golden mashed sweet plantain and wild forest mushroom croquettes filled with melted gruyère cheese, served with garlic herb aioli.',
        price: 5500,
        image_url: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 0,
        prep_time_minutes: 15,
        is_chef_special: 0,
        spicy_level: 0
      },
      {
        category_id: starterCat?.id || 1,
        name: 'Confit Byaldi (Layered Ratatouille)',
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
        name: 'Kigali Garden Green Salad',
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
      {
        category_id: starterCat?.id || 1,
        name: 'Spiced Gourmet Beef Samosas',
        description: 'Crispy handmade golden pastry parcels stuffed with aromatic spiced minced beef, spring onions, and coriander, served with sweet tamarind chutney.',
        price: 4500,
        image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 0,
        prep_time_minutes: 15,
        is_chef_special: 0,
        spicy_level: 1
      },

      // 2. MAIN COURSES
      {
        category_id: mainCat?.id || 2,
        name: 'Prime Grilled Ribeye Steak',
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
        name: 'Grilled Nile Perch with Lemon Butter',
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
        name: 'Moroccan Braised Lamb Tagine',
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
        name: 'Eko Signature Nyama Choma Platter',
        description: 'Slow-smoked marinated goat skewers & prime beef cuts with roasted sweet plantains (aloco), fresh kachumbari salad, and fiery pili-pili dip.',
        price: 16000,
        image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 1,
        prep_time_minutes: 25,
        is_chef_special: 1,
        spicy_level: 2
      },
      {
        category_id: mainCat?.id || 2,
        name: 'Grilled Jumbo King Prawns',
        description: 'Flame-grilled jumbo prawns basted with roasted garlic herb butter, saffron jasmine rice, and charred lemon.',
        price: 19500,
        image_url: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 1,
        prep_time_minutes: 20,
        is_chef_special: 1,
        spicy_level: 0
      },
      {
        category_id: mainCat?.id || 2,
        name: 'Crispy Chicken Schnitzel Fettuccine',
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
        name: 'Pan-Roasted Herb Chicken Supreme',
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
        name: 'Wild Forest Mushroom Risotto',
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
        name: 'Handcrafted Truffle Tagliatelle',
        description: 'Fresh artisanal egg pasta tossed in black truffle cream, aged parmesan shavings, and cracked black pepper.',
        price: 14500,
        image_url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281781?auto=format&fit=crop&w=800&q=80',
        type: 'food',
        is_available: 1,
        is_popular: 1,
        prep_time_minutes: 18,
        is_chef_special: 1,
        spicy_level: 0
      },
      {
        category_id: mainCat?.id || 2,
        name: 'Boho Buddha Quinoa Bowl',
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
        name: 'Valrhona Warm Chocolate Lava Cake',
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
        name: 'Rwandan Passion Fruit Cheesecake',
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
        name: 'Bourbon Vanilla Bean Crème Brûlée',
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
        name: 'Lake Kivu Artisanal Honey Cake',
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
        name: 'Exotic Mango & Papaya Fruit Tart',
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
        name: 'Artisanal Tropical Sorbet Trio',
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
        name: 'Kigali Sunset Spritz',
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
        name: 'Pornstar Martini & Prosecco',
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
        name: 'Golden Smoked Bourbon',
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
        name: 'Golden Goss Cocktail',
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
        name: 'Pink Gin & Tonic Spritz',
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
        name: 'Bordeaux Grand Réserve Glass',
        description: 'Deep ruby French red blend with opulent aromas of blackcurrant, dark chocolate, and French oak.',
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
        name: 'Marlborough Sauvignon Blanc Glass',
        description: 'Crisp, vibrant white wine with bright citrus blossom, passion fruit notes, and a refreshing mineral finish.',
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
        name: 'Garden Basil & Lime Mocktail',
        description: 'Signature mocktail with muddled garden basil, cold-pressed lime juice, crushed cucumber, and sparkling ginger beer.',
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
        name: 'Fresh Hibiscus Iced Tea',
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
        name: 'Rwandan Red Bourbon Espresso',
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
        name: 'Artisanal Cinnamon Cappuccino',
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
        name: 'Iced Nyungwe Vanilla Latte',
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

  // Ensure the 6 new menu creations are registered in the menu catalog
  const newCulinaryCreations = [
    {
      category_slug: 'cocktails',
      name: 'Pornstar Martini',
      description: 'Exquisite cocktail blending premium vanilla vodka, Passoã passion fruit liqueur, fresh passion fruit puree, and lime, served with a chilled shot of sparkling Prosecco.',
      price: 9000,
      image_url: '/images/pornstar-martini.jpg',
      type: 'drink',
      is_available: 1,
      is_popular: 1
    },
    {
      category_slug: 'cocktails',
      name: 'Pink Gin & Tonic Spritz',
      description: 'Vibrant pink botanical gin infused with wild berries and hibiscus, paired with artisanal Indian tonic, fresh pink grapefruit wheel, and crushed crystal ice.',
      price: 8000,
      image_url: '/images/pink-gin-spritz.jpg',
      type: 'drink',
      is_available: 1,
      is_popular: 1
    },
    {
      category_slug: 'cocktails',
      name: 'Golden Goss Cocktail',
      description: 'Artisanal golden cocktail with subtle amber botanicals, dried citrus, and delicate honeyed warmth.',
      price: 16500,
      image_url: '/images/golden-goss-cocktail.jpg',
      type: 'drink',
      is_available: 1,
      is_popular: 1
    },
    {
      category_slug: 'main-courses',
      name: 'Prime Grilled Ribeye Steak',
      description: '350g char-grilled aged prime beef ribeye steak cooked to perfection, served with crispy roasted hasselback potato, butter-glazed asparagus, and rich red wine jus.',
      price: 22000,
      image_url: '/images/prime-ribeye-steak.jpg',
      type: 'food',
      is_available: 1,
      is_popular: 1
    },
    {
      category_slug: 'main-courses',
      name: 'Crispy Chicken Schnitzel Fettuccine',
      description: 'Golden panko-crusted chicken cutlet served atop handmade ribbon fettuccine in a velvety garlic-Parmigiano cream sauce, with roasted cherry tomatoes and crispy sage.',
      price: 14500,
      image_url: '/images/chicken-schnitzel-fettuccine.jpg',
      type: 'food',
      is_available: 1,
      is_popular: 1
    },
    {
      category_slug: 'starters',
      name: 'Confit Byaldi (Layered Ratatouille)',
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
    } else {
      localStorage.insert('menu_items', {
        category_id,
        name: item.name,
        description: item.description,
        price: item.price,
        image_url: item.image_url,
        type: item.type,
        is_available: 1,
        is_popular: 1
      });
    }
  }

  // Ensure Avocado Carpaccio has the updated image asset
  const avocadoItems = localStorage.find('menu_items', (item) => item.name.toLowerCase().includes('avocado'));
  for (const item of avocadoItems) {
    localStorage.update('menu_items', item.id, {
      name: 'Mango & Avocado Carpaccio',
      image_url: '/images/avocado-carpaccio.jpg',
      description: 'Delicately sliced ripe Hass avocado and sweet yellow mango arranged in an elegant rosette fan, garnished with whipped goat cheese rosettes, fresh garden basil, and cracked black pepper.'
    });
  }

  console.log('[Database] Migrations and seeding completed successfully.');
}
