export function getStockStatus(product) {
  if (product.quantity <= 0) return 'Out of stock';
  if (product.quantity <= product.threshold) return 'Low stock';
  return 'In stock';
}

// Products that need attention: low stock or out of stock.
export function getLowStockItems(products) {
  return products.filter((p) => getStockStatus(p) !== 'In stock');
}

export function getLowStockCount(products) {
  return getLowStockItems(products).length;
}

// Pure sale logic. Takes the current products and [{ productId, quantity }].
// Returns { updatedProducts, items, total }, or throws and changes nothing.
export function applySale(products, requestedItems) {
  if (!Array.isArray(requestedItems) || requestedItems.length === 0) {
    throw new Error('Add at least one item to the sale.');
  }

  // Merge repeated products so the stock check covers the combined quantity.
  const wanted = new Map();
  for (const { productId, quantity } of requestedItems) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('Enter a whole number above 0');
    }
    wanted.set(productId, (wanted.get(productId) || 0) + quantity);
  }

  const items = [];
  for (const [productId, quantity] of wanted) {
    const product = products.find((p) => p.id === productId);
    if (!product) throw new Error('Product not found.');
    if (quantity > product.quantity) {
      throw new Error(`Only ${product.quantity} of ${product.name} in stock.`);
    }
    items.push({ productId, name: product.name, quantity, price: product.price });
  }

  const updatedProducts = products.map((p) =>
    wanted.has(p.id) ? { ...p, quantity: p.quantity - wanted.get(p.id) } : p
  );
  const total = Math.round(items.reduce((sum, it) => sum + it.price * it.quantity, 0) * 100) / 100;

  return { updatedProducts, items, total };
}