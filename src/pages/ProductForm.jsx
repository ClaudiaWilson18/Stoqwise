import { useNavigate, useParams } from "react-router-dom";
import "../styles/inventory.css";

// Change this if the path in App.jsx is different.
const INVENTORY_PATH = "/inventory";

const CATEGORIES = ["Beverages", "Groceries", "Pharmacy", "Spare parts"];

// One form for both Add and Edit.
// Edit mode: the route has an id (for example /inventory/:id/edit),
// or you pass mode="edit".
// 30 Nov: load the product with useProducts when editing, run Rooney's
// validators on Save, then call addProduct or updateProduct.
export default function ProductForm({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === "edit" || Boolean(id);

  function goBack() {
    navigate(INVENTORY_PATH);
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Validation and saving are added on 30 Nov.
  }

  return (
    <section className="inv-page">
      <button type="button" className="inv-back" onClick={goBack}>
        &lsaquo; Back to Inventory
      </button>

      <h1 className="inv-title">{isEdit ? "Edit product" : "Add product"}</h1>

      <form className="inv-card pf-form" onSubmit={handleSubmit} noValidate>
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
          <button type="button" className="inv-btn inv-btn--secondary" onClick={goBack}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
