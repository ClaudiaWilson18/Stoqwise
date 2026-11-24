import "../styles/inventory.css";

const CATEGORIES = ["Beverages", "Groceries", "Pharmacy", "Spare parts"];

// Static version (25 Nov): one form for both Add and Edit.
// Later: read the product from useProducts when editing, run Rooney's
// validators on Save, and call addProduct / updateProduct.
export default function ProductForm({ mode = "add" }) {
  const isEdit = mode === "edit";

  return (
    <section className="inv-page">
      <button type="button" className="inv-back">
        &lsaquo; Back to Inventory
      </button>

      <h1 className="inv-title">{isEdit ? "Edit product" : "Add product"}</h1>

      <form className="inv-card pf-form" onSubmit={(e) => e.preventDefault()} noValidate>
        <div className="pf-group">
          <label htmlFor="pf-name" className="pf-label">
            Product name
          </label>
          <input id="pf-name" type="text" className="inv-field" />
          <p className="pf-hint">Enter the name customers know it by.</p>
        </div>

        <div className="pf-group">
          <label htmlFor="pf-category" className="pf-label">
            Category
          </label>
          <select id="pf-category" className="inv-field" defaultValue="">
            <option value="" disabled>
              Choose a category
            </option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <p className="pf-hint">Pick the group this product belongs to.</p>
        </div>

        <div className="pf-row">
          <div className="pf-group">
            <label htmlFor="pf-price" className="pf-label">
              Price
            </label>
            <input id="pf-price" type="number" min="0" step="0.01" className="inv-field" />
            <p className="pf-hint">Price per unit. Must be above 0.</p>
          </div>

          <div className="pf-group">
            <label htmlFor="pf-quantity" className="pf-label">
              Quantity in stock
            </label>
            <input id="pf-quantity" type="number" min="0" step="1" className="inv-field" />
            <p className="pf-hint">Whole number, 0 or more.</p>
          </div>
        </div>

        <div className="pf-group">
          <label htmlFor="pf-threshold" className="pf-label">
            Low-stock threshold
          </label>
          <input id="pf-threshold" type="number" min="0" step="1" className="inv-field" />
          <p className="pf-hint">
            You get a low-stock alert when quantity falls below this number
          </p>
        </div>

        <div className="pf-buttons">
          <button type="submit" className="inv-btn inv-btn--primary">
            Save product
          </button>
          <button type="button" className="inv-btn inv-btn--secondary">
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
