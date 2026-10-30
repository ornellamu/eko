import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  Wine, 
  UtensilsCrossed, 
  Coffee, 
  Beer, 
  Flame, 
  GlassWater, 
  CheckCircle2, 
  ArrowUpRight, 
  Calendar,
  X,
  Compass,
  Bookmark,
  Share2
} from 'lucide-react';
import { PageView, MenuItemData, CategoryItem } from '../../types';

export interface EkoMenuItem {
  name: string;
  price: string;
  rawPrice: number;
  note?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isAlcoholic?: boolean;
}

export interface EkoSubCategory {
  title: string;
  items: EkoMenuItem[];
}

export interface EkoSection {
  number: number;
  roman: string;
  title: string;
  categoryGroup: 'food' | 'drink' | 'dessert' | 'sides';
  subCategories?: EkoSubCategory[];
  items?: EkoMenuItem[];
}

export type EccoMenuItem = EkoMenuItem;
export type EccoSubCategory = EkoSubCategory;
export type EccoSection = EkoSection;

// Canonical Official 17-Section Menu Data for ECCO RESTAURANT
export const OFFICIAL_EKO_MENU: EkoSection[] = [
  {
    number: 1,
    roman: 'I',
    title: 'APPETIZERS',
    categoryGroup: 'food',
    items: [
      { name: 'Boho-Style Mixed Platter', price: '35,000 RWF', rawPrice: 35000 },
      { name: 'Trio of Chicken Samosas', price: '10,000 RWF', rawPrice: 10000 },
      { name: 'Vegetable Spring Rolls', price: '8,000 RWF', rawPrice: 8000, isVegetarian: true },
      { name: 'Chicken Wings', price: '15,000 RWF', rawPrice: 15000 },
      { name: 'Garlic Bread', price: '7,000 RWF', rawPrice: 7000, isVegetarian: true },
      { name: 'Bruschetta', price: '10,000 RWF', rawPrice: 10000, isVegetarian: true },
      { name: 'Crispy Plantain Chips', price: '8,000 RWF', rawPrice: 8000, isVegan: true, isVegetarian: true },
      { name: 'Vegetable Soup', price: '9,000 RWF', rawPrice: 9000, isVegan: true, isVegetarian: true },
      { name: 'Tomato Soup', price: '9,000 RWF', rawPrice: 9000, isVegan: true, isVegetarian: true }
    ]
  },
  {
    number: 2,
    roman: 'II',
    title: 'VEGAN FOODS',
    categoryGroup: 'food',
    items: [
      { name: 'Vegan Burger', price: '15,000 RWF', rawPrice: 15000, isVegan: true, isVegetarian: true },
      { name: 'Vegan Pizza', price: '18,000 RWF', rawPrice: 18000, isVegan: true, isVegetarian: true },
      { name: 'Vegetable Stir-Fry', price: '15,000 RWF', rawPrice: 15000, isVegan: true, isVegetarian: true },
      { name: 'Vegan Rice Bowl', price: '13,000 RWF', rawPrice: 13000, isVegan: true, isVegetarian: true },
      { name: 'Lentil Curry', price: '16,000 RWF', rawPrice: 16000, isVegan: true, isVegetarian: true },
      { name: 'Chickpea Salad', price: '12,000 RWF', rawPrice: 12000, isVegan: true, isVegetarian: true },
      { name: 'Grilled Vegetables', price: '15,000 RWF', rawPrice: 15000, isVegan: true, isVegetarian: true }
    ]
  },
  {
    number: 3,
    roman: 'III',
    title: 'VEGETARIAN FOODS',
    categoryGroup: 'food',
    items: [
      { name: 'Vegetable Omelette', price: '10,000 RWF', rawPrice: 10000, isVegetarian: true },
      { name: 'Cheese Pizza', price: '16,000 RWF', rawPrice: 16000, isVegetarian: true },
      { name: 'Vegetable Lasagna', price: '18,000 RWF', rawPrice: 18000, isVegetarian: true },
      { name: 'Mushroom Pasta', price: '17,000 RWF', rawPrice: 17000, isVegetarian: true },
      { name: 'Greek Salad', price: '13,000 RWF', rawPrice: 13000, isVegetarian: true },
      { name: 'Cheese Sandwich', price: '10,000 RWF', rawPrice: 10000, isVegetarian: true },
      { name: 'Vegetable Fried Rice', price: '12,000 RWF', rawPrice: 12000, isVegetarian: true }
    ]
  },
  {
    number: 4,
    roman: 'IV',
    title: 'FAST FOODS',
    categoryGroup: 'food',
    items: [
      { name: 'Beef Burger', price: '15,000 RWF', rawPrice: 15000 },
      { name: 'Chicken Burger', price: '14,000 RWF', rawPrice: 14000 },
      { name: 'Cheeseburger', price: '17,000 RWF', rawPrice: 17000 },
      { name: 'Chicken Shawarma', price: '12,000 RWF', rawPrice: 12000 },
      { name: 'Beef Shawarma', price: '14,000 RWF', rawPrice: 14000 },
      { name: 'Chicken Pizza', price: '20,000 RWF', rawPrice: 20000 },
      { name: 'Hot Dog', price: '10,000 RWF', rawPrice: 10000 },
      { name: 'Chicken Nuggets', price: '12,000 RWF', rawPrice: 12000 },
      { name: 'Fish and Chips', price: '18,000 RWF', rawPrice: 18000 }
    ]
  },
  {
    number: 5,
    roman: 'V',
    title: 'ITALIAN FOODS',
    categoryGroup: 'food',
    items: [
      { name: 'Spaghetti Bolognese', price: '21,000 RWF', rawPrice: 21000 },
      { name: 'Spaghetti Carbonara', price: '21,000 RWF', rawPrice: 21000 },
      { name: 'Margherita Pizza', price: '17,000 RWF', rawPrice: 17000, isVegetarian: true },
      { name: 'Pepperoni Pizza', price: '22,000 RWF', rawPrice: 22000 },
      { name: 'Chicken Alfredo Pasta', price: '21,000 RWF', rawPrice: 21000 },
      { name: 'Lasagna', price: '23,000 RWF', rawPrice: 23000 },
      { name: 'Fettuccine Alfredo', price: '19,000 RWF', rawPrice: 19000, isVegetarian: true },
      { name: 'Seafood Pasta', price: '28,000 RWF', rawPrice: 28000 }
    ]
  },
  {
    number: 6,
    roman: 'VI',
    title: 'SEAFOODS',
    categoryGroup: 'food',
    items: [
      { name: 'Grilled Tilapia', price: '25,000 RWF', rawPrice: 25000 },
      { name: 'Fried Fish', price: '20,000 RWF', rawPrice: 20000 },
      { name: 'Garlic Butter Shrimp', price: '28,000 RWF', rawPrice: 28000 },
      { name: 'Seafood Platter', price: '45,000 RWF', rawPrice: 45000 },
      { name: 'Grilled Salmon', price: '32,000 RWF', rawPrice: 32000 },
      { name: 'Fish Fillet', price: '22,000 RWF', rawPrice: 22000 },
      { name: 'Seafood Rice', price: '23,000 RWF', rawPrice: 23000 },
      { name: 'Calamari', price: '22,000 RWF', rawPrice: 22000 }
    ]
  },
  {
    number: 7,
    roman: 'VII',
    title: 'HOT DRINKS',
    categoryGroup: 'drink',
    items: [
      { name: 'African Tea', price: '5,000 RWF', rawPrice: 5000 },
      { name: 'Black Coffee', price: '4,000 RWF', rawPrice: 4000 },
      { name: 'Cappuccino', price: '5,000 RWF', rawPrice: 5000 },
      { name: 'Latte', price: '5,000 RWF', rawPrice: 5000 },
      { name: 'Espresso', price: '3,000 RWF', rawPrice: 3000 },
      { name: 'Hot Chocolate', price: '5,000 RWF', rawPrice: 5000 },
      { name: 'Green Tea', price: '5,000 RWF', rawPrice: 5000 },
      { name: 'Ginger Tea', price: '5,000 RWF', rawPrice: 5000 }
    ]
  },
  {
    number: 8,
    roman: 'VIII',
    title: 'SOFT DRINKS',
    categoryGroup: 'drink',
    items: [
      { name: 'Coca-Cola', price: '2,000 RWF', rawPrice: 2000 },
      { name: 'Fanta', price: '2,000 RWF', rawPrice: 2000 },
      { name: 'Sprite', price: '2,000 RWF', rawPrice: 2000 },
      { name: 'Pepsi', price: '2,000 RWF', rawPrice: 2000 },
      { name: 'Schweppes', price: '2,500 RWF', rawPrice: 2500 },
      { name: 'Tonic Water', price: '2,500 RWF', rawPrice: 2500 },
      { name: 'Mineral Water', price: '2,000 RWF', rawPrice: 2000 },
      { name: 'Sparkling Water', price: '3,000 RWF', rawPrice: 3000 }
    ]
  },
  {
    number: 9,
    roman: 'IX',
    title: 'FRESH JUICES',
    categoryGroup: 'drink',
    items: [
      { name: 'Fresh Orange Juice', price: '12,000 RWF', rawPrice: 12000 },
      { name: 'Mango Juice', price: '7,000 RWF', rawPrice: 7000 },
      { name: 'Pineapple Juice', price: '7,000 RWF', rawPrice: 7000 },
      { name: 'Watermelon Juice', price: '7,000 RWF', rawPrice: 7000 },
      { name: 'Passion Fruit Juice', price: '10,000 RWF', rawPrice: 10000 },
      { name: 'Avocado Juice', price: '8,000 RWF', rawPrice: 8000 },
      { name: 'Carrot Juice', price: '8,000 RWF', rawPrice: 8000 },
      { name: 'Mixed Fruit Juice', price: '10,000 RWF', rawPrice: 10000 }
    ]
  },
  {
    number: 10,
    roman: 'X',
    title: 'WINES',
    categoryGroup: 'drink',
    items: [
      { name: 'Nederburg Red Wine', price: '60,000 RWF', rawPrice: 60000, isAlcoholic: true },
      { name: 'Nederburg White Wine', price: '60,000 RWF', rawPrice: 60000, isAlcoholic: true },
      { name: 'Nederburg Rosé', price: '60,000 RWF', rawPrice: 60000, isAlcoholic: true },
      { name: 'Casillero del Diablo Red', price: '65,000 RWF', rawPrice: 65000, isAlcoholic: true },
      { name: 'Casillero del Diablo White', price: '65,000 RWF', rawPrice: 65000, isAlcoholic: true },
      { name: 'Mouton Cadet Red', price: '100,000 RWF', rawPrice: 100000, isAlcoholic: true },
      { name: 'Mouton Cadet White', price: '100,000 RWF', rawPrice: 100000, isAlcoholic: true },
      { name: 'Châteauneuf-du-Pape', price: '220,000 RWF', rawPrice: 220000, isAlcoholic: true },
      { name: 'Moët & Chandon Brut Champagne', price: '270,000 RWF', rawPrice: 270000, isAlcoholic: true },
      { name: 'Veuve Clicquot Brut Champagne', price: '300,000 RWF', rawPrice: 300000, isAlcoholic: true }
    ]
  },
  {
    number: 11,
    roman: 'XI',
    title: 'COCKTAILS',
    categoryGroup: 'drink',
    items: [
      { name: 'Mojito', price: '8,000 RWF', rawPrice: 8000, isAlcoholic: true },
      { name: 'Margarita', price: '10,000 RWF', rawPrice: 10000, isAlcoholic: true },
      { name: 'Piña Colada', price: '10,000 RWF', rawPrice: 10000, isAlcoholic: true },
      { name: 'Cosmopolitan', price: '10,000 RWF', rawPrice: 10000, isAlcoholic: true },
      { name: 'Strawberry Daiquiri', price: '10,000 RWF', rawPrice: 10000, isAlcoholic: true },
      { name: 'Tequila Sunrise', price: '9,000 RWF', rawPrice: 9000, isAlcoholic: true },
      { name: 'Martini', price: '12,000 RWF', rawPrice: 12000, isAlcoholic: true }
    ]
  },
  {
    number: 12,
    roman: 'XII',
    title: 'MOCKTAILS',
    categoryGroup: 'drink',
    items: [
      { name: 'Virgin Mojito', price: '6,000 RWF', rawPrice: 6000 },
      { name: 'Virgin Piña Colada', price: '8,000 RWF', rawPrice: 8000 },
      { name: 'Strawberry Lemonade', price: '7,000 RWF', rawPrice: 7000 },
      { name: 'Tropical Sunrise', price: '8,000 RWF', rawPrice: 8000 },
      { name: 'Mango Mint Cooler', price: '7,000 RWF', rawPrice: 7000 },
      { name: 'Blue Lagoon Mocktail', price: '8,000 RWF', rawPrice: 8000 }
    ]
  },
  {
    number: 13,
    roman: 'XIII',
    title: 'OTHER BEVERAGES',
    categoryGroup: 'drink',
    items: [
      { name: 'Iced Coffee', price: '5,000 RWF', rawPrice: 5000 },
      { name: 'Iced Tea', price: '5,000 RWF', rawPrice: 5000 },
      { name: 'Vanilla Milkshake', price: '10,000 RWF', rawPrice: 10000 },
      { name: 'Chocolate Milkshake', price: '10,000 RWF', rawPrice: 10000 },
      { name: 'Strawberry Milkshake', price: '10,000 RWF', rawPrice: 10000 },
      { name: 'Tropical Bliss Smoothie', price: '10,000 RWF', rawPrice: 10000 },
      { name: 'Berry Burst Smoothie', price: '10,000 RWF', rawPrice: 10000 },
      { name: 'Green Goddess Smoothie', price: '10,000 RWF', rawPrice: 10000 },
      { name: 'Red Bull', price: '5,000 RWF', rawPrice: 5000 }
    ]
  },
  {
    number: 14,
    roman: 'XIV',
    title: 'DESSERTS',
    categoryGroup: 'dessert',
    items: [
      { name: 'Chocolate Cake', price: '12,000 RWF', rawPrice: 12000, isVegetarian: true },
      { name: 'Vanilla Ice Cream', price: '8,000 RWF', rawPrice: 8000, isVegetarian: true },
      { name: 'Exotic Fruit Salad', price: '12,000 RWF', rawPrice: 12000, isVegan: true, isVegetarian: true },
      { name: 'Cheesecake', price: '15,000 RWF', rawPrice: 15000, isVegetarian: true },
      { name: 'Chocolate Brownie', price: '12,000 RWF', rawPrice: 12000, isVegetarian: true },
      { name: 'Apple Pie', price: '12,000 RWF', rawPrice: 12000, isVegetarian: true },
      { name: 'Pancakes', price: '10,000 RWF', rawPrice: 10000, isVegetarian: true },
      { name: 'Tiramisu', price: '15,000 RWF', rawPrice: 15000, isVegetarian: true },
      { name: 'Banana Split', price: '12,000 RWF', rawPrice: 12000, isVegetarian: true }
    ]
  },
  {
    number: 15,
    roman: 'XV',
    title: 'BEERS',
    categoryGroup: 'drink',
    subCategories: [
      {
        title: 'Local & Regional Beers',
        items: [
          { name: 'Heineken', price: '3,000 RWF', rawPrice: 3000, isAlcoholic: true },
          { name: 'Amstel', price: '3,000 RWF', rawPrice: 3000, isAlcoholic: true },
          { name: 'Mützig', price: '3,000 RWF', rawPrice: 3000, isAlcoholic: true },
          { name: 'Skol Malt', price: '3,000 RWF', rawPrice: 3000, isAlcoholic: true },
          { name: 'Skol Lager', price: '3,000 RWF', rawPrice: 3000, isAlcoholic: true },
          { name: 'Primus', price: '3,000 RWF', rawPrice: 3000, isAlcoholic: true },
          { name: 'Virunga Gold', price: '3,000 RWF', rawPrice: 3000, isAlcoholic: true },
          { name: 'Virunga Silver', price: '3,000 RWF', rawPrice: 3000, isAlcoholic: true }
        ]
      },
      {
        title: 'Imported Beers',
        items: [
          { name: 'Guinness', price: '5,000 RWF', rawPrice: 5000, isAlcoholic: true },
          { name: 'Tusker Lager', price: '5,000 RWF', rawPrice: 5000, isAlcoholic: true },
          { name: 'Tusker Malt', price: '5,000 RWF', rawPrice: 5000, isAlcoholic: true },
          { name: 'Stella Artois', price: '6,000 RWF', rawPrice: 6000, isAlcoholic: true },
          { name: 'Budweiser', price: '6,000 RWF', rawPrice: 6000, isAlcoholic: true },
          { name: 'Corona Extra', price: '6,000 RWF', rawPrice: 6000, isAlcoholic: true },
          { name: 'Leffe', price: '7,000 RWF', rawPrice: 7000, isAlcoholic: true },
          { name: 'Heineken 0.0 (Non-Alcoholic)', price: '4,000 RWF', rawPrice: 4000, isAlcoholic: false }
        ]
      },
      {
        title: 'Ciders & Flavoured Drinks',
        items: [
          { name: 'Savanna Cider', price: '7,000 RWF', rawPrice: 7000, isAlcoholic: true },
          { name: 'Smirnoff Ice', price: '5,000 RWF', rawPrice: 5000, isAlcoholic: true },
          { name: 'Smirnoff Guarana', price: '6,000 RWF', rawPrice: 6000, isAlcoholic: true },
          { name: 'Desperados', price: '6,000 RWF', rawPrice: 6000, isAlcoholic: true }
        ]
      }
    ]
  },
  {
    number: 16,
    roman: 'XVI',
    title: 'SPIRITS & LIQUORS',
    categoryGroup: 'drink',
    subCategories: [
      {
        title: 'Whisky',
        items: [
          { name: 'Johnnie Walker Red Label (Glass)', price: '8,000 RWF', rawPrice: 8000, isAlcoholic: true },
          { name: 'Johnnie Walker Black Label (Glass)', price: '9,000 RWF', rawPrice: 9000, isAlcoholic: true },
          { name: 'Jameson (Glass)', price: '7,000 RWF', rawPrice: 7000, isAlcoholic: true },
          { name: 'Jack Daniel\'s (Glass)', price: '9,000 RWF', rawPrice: 9000, isAlcoholic: true },
          { name: 'Chivas Regal 12 Years (Glass)', price: '9,000 RWF', rawPrice: 9000, isAlcoholic: true },
          { name: 'Johnnie Walker Blue Label (Bottle)', price: '1,000,000 RWF', rawPrice: 1000000, isAlcoholic: true }
        ]
      },
      {
        title: 'Vodka',
        items: [
          { name: 'Smirnoff Vodka (Glass)', price: '5,000 RWF', rawPrice: 5000, isAlcoholic: true },
          { name: 'Absolut Vodka (Glass)', price: '7,000 RWF', rawPrice: 7000, isAlcoholic: true },
          { name: 'Grey Goose Vodka (Glass)', price: '10,000 RWF', rawPrice: 10000, isAlcoholic: true }
        ]
      },
      {
        title: 'Gin',
        items: [
          { name: 'Gordon\'s Gin (Glass)', price: '6,000 RWF', rawPrice: 6000, isAlcoholic: true },
          { name: 'Bombay Sapphire (Glass)', price: '9,000 RWF', rawPrice: 9000, isAlcoholic: true },
          { name: 'Hendrick\'s Gin (Glass)', price: '10,000 RWF', rawPrice: 10000, isAlcoholic: true },
          { name: 'Tanqueray Gin (Glass)', price: '9,000 RWF', rawPrice: 9000, isAlcoholic: true }
        ]
      },
      {
        title: 'Rum',
        items: [
          { name: 'Captain Morgan (Glass)', price: '6,000 RWF', rawPrice: 6000, isAlcoholic: true },
          { name: 'Bacardi White Rum (Glass)', price: '7,000 RWF', rawPrice: 7000, isAlcoholic: true },
          { name: 'Malibu Rum (Glass)', price: '7,000 RWF', rawPrice: 7000, isAlcoholic: true }
        ]
      },
      {
        title: 'Cognac & Brandy',
        items: [
          { name: 'Hennessy VS (Glass)', price: '15,000 RWF', rawPrice: 15000, isAlcoholic: true },
          { name: 'Hennessy VSOP (Glass)', price: '20,000 RWF', rawPrice: 20000, isAlcoholic: true },
          { name: 'Rémy Martin VSOP (Glass)', price: '18,000 RWF', rawPrice: 18000, isAlcoholic: true },
          { name: 'Martell VS (Glass)', price: '15,000 RWF', rawPrice: 15000, isAlcoholic: true },
          { name: 'Martell XO (Glass)', price: '60,000 RWF', rawPrice: 60000, isAlcoholic: true }
        ]
      }
    ]
  },
  {
    number: 17,
    roman: 'XVII',
    title: 'EXTRA ACCOMPANIMENTS',
    categoryGroup: 'sides',
    items: [
      { name: 'White Rice', price: '5,000 RWF', rawPrice: 5000, isVegan: true, isVegetarian: true },
      { name: 'French Fries', price: '5,000 RWF', rawPrice: 5000, isVegan: true, isVegetarian: true },
      { name: 'Mashed Potatoes', price: '5,000 RWF', rawPrice: 5000, isVegetarian: true },
      { name: 'Grilled Vegetables', price: '5,000 RWF', rawPrice: 5000, isVegan: true, isVegetarian: true },
      { name: 'Fresh Garden Salad', price: '5,000 RWF', rawPrice: 5000, isVegan: true, isVegetarian: true },
      { name: 'Fried Plantains', price: '5,000 RWF', rawPrice: 5000, isVegan: true, isVegetarian: true },
      { name: 'Garlic Bread', price: '5,000 RWF', rawPrice: 5000, isVegetarian: true }
    ]
  }
];

