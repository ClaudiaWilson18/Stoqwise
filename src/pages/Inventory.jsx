import "../styles/inventory.css";

// Hard-coded data for the static version (25 Nov).
// On 26 Nov this is replaced by: const { products } = useProducts();
const PRODUCTS = [
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

// Same rule Alfred writes in the service layer:
// 0 = Out of stock, at or below threshold = Low stock, otherwise In stock.
function getStockStatus(product) {
  if (product.quantity === 0) return "Out of stock";
  if (product.quantity <= product.threshold) return "Low stock";
  return "In stock";
}

// Swap for Alex's <Tag /> component once it lands (25 Nov).
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
  return (
    <section className="inv-page">
      <header className="inv-header">
        <h1 className="inv-title">Inventory</h1>
        <button type="button" className="inv-btn inv-btn--primary">
          + Add product
        </button>
      </header>

      <div className="inv-controls">
        <input
          type="search"
          className="inv-field"
          placeholder="Search products"
          aria-label="Search products"
        />
        <select className="inv-field" aria-label="Category" defaultValue="">
          <option value="">Category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select className="inv-field" aria-label="Stock status" defaultValue="">
          <option value="">Stock status</option>
          <option value="in">In stock</option>
          <option value="low">Low stock</option>
          <option value="out">Out of stock</option>
        </select>
        <select className="inv-field" aria-label="Sort by" defaultValue="">
          <option value="">Sort by</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="quantity">Quantity</option>
        </select>
      </div>

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
            {PRODUCTS.map((p) => (
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
                    <button type="button" className="inv-btn inv-btn--secondary">
                      Edit
                    </button>
                    <button type="button" className="inv-btn inv-btn--danger">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="inv-footer">
        <p className="inv-count">
          Showing 1 to {PRODUCTS.length} of {PRODUCTS.length} products
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
