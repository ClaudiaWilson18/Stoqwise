import { describe, it, expect, beforeEach } from 'vitest';
import { getProducts, getSales, recordSale } from './productService';

describe('recordSale', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('lowers stock by 3, saves the sale and survives a reload', () => {
    const before = getProducts().find((p) => p.id === 1).quantity;
    const salesBefore = getSales().length;

    const sale = recordSale('Test Staff', [{ productId: 1, quantity: 3 }]);

    expect(getProducts().find((p) => p.id === 1).quantity).toBe(before - 3);
    expect(getSales().length).toBe(salesBefore + 1);
    expect(sale.receiptNumber).toMatch(/^RCP-\d{4}$/);
  });

  it('leaves stock alone when the sale is rejected', () => {
    const before = getProducts().find((p) => p.id === 5).quantity; // out of stock
    expect(() => recordSale('Test Staff', [{ productId: 5, quantity: 1 }])).toThrow();
    expect(getProducts().find((p) => p.id === 5).quantity).toBe(before);
  });
});