interface MenuPageProps {
  menuItems?: MenuItemData[];
  categories?: CategoryItem[];
  onNavigate: (page: PageView) => void;
}

export function MenuPage({ onNavigate }: MenuPageProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<'all' | 'food' | 'drink' | 'vegan_veg'>('all');
  const [bookmarkedItem, setBookmarkedItem] = useState<string | null>(null);
  const [selectedDishForReservation, setSelectedDishForReservation] = useState<EkoMenuItem | null>(null);

  // Filter sections and items based on search query and group tabs
  const filteredSections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return OFFICIAL_EKO_MENU.map((section) => {
      // Group filter check
      if (selectedGroup === 'food' && section.categoryGroup !== 'food') return null;
      if (selectedGroup === 'drink' && section.categoryGroup !== 'drink') return null;
      if (selectedGroup === 'vegan_veg' && section.number !== 2 && section.number !== 3) return null;

      // Search filtering
      if (!query) {
        return section;
      }

      // Check section title
      const titleMatches = section.title.toLowerCase().includes(query);

      // Filter subcategories if any
      if (section.subCategories) {
        const filteredSubs = section.subCategories.map((sub) => {
          const subMatches = sub.title.toLowerCase().includes(query);
          const filteredItems = sub.items.filter((item) =>
            titleMatches || subMatches || item.name.toLowerCase().includes(query) || item.price.toLowerCase().includes(query)
          );
          return {
            ...sub,
            items: filteredItems
          };
        }).filter(sub => sub.items.length > 0);

        if (filteredSubs.length > 0) {
          return {
            ...section,
            subCategories: filteredSubs
          };
        }
        return null;
      }

      // Filter direct items
      if (section.items) {
        const filteredItems = section.items.filter((item) =>
          titleMatches || item.name.toLowerCase().includes(query) || item.price.toLowerCase().includes(query)
        );
        if (filteredItems.length > 0) {
          return {
            ...section,
            items: filteredItems
          };
        }
        return null;
      }

      return null;
    }).filter((s): s is EkoSection => s !== null);
  }, [searchQuery, selectedGroup]);

  // Total count of matching items
  const totalItemCount = useMemo(() => {
    let count = 0;
    filteredSections.forEach((s) => {
      if (s.items) count += s.items.length;
      if (s.subCategories) {
        s.subCategories.forEach((sub) => {
          count += sub.items.length;
        });
      }
    });
    return count;
  }, [filteredSections]);

  const scrollToSection = (sectionNumber: number) => {
    const el = document.getElementById(`section-${sectionNumber}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectDishForBooking = (item: EkoMenuItem) => {
    setSelectedDishForReservation(item);
  };

  const proceedToReservation = (dishName?: string) => {
    if (dishName) {
      sessionStorage.setItem('ecco_selected_dish', dishName);
      sessionStorage.setItem('eko_selected_dish', dishName);
    }
    onNavigate('reservation');
  };

  return (
    <div className="min-h-screen bg-[#0D0C0B] text-neutral-200 selection:bg-[#D4AF37]/30 selection:text-[#F3E5AB]">
      {/* 1. EDITORIAL HEADER & BRAND IDENTITY (NO PICTURES) */}
      <header className="relative pt-12 pb-10 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20 bg-gradient-to-b from-[#14120E] via-[#0D0C0B] to-[#0D0C0B]">
        {/* Subtle Luxury Guilloché Pattern in CSS */}
        <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          {/* Classical Double Gold Crest Bar */}
          <div className="flex items-center justify-center gap-3 text-[#D4AF37]">
            <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-[#D4AF37]" />
            <div className="w-2.5 h-2.5 rotate-45 border border-[#D4AF37] bg-[#D4AF37]/20" />
            <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[#E5C158]">
              EST. KIGALI • KK 554
            </span>
            <div className="w-2.5 h-2.5 rotate-45 border border-[#D4AF37] bg-[#D4AF37]/20" />
            <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent via-[#D4AF37]/60 to-[#D4AF37]" />
          </div>

          {/* Title: # ECCO RESTAURANT */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white drop-shadow-sm">
            ECCO RESTAURANT
          </h1>

          {/* Subtitle: **Good Food, Great Moments!** */}
          <p className="font-serif text-xl sm:text-2xl text-[#E5C158] italic font-medium tracking-wide">
            Good Food, Great Moments!
          </p>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
            Welcome to the official dining & cellar catalog of Ecco Restaurant. Explore our 17 culinary sections, 
            crafted fresh daily using premium local ingredients and international fine spirits.
          </p>

          {/* Quick Actions Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => proceedToReservation()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C59B27] text-neutral-950 font-medium text-xs sm:text-sm tracking-wider uppercase hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(212,175,55,0.25)]"
            >
              <Calendar className="w-4 h-4 text-neutral-950" />
              <span>Reserve a Table</span>
            </button>
            <a
              href="#section-1"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm bg-[#181614] border border-[#D4AF37]/30 text-neutral-300 font-mono text-xs uppercase tracking-wider hover:border-[#D4AF37] hover:text-[#E5C158] transition-all"
            >
              <Compass className="w-4 h-4 text-[#D4AF37]" />
              <span>Explore All 17 Sections</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. INTERACTIVE CONTROLS: SEARCH & CATEGORY SELECTOR */}
      <section className="sticky top-0 z-30 bg-[#0D0C0B]/95 backdrop-blur-md border-b border-neutral-800 shadow-xl py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Live Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all 17 sections (e.g. Tilapia, Casillero, Samosas)..."
                className="w-full pl-10 pr-9 py-2 bg-[#161513] border border-neutral-700/80 rounded-sm text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/50 transition-all font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Segmented Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
              <button
                onClick={() => setSelectedGroup('all')}
                className={`px-3 py-1.5 rounded-sm whitespace-nowrap transition-all uppercase tracking-wider font-mono text-[11px] ${
                  selectedGroup === 'all'
                    ? 'bg-[#D4AF37] text-neutral-950 font-bold shadow-sm'
                    : 'bg-[#181614] text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                }`}
              >
                All 17 Sections
              </button>
              <button
                onClick={() => setSelectedGroup('food')}
                className={`px-3 py-1.5 rounded-sm whitespace-nowrap transition-all uppercase tracking-wider font-mono text-[11px] flex items-center gap-1.5 ${
                  selectedGroup === 'food'
                    ? 'bg-[#D4AF37] text-neutral-950 font-bold shadow-sm'
                    : 'bg-[#181614] text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                }`}
              >
                <UtensilsCrossed className="w-3 h-3" />
                Food & Cuisine
              </button>
              <button
                onClick={() => setSelectedGroup('drink')}
                className={`px-3 py-1.5 rounded-sm whitespace-nowrap transition-all uppercase tracking-wider font-mono text-[11px] flex items-center gap-1.5 ${
                  selectedGroup === 'drink'
                    ? 'bg-[#D4AF37] text-neutral-950 font-bold shadow-sm'
                    : 'bg-[#181614] text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                }`}
              >
                <Wine className="w-3 h-3" />
                Cellar & Drinks
              </button>
              <button
                onClick={() => setSelectedGroup('vegan_veg')}
                className={`px-3 py-1.5 rounded-sm whitespace-nowrap transition-all uppercase tracking-wider font-mono text-[11px] flex items-center gap-1.5 ${
                  selectedGroup === 'vegan_veg'
                    ? 'bg-[#D4AF37] text-neutral-950 font-bold shadow-sm'
                    : 'bg-[#181614] text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                }`}
              >
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                Vegan & Veg
              </button>
            </div>
          </div>

          {/* Quick-Jump Section Navigator (1 to 17) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none border-t border-neutral-800/80">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 whitespace-nowrap pr-2">
              JUMP TO:
            </span>
            {OFFICIAL_EKO_MENU.map((sec) => (
              <button
                key={sec.number}
                onClick={() => scrollToSection(sec.number)}
                className="px-2 py-0.5 rounded-xs bg-[#161412] hover:bg-[#D4AF37]/20 border border-neutral-800 hover:border-[#D4AF37]/40 text-neutral-300 hover:text-[#E5C158] whitespace-nowrap text-[10px] sm:text-[11px] font-mono tracking-tight transition-colors"
              >
                {sec.number}. {sec.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. MAIN PHYSICAL-STYLE EDITORIAL MENU CONTENT */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Results summary if searching */}
        {searchQuery && (
          <div className="flex items-center justify-between px-4 py-2.5 rounded-sm bg-[#161411] border border-[#D4AF37]/30 text-xs text-neutral-300">
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>
                Found <strong>{totalItemCount}</strong> item{totalItemCount === 1 ? '' : 's'} matching &ldquo;{searchQuery}&rdquo;
              </span>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#E5C158] hover:underline font-mono uppercase text-[11px]"
            >
              Reset
            </button>
          </div>
        )}

        {filteredSections.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-[#141311] border border-neutral-800 rounded-sm">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#1e1c18] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-white">No Menu Items Found</h3>
            <p className="text-sm text-neutral-400 max-w-md mx-auto">
              We couldn&apos;t find any dish or beverage matching &ldquo;{searchQuery}&rdquo;. Try another keyword or reset the filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGroup('all');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-[#D4AF37] text-neutral-950 font-mono text-xs uppercase tracking-wider font-bold"
            >
              View Full Menu
            </button>
          </div>
        ) : (
          filteredSections.map((section) => (
            <article
              id={`section-${section.number}`}
              key={section.number}
              className="relative p-6 sm:p-8 md:p-10 rounded-sm bg-[#12110F] border border-[#262420] shadow-[0_10px_35px_rgba(0,0,0,0.4)] transition-all hover:border-[#D4AF37]/40"
            >
              {/* Classical Ornamental Corner Accents */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37]/40 pointer-events-none" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37]/40 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37]/40 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37]/40 pointer-events-none" />

              {/* SECTION HEADER */}
              <div className="text-center pb-8 border-b border-neutral-800/90 relative">
                {/* Number Badge */}
                <div className="inline-flex items-center justify-center mb-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-b from-[#1C1A16] to-[#12110F] border border-[#D4AF37]/50 flex items-center justify-center shadow-inner">
                    <span className="font-mono text-xs font-bold text-[#E5C158] tracking-widest">
                      {section.number < 10 ? `0${section.number}` : section.number}
                    </span>
                  </div>
                </div>

                {/* Section Title */}
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-white uppercase drop-shadow-sm">
                  {section.number}. {section.title}
                </h2>

                <div className="mt-2.5 flex items-center justify-center gap-2">
                  <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
                    ÉKO DINING
                  </span>
                  <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
                </div>
              </div>

              {/* SECTION BODY: DIRECT ITEMS */}
              {section.items && (
                <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 sm:gap-y-5">
                  {section.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="group flex items-baseline justify-between py-1.5 px-2 rounded-xs hover:bg-[#1A1815] transition-colors cursor-pointer"
                      onClick={() => handleSelectDishForBooking(item)}
                      title={`Click to select ${item.name} for table reservation`}
                    >
                      {/* Dish Name */}
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className="text-neutral-100 font-serif text-base sm:text-lg group-hover:text-[#E5C158] transition-colors truncate">
                          {item.name}
                        </span>
                        {item.isVegan && (
                          <span className="shrink-0 px-1.5 py-0.2 rounded-xs bg-emerald-950/80 border border-emerald-700/50 text-emerald-400 font-mono text-[9px] uppercase tracking-wider">
                            Vegan
                          </span>
                        )}
                        {item.isVegetarian && !item.isVegan && (
                          <span className="shrink-0 px-1.5 py-0.2 rounded-xs bg-lime-950/80 border border-lime-700/50 text-lime-400 font-mono text-[9px] uppercase tracking-wider">
                            Veg
                          </span>
                        )}
                        {item.isAlcoholic && (
                          <span className="shrink-0 px-1.5 py-0.2 rounded-xs bg-amber-950/80 border border-amber-700/50 text-amber-400 font-mono text-[9px] uppercase tracking-wider">
                            Alc
                          </span>
                        )}
                      </div>

                      {/* Editorial Dotted Price Leader */}
                      <div className="flex-1 border-b border-dotted border-neutral-700/70 mx-2 min-w-[20px] mb-1.5 group-hover:border-[#D4AF37]/60 transition-colors" />

                      {/* Price in Rwandan Francs */}
                      <div className="shrink-0 text-right">
                        <span className="font-serif font-bold text-[#E5C158] text-sm sm:text-base whitespace-nowrap tracking-tight">
                          {item.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SECTION BODY: SUBCATEGORIES (For BEERS & SPIRITS & LIQUORS) */}
              {section.subCategories && (
                <div className="pt-8 space-y-10">
                  {section.subCategories.map((sub, sIdx) => (
                    <div key={sIdx} className="space-y-4">
                      {/* Subcategory Banner */}
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-[#D4AF37] rotate-45" />
                        <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#F3E5AB] tracking-wide">
                          {sub.title}
                        </h3>
                        <div className="flex-1 h-[1px] bg-gradient-to-r from-[#D4AF37]/40 to-transparent" />
                      </div>

                      {/* Subcategory Items Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 sm:gap-y-5">
                        {sub.items.map((item, iIdx) => (
                          <div
                            key={iIdx}
                            className="group flex items-baseline justify-between py-1.5 px-2 rounded-xs hover:bg-[#1A1815] transition-colors cursor-pointer"
                            onClick={() => handleSelectDishForBooking(item)}
                            title={`Click to select ${item.name} for table reservation`}
                          >
                            <div className="flex items-center gap-2 min-w-0 pr-2">
                              <span className="text-neutral-100 font-serif text-base sm:text-lg group-hover:text-[#E5C158] transition-colors truncate">
                                {item.name}
                              </span>
                              {item.isAlcoholic === false && (
                                <span className="shrink-0 px-1.5 py-0.2 rounded-xs bg-sky-950/80 border border-sky-700/50 text-sky-400 font-mono text-[9px] uppercase tracking-wider">
                                  0.0%
                                </span>
                              )}
                            </div>

                            {/* Editorial Dotted Leader */}
                            <div className="flex-1 border-b border-dotted border-neutral-700/70 mx-2 min-w-[20px] mb-1.5 group-hover:border-[#D4AF37]/60 transition-colors" />

                            <div className="shrink-0 text-right">
                              <span className="font-serif font-bold text-[#E5C158] text-sm sm:text-base whitespace-nowrap tracking-tight">
                                {item.price}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))
        )}

        {/* 4. VERBATIM OFFICIAL CLOSING FOOTER AS SPECIFIED */}
        <footer className="pt-12 pb-16 text-center space-y-6 border-t-2 border-[#D4AF37]/30 bg-gradient-to-b from-[#14120E] to-[#0D0C0B] p-8 sm:p-12 rounded-sm">
          {/* Gold Decorative Diamond Motif */}
          <div className="flex items-center justify-center gap-3 text-[#D4AF37]">
            <div className="h-[1px] w-16 sm:w-32 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <div className="w-3 h-3 rotate-45 border border-[#D4AF37] bg-[#D4AF37]/30" />
            <div className="h-[1px] w-16 sm:w-32 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>

          {/* Heading verbatim from prompt */}
          <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-wider text-[#F3E5AB] uppercase">
            THANK YOU FOR CHOOSING ECCO RESTAURANT!
          </h3>

          {/* Subtitle verbatim from prompt */}
          <p className="font-serif text-lg text-neutral-200 italic">
            We appreciate your visit. Come again!
          </p>

          {/* Legal and currency note verbatim from prompt */}
          <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-xl mx-auto italic">
            *All prices are in Rwandan Francs (RWF). Alcoholic drinks are served only to adults of legal drinking age.*
          </p>

          {/* Reservation Prompt */}
          <div className="pt-4">
            <button
              onClick={() => proceedToReservation()}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-sm bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C59B27] text-neutral-950 font-bold font-mono text-xs sm:text-sm uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_8px_30px_rgba(212,175,55,0.3)]"
            >
              <Calendar className="w-4 h-4 text-neutral-950" />
              <span>Book Your Table at Ecco</span>
              <ArrowUpRight className="w-4 h-4 text-neutral-950" />
            </button>
          </div>
        </footer>
      </main>

      {/* 5. ITEM SELECTION MODAL (HELPS GUESTS RESERVE FOR A SPECIFIC DISH) */}
      {selectedDishForReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#161412] border border-[#D4AF37]/50 rounded-sm p-6 sm:p-8 space-y-6 shadow-2xl">
            <button
              onClick={() => setSelectedDishForReservation(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 text-center">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37]">
                ECCO GASTRONOMY SELECTION
              </span>
              <h4 className="font-serif text-2xl font-bold text-white">
                {selectedDishForReservation.name}
              </h4>
              <p className="font-serif text-xl font-bold text-[#E5C158]">
                {selectedDishForReservation.price}
              </p>
            </div>

            <div className="p-3.5 rounded-sm bg-[#11100E] border border-neutral-800 text-xs text-neutral-400 space-y-2">
              <div className="flex items-center gap-2 text-neutral-200">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>Prepared fresh to order by executive chefs</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-200">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>Priority seating reservation available</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => proceedToReservation(selectedDishForReservation.name)}
                className="w-full py-3 rounded-sm bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C59B27] text-neutral-950 font-bold font-mono text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve Table for this Dish</span>
              </button>
              <button
                onClick={() => setSelectedDishForReservation(null)}
                className="w-full py-2.5 rounded-sm bg-transparent border border-neutral-700 text-neutral-300 font-mono text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors"
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
