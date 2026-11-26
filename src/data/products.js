// 25 products in 5 categories.
// Low stock (quantity at or below threshold): ids 2, 8, 14, 18, 24. Out of stock: id 5.
export const seedProducts = [
  // Groceries
  { id: 1, name: 'Rice 5kg', category: 'Groceries', price: 85.0, quantity: 40, threshold: 10 },
  { id: 2, name: 'Cooking oil 1L', category: 'Groceries', price: 32.0, quantity: 8, threshold: 10 },
  { id: 3, name: 'Sugar 1kg', category: 'Groceries', price: 18.0, quantity: 30, threshold: 10 },
  { id: 4, name: 'Tomato paste tin', category: 'Groceries', price: 6.5, quantity: 45, threshold: 12 },
  { id: 5, name: 'Spaghetti 500g', category: 'Groceries', price: 9.0, quantity: 0, threshold: 10 },

  // Beverages
  { id: 6, name: 'Bottled water 750ml', category: 'Beverages', price: 3.0, quantity: 120, threshold: 30 },
  { id: 7, name: 'Malt drink can', category: 'Beverages', price: 8.0, quantity: 36, threshold: 12 },
  { id: 8, name: 'Orange juice 1L', category: 'Beverages', price: 15.0, quantity: 5, threshold: 8 },
  { id: 9, name: 'Soft drink 500ml', category: 'Beverages', price: 5.0, quantity: 60, threshold: 20 },
  { id: 10, name: 'Milo 400g tin', category: 'Beverages', price: 38.0, quantity: 18, threshold: 6 },

  // Toiletries
  { id: 11, name: 'Bathing soap', category: 'Toiletries', price: 6.0, quantity: 50, threshold: 15 },
  { id: 12, name: 'Toothpaste', category: 'Toiletries', price: 12.0, quantity: 28, threshold: 10 },
  { id: 13, name: 'Body lotion 250ml', category: 'Toiletries', price: 25.0, quantity: 14, threshold: 5 },
  { id: 14, name: 'Tissue roll pack', category: 'Toiletries', price: 20.0, quantity: 9, threshold: 10 },
  { id: 15, name: 'Sanitary pads', category: 'Toiletries', price: 15.0, quantity: 22, threshold: 8 },

  // Pharmacy
  { id: 16, name: 'Paracetamol 500mg strip', category: 'Pharmacy', price: 4.0, quantity: 80, threshold: 25 },
  { id: 17, name: 'Vitamin C tablets', category: 'Pharmacy', price: 18.0, quantity: 33, threshold: 10 },
  { id: 18, name: 'Hand sanitizer 100ml', category: 'Pharmacy', price: 10.0, quantity: 4, threshold: 8 },
  { id: 19, name: 'Plasters box', category: 'Pharmacy', price: 7.0, quantity: 40, threshold: 10 },
  { id: 20, name: 'ORS sachet', category: 'Pharmacy', price: 3.5, quantity: 55, threshold: 15 },

  // Household
  { id: 21, name: 'Detergent powder 1kg', category: 'Household', price: 28.0, quantity: 24, threshold: 8 },
  { id: 22, name: 'Bleach 750ml', category: 'Household', price: 12.0, quantity: 17, threshold: 6 },
  { id: 23, name: 'Matches pack', category: 'Household', price: 2.0, quantity: 70, threshold: 20 },
  { id: 24, name: 'Candles pack', category: 'Household', price: 8.0, quantity: 7, threshold: 7 },
  { id: 25, name: 'Light bulb 40W', category: 'Household', price: 10.0, quantity: 26, threshold: 8 },
];