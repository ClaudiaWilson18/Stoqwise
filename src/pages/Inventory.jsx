import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/inventory.css";

// Change these three if the paths in App.jsx are different.
const INVENTORY_PATH = "/inventory";
const NEW_PRODUCT_PATH = "/inventory/new";
const editPath = (id) => `/inventory/${id}/edit`;

// Hard-coded data for now.
// On 28 Nov replace with: const { products } = useProducts();
const INITIAL_PRODUCTS = [
  { id: 1, name: "Milo Tin 400g", category: "Beverages", price: 38.5, quantity: 42, threshold: 10 },
  { id: 2, name: "Gino Tomato Paste", category: "Groceries", price: 4.0, quantity: 8, threshold: 15 },
  { id: 3, name: "Frytol Cooking Oil 1L", category: "Groceries", price: 32.0, quantity: 27, threshold: 10 },
  { id: 4, name: "Paracetamol 500mg (pack)", category: "Pharmacy", price: 6.5, quantity: 0, threshold: 20 },
  { id: 5, name: "Vitamin C Tablets", category: "Pharmacy", price: 18.0, quantity: 12, threshold: 12 },
  { id: 6, name: "Brake Pads (set)", category: "Spare parts", price: 120.0, quantity: 14, threshold: 5 },
  { id: 7, name: "Engine Oil 4L", category: "Spare parts", price: 185.0, quantity: 3, threshold: 6 },
  { id: 8, name: "Bottled Water 1.5L", category: "Beverages", price: 5.0, quantity: 96, threshold: 24 },
];

const CATEGORIES = ["Beverages", "Groceries", "Pharmacy", "Spare parts"];

// 0 = Out of stock, at or below threshold = Low stock, otherwise In stock.
function getStockStatus(product) {
  if (product.quantity === 0) return "Out of stock";
  if (product.quantity <= product.threshold) return "Low stock";
  return "In stock";
}

// Maps the filter value (and the ?status= link) to the status text.
const STATUS_FILTERS = {
  in: "In stock",
  low: "Low stock",
  out: "Out of stock",
};

const SORTERS = {
  name: (a, b) => a.name.localeCompare(b.name),
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "quantity-asc": (a, b) => a.quantity - b.quantity,
};

// Swap for Alex's <Tag /> component when you switch to his components.
function StatusTag({ status }) {
  const cls =
    status === "Low stock"
      ? "inv-tag inv-tag--low"
      : status === "Out of stock"
      ? "inv-tag inv-tag--out"
      : "inv-tag inv-tag--in";
  return <span className={cls}>{status}</span>;
}

export default function Inventory() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  // Alfred's "View items" button opens /inventory?status=low
  const [status, setStatus] = useState(() => {
    const fromLink = searchParams.get("status");
    return STATUS_FILTERS[fromLink] ? fromLink : "";
  });
  const [sortBy, setSortBy] = useState("");

  // 1. filter
  const term = search.trim().toLowerCase();
  const visible = products.filter((p) => {
    if (term && !p.name.toLowerCase().includes(term)) return false;
    if (category && p.category !== category) return false;
    if (status && getStockStatus(p) !== STATUS_FILTERS[status]) return false;
    return true;
  });

  // 2. sort (copy first so the original order is not changed)
  const rows = SORTERS[sortBy] ? [...visible].sort(SORTERS[sortBy]) : visible;

  const hasFilters = term || category || status || sortBy;

  function clearFilters() {
    setSearch("");
    setCategory("");
    setStatus("");
    setSortBy("");
  }

  function handleDelete(product) {
    // Proper confirmation box comes on 30 Nov.
    // On 28 Nov replace the setProducts line with deleteProduct(product.id).
    if (window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    }
  }

  return (
    <section className="inv-page">
      <header className="inv-header">
        <h1 className="inv-title">Inventory</h1>
        <button
          type="button"
          className="inv-btn inv-btn--primary"
          onClick={() => navigate(NEW_PRODUCT_PATH)}
        >
          + Add product
        </button>
      </header>

      <div className="inv-controls">
        <input
          type="search"
          className="inv-field"
          placeholder="Search products"
          aria-label="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="inv-field"
          aria-label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className="inv-field"
          aria-label="Stock status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All stock statuses</option>
          <option value="in">In stock</option>
          <option value="low">Low stock</option>
          <option value="out">Out of stock</option>
        </select>
        <select
          className="inv-field"
          aria-label="Sort by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="name">Name (A to Z)</option>
          <option value="price-asc">Price (low to high)</option>
          <option value="price-desc">Price (high to low)</option>
          <option value="quantity-asc">Quantity (low to high)</option>
        </select>
      </div>

      {rows.length === 0 ? (
        <div className="inv-empty">
          <p className="inv-empty-title">No products found</p>
          <p className="inv-empty-text">
            Try a different search, or clear the filters to see every product.
          </p>
          {hasFilters && (
            <button
              type="button"
              className="inv-btn inv-btn--secondary"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="inv-table-wrap">
          <table className="inv-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th className="inv-num">Price</th>
                <th className="inv-num">Quantity</th>
                <th className="inv-num">Threshold</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td className="inv-num">GH₵ {p.price.toFixed(2)}</td>
                  <td className="inv-num">{p.quantity}</td>
                  <td className="inv-num">{p.threshold}</td>
                  <td>
                    <StatusTag status={getStockStatus(p)} />
                  </td>
                  <td>
                    <div className="inv-actions">
                      <button
                        type="button"
                        className="inv-btn inv-btn--secondary"
                        onClick={() => navigate(editPath(p.id))}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="inv-btn inv-btn--danger"
                        onClick={() => handleDelete(p)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <footer className="inv-footer">
        <p className="inv-count">
          {rows.length === 0
            ? "Showing 0 products"
            : `Showing 1 to ${rows.length} of ${rows.length} products`}
        </p>
        <div className="inv-pager">
          <button type="button" className="inv-btn inv-btn--secondary" disabled>
            Previous
          </button>
          <button type="button" className="inv-btn inv-btn--secondary" disabled>
            Next
          </button>
        </div>
      </footer>
    </section>
  );
}
