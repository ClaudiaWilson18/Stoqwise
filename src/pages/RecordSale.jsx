import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingCart, Search } from 'lucide-react';
import { Button, Tag, Input, Select, Table, Card, Banner } from '../components/ui';
import { getStockStatus } from '../utils/stock';
import { positiveNumber, wholeNumber } from '../utils/validators';
import { CATEGORIES as SHARED_CATEGORIES } from '../data/categories';
import { getProducts } from '../data/productService';
import '../styles/sales.css';

// Quantity validator using Success's validator functions
function validateQuantity(quantity, maxStock, productName) {
  const wholeErr = wholeNumber(quantity);
  if (wholeErr) return `${productName}: ${wholeErr}`;
  const posErr = positiveNumber(quantity);
  if (posErr) return `${productName}: ${posErr}`;
  if (Number(quantity) > maxStock) {
    return `"${productName}" exceeds available stock (${maxStock} in stock).`;
  }
  return '';
}

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

  // Validation: check if any cart quantity violates wholeNumber, positiveNumber or stock limits
  const stockErrors = useMemo(() => {
    const errors = [];
    saleItems.forEach((item) => {
      const err = validateQuantity(item.quantity, item.maxStock, item.name);
      if (err) errors.push(err);
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

  // Table columns definition for Alex's Table component
  const productColumns = useMemo(
    () => [
      {
        key: 'name',
        label: 'Product',
        render: (p) => (
          <div>
            <div className="sale-product-name">{p.name}</div>
            <div className="sale-product-cat">{p.category}</div>
          </div>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        render: (p) => <Tag status={getStockStatus(p)} />,
      },
      {
        key: 'price',
        label: 'Price',
        numeric: true,
        render: (p) => `GH₵ ${p.price.toFixed(2)}`,
      },
      {
        key: 'quantity',
        label: 'Stock',
        numeric: true,
      },
      {
        key: 'action',
        label: 'Action',
        render: (p) => (
          <Button
            variant="secondary"
            onClick={() => handleAddToCart(p)}
            disabled={p.quantity === 0}
            aria-label={`Add ${p.name} to sale`}
          >
            + Add
          </Button>
        ),
      },
    ],
    []
  );

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
        {/* LEFT COLUMN: Product search & catalog using Alex's Card, Input, Select, Table */}
        <Card className="sale-catalog-card">
          <div className="sale-panel-header">
            <h2 className="sale-panel-title">
              <Search size={20} aria-hidden="true" />
              <span>Products</span>
            </h2>
            <span className="sale-count-badge">{filteredProducts.length}</span>
          </div>

          <div className="sale-search-bar">
            <Input
              label="Search products"
              type="search"
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              label="Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={categories}
            />
          </div>

          <Table
            columns={productColumns}
            rows={filteredProducts}
            rowKey="id"
            caption="Available Products"
            emptyMessage="No products match your search."
          />
        </Card>

        {/* RIGHT COLUMN: Current sale with quantities, errors, total using Alex's Card & Banner */}
        <Card className="sale-cart-card">
          <div className="sale-panel-header">
            <h2 className="sale-panel-title">
              <ShoppingCart size={20} aria-hidden="true" />
              <span>Current sale</span>
            </h2>
            <span className="sale-count-badge">{totalItemsCount} items</span>
          </div>

          {/* Error area for quantity/stock violations using Alex's Banner */}
          {stockErrors.length > 0 && (
            <div className="sale-error-wrap">
              {stockErrors.map((err, i) => (
                <Banner key={i} variant="danger" label="Quantity error">
                  {err}
                </Banner>
              ))}
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
                const itemError = validateQuantity(item.quantity, item.maxStock, item.name);
                return (
                  <div
                    key={item.productId}
                    className={`sale-cart-item ${itemError ? 'sale-cart-item--error' : ''}`}
                  >
                    <div className="sale-cart-item-info">
                      <div className="sale-cart-item-title">{item.name}</div>
                      <div className="sale-cart-item-meta">
                        GH₵ {item.price.toFixed(2)} each &bull; Stock: {item.maxStock}
                      </div>
                      {itemError && <div className="field__error">{itemError}</div>}
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
        </Card>
      </div>
    </section>
  );
}
