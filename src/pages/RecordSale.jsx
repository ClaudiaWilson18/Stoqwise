import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingCart, Search, AlertCircle } from 'lucide-react';
import { Button, Tag } from '../components/ui';
import { getStockStatus } from '../utils/stock';
import { CATEGORIES as SHARED_CATEGORIES } from '../data/categories';
import { getProducts } from '../data/productService';
import '../styles/sales.css';

export default function RecordSale() {
  const navigate = useNavigate();

  // Load products from Alfred's product service (localStorage with seed fallback)
  const [products] = useState(() => getProducts());
  const categories = useMemo(() => ['All', ...SHARED_CATEGORIES], []);

  // Search & filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Current sale items state (pre-filled with sample items for initial sketch demonstration)
  const [saleItems, setSaleItems] = useState(() => {
    const p1 = products.find((p) => p.id === 1) || products[0];
    const p2 = products.find((p) => p.id === 8) || products[1];
    return [
      { productId: p1.id, name: p1.name, price: p1.price, quantity: 2, maxStock: p1.quantity },
      { productId: p2.id, name: p2.name, price: p2.price, quantity: 4, maxStock: p2.quantity },
    ];
  });

  // Filter products on the left
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // Validation: check if any cart quantity exceeds available stock
  const stockErrors = useMemo(() => {
    const errors = [];
    saleItems.forEach((item) => {
      if (item.quantity > item.maxStock) {
        errors.push(`"${item.name}" exceeds available stock (${item.maxStock} in stock).`);
      } else if (item.quantity <= 0 || isNaN(item.quantity)) {
        errors.push(`Enter a valid quantity greater than 0 for "${item.name}".`);
      }
    });
    return errors;
  }, [saleItems]);

  // Calculate totals
  const totalItemsCount = useMemo(() => {
    return saleItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  }, [saleItems]);

  const totalAmount = useMemo(() => {
    return saleItems.reduce((sum, item) => sum + item.price * (Number(item.quantity) || 0), 0);
  }, [saleItems]);

  // Cart operations
  const handleAddToCart = (product) => {
    if (product.quantity === 0) return;

    setSaleItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          maxStock: product.quantity,
        },
      ];
    });
  };

  const handleUpdateQuantity = (productId, newQty) => {
    const parsed = parseInt(newQty, 10);
    setSaleItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          return { ...item, quantity: isNaN(parsed) ? '' : Math.max(0, parsed) };
        }
        return item;
      })
    );
  };

  const handleIncrement = (productId) => {
    setSaleItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: (Number(item.quantity) || 0) + 1 } : item
      )
    );
  };

  const handleDecrement = (productId) => {
    setSaleItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId ? { ...item, quantity: (Number(item.quantity) || 0) - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId) => {
    setSaleItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleClearSale = () => {
    setSaleItems([]);
  };

  const handleCompleteSale = () => {
    if (saleItems.length === 0 || stockErrors.length > 0) return;

    const completedSale = {
      id: `sale-${Date.now()}`,
      receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      staff: 'Newton Nsiah Arthur',
      items: saleItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: Number(item.quantity),
        price: item.price,
      })),
      total: totalAmount,
    };

    navigate('/receipt', { state: { sale: completedSale } });
  };

  return (
    <section className="sale-page">
      <button
        type="button"
        className="sale-back-btn"
        onClick={() => navigate('/dashboard')}
        aria-label="Back to Dashboard"
      >
        &lsaquo; Back to Dashboard
      </button>

      <header className="sale-header">
        <div className="sale-title-wrap">
          <h1 className="sale-title">Record Sale</h1>
          <p className="sale-subtitle">Search products and process customer purchases</p>
        </div>
        <div className="sale-staff-badge">
          <span>Active Staff:</span>
          <strong>Newton Nsiah Arthur</strong>
        </div>
      </header>

      <div className="sale-grid">
        {/* LEFT COLUMN: Product search & catalog */}
        <section className="sale-panel" aria-label="Product Search and Catalog">
          <div className="sale-panel-header">
            <h2 className="sale-panel-title">
              <Search size={20} aria-hidden="true" />
              <span>Products</span>
            </h2>
            <span className="sale-count-badge">{filteredProducts.length}</span>
          </div>

          <div className="sale-search-bar">
            <input
              type="search"
              className="sale-search-input"
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search products"
            />
            <select
              className="sale-filter-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by category"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="sale-product-table-wrap">
            <table className="sale-product-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Status</th>
                  <th className="num">Price</th>
                  <th className="num">Stock</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="sale-cart-empty">
                      No products match your search.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const status = getStockStatus(p);
                    const isOut = p.quantity === 0;
                    return (
                      <tr key={p.id}>
                        <td>
                          <div className="sale-product-name">{p.name}</div>
                          <div className="sale-product-cat">{p.category}</div>
                        </td>
                        <td>
                          <Tag status={status} />
                        </td>
                        <td className="num sale-product-price">GH₵ {p.price.toFixed(2)}</td>
                        <td className="num">{p.quantity}</td>
                        <td>
                          <Button
                            variant="secondary"
                            onClick={() => handleAddToCart(p)}
                            disabled={isOut}
                            aria-label={`Add ${p.name} to sale`}
                          >
                            + Add
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* RIGHT COLUMN: Current sale with quantities, errors, total */}
        <section className="sale-panel" aria-label="Current Sale Cart">
          <div className="sale-panel-header">
            <h2 className="sale-panel-title">
              <ShoppingCart size={20} aria-hidden="true" />
              <span>Current sale</span>
            </h2>
            <span className="sale-count-badge">{totalItemsCount} items</span>
          </div>

          {/* Error area for quantity/stock violations */}
          {stockErrors.length > 0 && (
            <div className="sale-error-box" role="alert">
              <AlertCircle size={18} aria-hidden="true" />
              <div>
                {stockErrors.map((err, i) => (
                  <div key={i}>{err}</div>
                ))}
              </div>
            </div>
          )}

          {saleItems.length === 0 ? (
            <div className="sale-cart-empty">
              <p>No items added to current sale.</p>
              <p className="sale-subtitle">Search or select products on the left to add them.</p>
            </div>
          ) : (
            <div className="sale-cart-list">
              {saleItems.map((item) => {
                const hasError = item.quantity > item.maxStock || item.quantity <= 0;
                return (
                  <div
                    key={item.productId}
                    className={`sale-cart-item ${hasError ? 'sale-cart-item--error' : ''}`}
                  >
                    <div className="sale-cart-item-info">
                      <div className="sale-cart-item-title">{item.name}</div>
                      <div className="sale-cart-item-meta">
                        GH₵ {item.price.toFixed(2)} each &bull; Stock: {item.maxStock}
                      </div>
                    </div>

                    <div className="sale-qty-control">
                      <button
                        type="button"
                        className="sale-qty-btn"
                        onClick={() => handleDecrement(item.productId)}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        className="sale-qty-input"
                        min="1"
                        max={item.maxStock}
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(item.productId, e.target.value)}
                        aria-label={`Quantity for ${item.name}`}
                      />
                      <button
                        type="button"
                        className="sale-qty-btn"
                        onClick={() => handleIncrement(item.productId)}
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="sale-cart-item-total">
                      GH₵ {(item.price * (Number(item.quantity) || 0)).toFixed(2)}
                    </div>

                    <button
                      type="button"
                      className="sale-remove-btn"
                      onClick={() => handleRemoveItem(item.productId)}
                      title={`Remove ${item.name}`}
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Summary and totals */}
          <div className="sale-summary-card">
            <div className="sale-summary-row">
              <span>Total items</span>
              <span className="num">{totalItemsCount}</span>
            </div>
            <div className="sale-summary-row">
              <span>Subtotal</span>
              <span className="num">GH₵ {totalAmount.toFixed(2)}</span>
            </div>
            <div className="sale-summary-row sale-summary-row--total">
              <span>Total</span>
              <span className="sale-total-amount">GH₵ {totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="sale-actions">
            <Button
              variant="primary"
              block
              onClick={handleCompleteSale}
              disabled={saleItems.length === 0 || stockErrors.length > 0}
            >
              Complete sale
            </Button>
            {saleItems.length > 0 && (
              <Button variant="secondary" block onClick={handleClearSale}>
                Clear sale
              </Button>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
