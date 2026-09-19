// Mock data for development and UI testing
export const dummyShops = [
  {
    id: 1,
    name: 'Demo Shop',
    category: 'Grocery',
    distance_km: 1.2,
    rating: 4.5,
    address: '123 Main St, City',
    phone: '123-456-7890',
    lat: 0,
    lng: 0,
    is_open: true,
    product_count: 5,
    owner_name: 'Owner A',
  },
  {
    id: 2,
    name: 'Sample Market',
    category: 'Marketplace',
    distance_km: 2.8,
    rating: 4.2,
    address: '456 Side Rd, Town',
    phone: '987-654-3210',
    lat: 0,
    lng: 0,
    is_open: false,
    product_count: 8,
    owner_name: 'Owner B',
  },
];

export const dummyProducts = [
  {
    id: 101,
    name: 'Fresh Apples',
    price: 2.99,
    stock_quantity: 20,
    shop: 1,
    shop_name: 'Demo Shop',
    image_url: '',
  },
  {
    id: 102,
    name: 'Bananas',
    price: 1.49,
    stock_quantity: 30,
    shop: 1,
    shop_name: 'Demo Shop',
    image_url: '',
  },
  {
    id: 201,
    name: 'Handmade Soap',
    price: 5.5,
    stock_quantity: 15,
    shop: 2,
    shop_name: 'Sample Market',
    image_url: '',
  },
];

export const dummyPosts = [];
