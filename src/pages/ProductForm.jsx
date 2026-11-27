import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button, Input, Select, Card } from "../components/ui";
import { required, positiveNumber, wholeNumber } from "../utils/validators";
import { CATEGORIES } from "../data/categories";
import "../styles/inventory.css";

// Change this if the path in App.jsx is different.
const INVENTORY_PATH = "/inventory";

const CATEGORY_OPTIONS = [{ value: "", label: "Choose a category" }, ...CATEGORIES];

const EMPTY_FORM = {
  name: "",
  category: "",
  price: "",
  quantity: "",
  threshold: "",
};

// One form for both Add and Edit.
// Edit mode: the route has an id (for example /inventory/:id/edit),
// or you pass mode="edit".
export default function ProductForm({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === "edit" || Boolean(id);

  const [form, setForm] = useState(EMPTY_FORM);
  // Each key holds an error message, or "" for no error.
  // Example: { price: "Enter a number above 0" }
  const [errors, setErrors] = useState({});

  // Returns an onChange handler for one field.
  // It also clears that field's error when the user starts typing again.
  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  function goBack() {
    navigate(INVENTORY_PATH);
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Each validator returns an error message, or "" when the value is fine.
    const newErrors = {
      name: required(form.name, "Product name"),
      category: required(form.category, "Category"),
      price: positiveNumber(form.price),
      quantity: wholeNumber(form.quantity),
      threshold: wholeNumber(form.threshold),
    };
    setErrors(newErrors);

    // Stop here if any field has an error.
    if (Object.values(newErrors).some((msg) => msg !== "")) return;

    // Everything is valid.
    // 28 Nov onward: call addProduct(form) or updateProduct(id, form)
    // from useProducts, then goBack().
  }

  return (
    <section className="inv-page">
      <div className="inv-back">
        <Button variant="secondary" icon={ArrowLeft} onClick={goBack}>
          Back to Inventory
        </Button>
      </div>

      <h1 className="inv-title">{isEdit ? "Edit product" : "Add product"}</h1>

      <Card className="pf-card">
        <form onSubmit={handleSubmit} noValidate className="pf-form">
          <Input
            label="Product name"
            value={form.name}
            onChange={update("name")}
            hint="Enter the name customers know it by."
            error={errors.name}
            required
          />

          <Select
            label="Category"
            options={CATEGORY_OPTIONS}
            value={form.category}
            onChange={update("category")}
            hint="Pick the group this product belongs to."
            error={errors.category}
            required
          />

          <div className="pf-row">
            <Input
              label="Price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={update("price")}
              hint="Price per unit. Must be above 0."
              error={errors.price}
              required
            />
            <Input
              label="Quantity in stock"
              type="number"
              min="0"
              step="1"
              value={form.quantity}
              onChange={update("quantity")}
              hint="Whole number, 0 or more."
              error={errors.quantity}
              required
            />
          </div>

          <Input
            label="Low-stock threshold"
            type="number"
            min="0"
            step="1"
            value={form.threshold}
            onChange={update("threshold")}
            hint="You get a low-stock alert when quantity falls below this number"
            error={errors.threshold}
            required
          />

          <div className="pf-buttons">
            <Button type="submit">Save product</Button>
            <Button variant="secondary" onClick={goBack}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}
