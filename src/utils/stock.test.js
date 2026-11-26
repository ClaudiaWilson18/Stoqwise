import { describe, it, expect, beforeEach } from 'vitest';
import {
  getStockStatus,
  getLowStockItems,
  getLowStockCount,
  applySale,
} from './stock';
import { seedProducts } from '../data/products';

describe('getStockStatus', () => {
  it('returns Out of stock when quantity is 0', () => {
    expect(getStockStatus({ quantity: 0, threshold: 10 })).toBe('Out of stock');
  });

  it('returns Low stock when quantity is below the threshold', () => {
    expect(getStockStatus({ quantity: 3, threshold: 10 })).toBe('Low stock');
  });

  it('returns Low stock when quantity equals the threshold', () => {
    expect(getStockStatus({ quantity: 10, threshold: 10 })).toBe('Low stock');
  });

  it('returns In stock when quantity is above the threshold', () => {
    expect(getStockStatus({ quantity: 11, threshold: 10 })).toBe('In stock');
  });
});

describe('low-stock selectors', () => {
  it('includes low and out-of-stock products, and nothing else', () => {
    const items = getLowStockItems(seedProducts);
    const statuses = items.map(getStockStatus);
    expect(statuses.every((s) => s !== 'In stock')).toBe(true);
    expect(items.length).toBe(6); // 5 low + 1 out of stock in the seed data
  });

  it('getLowStockCount matches getLowStockItems', () => {
    expect(getLowStockCount(seedProducts)).toBe(getLowStockItems(seedProducts).length);
  });
});

describe('applySale', () => {
  let products;
  beforeEach(() => {
    products = [
      { id: 1, name: 'Rice 5kg', category: 'Groceries', price: 85, quantity: 40, threshold: 10 },
      { id: 2, name: 'Sugar 1kg', category: 'Groceries', price: 18, quantity: 5, threshold: 10 },
    ];
  });

  it('selling 3 units lowers stock by 3', () => {
    const { updatedProducts } = applySale(products, [{ productId: 1, quantity: 3 }]);
    expect(updatedProducts.find((p) => p.id === 1).quantity).toBe(37);
  });

  it('selling more than the stock gives an error', () => {
    expect(() => applySale(products, [{ productId: 2, quantity: 6 }])).toThrow(/Only 5/);
  });

  it('changes nothing when one item in the sale fails', () => {
    expect(() =>
      applySale(products, [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 99 },
      ])
    ).toThrow();
    expect(products[0].quantity).toBe(40);
  });

  it('does not mutate the original products', () => {
    applySale(products, [{ productId: 1, quantity: 3 }]);
    expect(products[0].quantity).toBe(40);
  });

  it('calculates the total from the item prices', () => {
    const { total, items } = applySale(products, [
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 1 },
    ]);
    expect(total).toBe(188); // 2 x 85 + 1 x 18
    expect(items[0]).toEqual({ productId: 1, name: 'Rice 5kg', quantity: 2, price: 85 });
  });

  it('checks the combined quantity when a product is repeated', () => {
    expect(() =>
      applySale(products, [
        { productId: 2, quantity: 3 },
        { productId: 2, quantity: 3 },
      ])
    ).toThrow(/Only 5/);
  });

  it('rejects zero, negative and fractional quantities', () => {
    expect(() => applySale(products, [{ productId: 1, quantity: 0 }])).toThrow();
    expect(() => applySale(products, [{ productId: 1, quantity: -2 }])).toThrow();
    expect(() => applySale(products, [{ productId: 1, quantity: 1.5 }])).toThrow();
  });

  it('rejects an empty sale and an unknown product', () => {
    expect(() => applySale(products, [])).toThrow();
    expect(() => applySale(products, [{ productId: 999, quantity: 1 }])).toThrow(/not found/);
  });

  it('turns a product Low stock after a sale', () => {
    const { updatedProducts } = applySale(products, [{ productId: 1, quantity: 31 }]);
    expect(getStockStatus(updatedProducts.find((p) => p.id === 1))).toBe('Low stock');
  });
});