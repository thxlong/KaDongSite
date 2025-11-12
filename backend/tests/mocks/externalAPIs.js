import nock from 'nock';

export const mockExternalAPIs = {
  /**
   * Mock Weather API (OpenWeatherMap)
   */
  mockWeatherAPI(city = 'Ho Chi Minh', weatherData = {}) {
    const defaultData = {
      name: city,
      main: { 
        temp: 28,
        feels_like: 30,
        humidity: 80,
        pressure: 1013
      },
      weather: [{ 
        main: 'Clear', 
        description: 'clear sky',
        icon: '01d'
      }],
      wind: { speed: 3.5 },
      clouds: { all: 10 },
      sys: { country: 'VN' },
      ...weatherData
    };
    
    nock('https://api.openweathermap.org')
      .get('/data/2.5/weather')
      .query(true)
      .reply(200, defaultData);
      
    return defaultData;
  },
  
  /**
   * Mock Exchange Rate API
   */
  mockExchangeRateAPI(rates = {}) {
    const defaultRates = {
      USD: 1,
      VND: 26345,
      EUR: 0.92,
      GBP: 0.79,
      JPY: 149.50,
      KRW: 1320.00,
      CNY: 7.24,
      THB: 35.50,
      ...rates
    };
    
    nock('https://api.exchangerate-api.com')
      .get(/\/v4\/latest\/.*/)
      .reply(200, { 
        result: 'success',
        base_code: 'USD',
        rates: defaultRates,
        time_last_update_utc: new Date().toISOString()
      });
      
    // Also mock fallback API
    nock('https://open.er-api.com')
      .get(/\/v6\/latest\/.*/)
      .reply(200, { 
        result: 'success',
        base_code: 'USD',
        rates: defaultRates,
        time_last_update_utc: new Date().toISOString()
      });
      
    return defaultRates;
  },
  
  /**
   * Mock Shopee API
   */
  mockShopeeAPI(productData = {}) {
    const defaultData = {
      item: {
        itemid: 12345678,
        shopid: 87654321,
        name: 'iPhone 15 Pro Max 256GB',
        price: 3499900000, // Shopee stores in smallest unit (VND * 100000)
        price_min: 3499900000,
        price_max: 3499900000,
        currency: 'VND',
        stock: 100,
        sold: 523,
        images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
        image: 'https://example.com/image1.jpg',
        ...productData.item
      },
      ...productData
    };
    
    nock('https://shopee.vn')
      .get('/api/v4/item/get')
      .query(true)
      .reply(200, defaultData);
      
    return defaultData;
  },
  
  /**
   * Mock Gold Price API
   */
  mockGoldAPI(prices = {}) {
    const defaultData = {
      data: [
        {
          type: 'SJC',
          buy: 76500000,
          sell: 77000000,
          unit: 'VND/lượng',
          updated: new Date().toISOString()
        },
        {
          type: 'PNJ',
          buy: 76300000,
          sell: 76800000,
          unit: 'VND/lượng',
          updated: new Date().toISOString()
        },
        {
          type: 'DOJI',
          buy: 76400000,
          sell: 76900000,
          unit: 'VND/lượng',
          updated: new Date().toISOString()
        }
      ],
      ...prices
    };
    
    // Mock multiple gold price sources
    nock('https://api.goldpriceapi.com')
      .get(/\/.*/)
      .reply(200, defaultData);
      
    nock('https://sjc.com.vn')
      .get(/\/.*/)
      .reply(200, defaultData);
      
    return defaultData;
  },
  
  /**
   * Mock TikTok Shop API
   */
  mockTikTokAPI(productData = {}) {
    const defaultData = {
      product: {
        id: 'tiktok_123456',
        title: 'Áo Thun Form Rộng Unisex',
        price: 159000,
        sale_price: 99000,
        currency: 'VND',
        thumbnail: 'https://example.com/tiktok-product.jpg',
        images: ['https://example.com/tiktok-1.jpg'],
        sold: 1234,
        ...productData.product
      },
      ...productData
    };
    
    nock('https://api.tiktok.com')
      .get(/\/.*/)
      .reply(200, defaultData);
      
    return defaultData;
  },
  
  /**
   * Mock API failure
   */
  mockAPIFailure(apiUrl, statusCode = 500, errorMessage = 'Internal Server Error') {
    nock(apiUrl)
      .get(/\/.*/)
      .reply(statusCode, { error: errorMessage });
  },
  
  /**
   * Mock API timeout
   */
  mockAPITimeout(apiUrl, delay = 10000) {
    nock(apiUrl)
      .get(/\/.*/)
      .delay(delay)
      .reply(200, {});
  },
  
  /**
   * Clean all mocks
   */
  cleanAll() {
    nock.cleanAll();
  },
  
  /**
   * Check if all mocks were called
   */
  isDone() {
    return nock.isDone();
  }
};
