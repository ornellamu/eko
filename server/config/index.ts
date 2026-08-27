import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  sessionSecret: process.env.SESSION_SECRET || 'eko-luxury-fine-dining-secret-key-kigali-2026',
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  restaurant: {
    name: 'Eko Restaurant',
    type: 'Luxury Fine-Dining Restaurant',
    location: 'Kigali, KK 554',
    phone: '0701537890',
    whatsapp: '0701537890',
    email: 'mugishamp7@gmail.com',
    openingHours: 'Every day, 10:00–23:00',
    currency: 'RWF',
    slogan: 'A Symphony of Flavors, Where Kigali Meets Culinary Artistry'
  }
};
