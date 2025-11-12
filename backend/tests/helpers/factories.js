import { faker } from '@faker-js/faker';
import crypto from 'crypto';

// Generate UUID v4
function generateUUID() {
  return crypto.randomUUID();
}

export const factories = {
  /**
   * Generate user data
   */
  user(overrides = {}) {
    return {
      id: generateUUID(),
      email: faker.internet.email().toLowerCase(),
      password_hash: '$2b$10$test_hash_for_testing_only',
      name: faker.person.fullName(),
      role: 'user',
      created_at: new Date(),
      ...overrides
    };
  },
  
  /**
   * Generate note data
   */
  note(userId, overrides = {}) {
    return {
      id: generateUUID(),
      user_id: userId,
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(2),
      color: faker.helpers.arrayElement(['pink', 'purple', 'mint', 'yellow', 'blue']),
      pinned: faker.datatype.boolean(),
      created_at: new Date(),
      ...overrides
    };
  },
  
  /**
   * Generate event data
   */
  event(userId, overrides = {}) {
    return {
      id: generateUUID(),
      user_id: userId,
      title: faker.lorem.words(3),
      event_date: faker.date.future(),
      recurring: faker.datatype.boolean(),
      color: 'from-pastel-pink to-pastel-purple',
      created_at: new Date(),
      ...overrides
    };
  },
  
  /**
   * Generate wishlist item
   */
  wishlistItem(userId, overrides = {}) {
    return {
      id: generateUUID(),
      user_id: userId,
      product_name: faker.commerce.productName(),
      product_url: faker.internet.url(),
      product_image_url: faker.image.url(),
      price: parseFloat(faker.commerce.price()),
      currency: 'VND',
      origin: faker.helpers.arrayElement(['Shopee', 'TikTok', 'Other']),
      created_at: new Date(),
      ...overrides
    };
  },
  
  /**
   * Generate wishlist comment
   */
  wishlistComment(wishlistItemId, userId, overrides = {}) {
    return {
      id: generateUUID(),
      wishlist_item_id: wishlistItemId,
      user_id: userId,
      content: faker.lorem.sentence(),
      created_at: new Date(),
      ...overrides
    };
  },
  
  /**
   * Generate currency rate
   */
  currencyRate(overrides = {}) {
    return {
      id: generateUUID(),
      base_currency: 'USD',
      target_currency: faker.helpers.arrayElement(['VND', 'EUR', 'GBP', 'JPY', 'KRW']),
      rate: parseFloat(faker.finance.amount({ min: 0.5, max: 30000, dec: 2 })),
      last_updated: new Date(),
      source: 'exchangerate-api',
      created_at: new Date(),
      ...overrides
    };
  },
  
  /**
   * Generate gold rate
   */
  goldRate(overrides = {}) {
    return {
      id: generateUUID(),
      gold_type: faker.helpers.arrayElement(['SJC', 'PNJ', 'DOJI']),
      buy_price: parseFloat(faker.commerce.price({ min: 60000000, max: 80000000 })),
      sell_price: parseFloat(faker.commerce.price({ min: 60000000, max: 80000000 })),
      unit: 'VND/lượng',
      updated_at: new Date(),
      created_at: new Date(),
      ...overrides
    };
  },
  
  /**
   * Generate weather cache
   */
  weatherCache(overrides = {}) {
    return {
      id: generateUUID(),
      city: faker.location.city(),
      country: faker.location.countryCode(),
      temperature: parseFloat(faker.number.float({ min: -10, max: 45, fractionDigits: 1 })),
      feels_like: parseFloat(faker.number.float({ min: -10, max: 45, fractionDigits: 1 })),
      humidity: faker.number.int({ min: 30, max: 100 }),
      weather_main: faker.helpers.arrayElement(['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm']),
      weather_description: faker.lorem.words(2),
      cached_at: new Date(),
      ...overrides
    };
  }
};
