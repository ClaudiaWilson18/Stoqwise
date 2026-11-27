import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button, Input, Select, Tag, Table } from "../components/ui";
import "../styles/inventory.css";

// Change these two if the paths in App.jsx are different.
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

const CATEGORY_OPTIONS = [
  { value: "", label: "All categories" },
  "Beverages",
  "Groceries",
  "Pharmacy",
  "Spare parts",
];

const STATUS_OPTIONS = [
  { value: "", label: "All stock statuses" },
  { value: "in", label: "In stock" },
  { value: "low", label: "Low stock" },
  { value: "out", label: "Out of stock" },
];

const SORT_OPTIONS = [
  { value: "", label: "Default order" },
  { value: "name", label: "Name (A to Z)" },
  { value: "price-asc", label: "Price (low to high)" },
  { value: "price-desc", label: "Price (high to low)" },
  { value: "quantity-asc", label: "Quantity (low to high)" },
];

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

// 0 = Out of stock, at or below threshold = Low stock, otherwise In stock.
// On 28 Nov use Alfred's getStockStatus instead of this copy.
function getStockStatus(product) {
  if (product.quantity === 0) return "Out of stock";
  if (product.quantity <= product.threshold) return "Low stock";
  return "In stock";
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
    // 30 Nov: replace with a proper confirmation box.
    // 28 Nov: replace the setProducts line with deleteProduct(product.id).
    if (window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    }
  }

  const columns = [
    { key: "name", label: "Product" },
    { key: "category", label: "Category" },
    {
      key: "price",
      label: "Price",
      numeric: true,
      render: (p) => `GH₵ ${p.price.toFixed(2)}`,
    },
    { key: "quantity", label: "Quantity", numeric: true },
    { key: "threshold", label: "Threshold", numeric: true },
    {
      key: "status",
      label: "Status",
      render: (p) => <Tag status={getStockStatus(p)} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (p) => (
        <div className="inv-actions">
          <Button
            variant="secondary"
            icon={Pencil}
            onClick={() => navigate(editPath(p.id))}
          >
            Edit
          </Button>
          <Button variant="danger" icon={Trash2} onClick={() => handleDelete(p)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <section className="inv-page">
      <header className="inv-header">
        <h1 className="inv-title">Inventory</h1>
        <Button icon={Plus} onClick={() => navigate(NEW_PRODUCT_PATH)}>
          Add product
        </Button>
      </header>

      <div className="inv-controls">
        <Input
          label="Search products"
          type="search"
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          label="Category"
          options={CATEGORY_OPTIONS}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <Select
          label="Stock status"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
        <Select
          label="Sort by"
          options={SORT_OPTIONS}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        />
      </div>

      <Table
        columns={columns}
        rows={rows}
        rowKey="id"
        caption="Products"
        emptyMessage="No products found. Try a different search, or clear the filters."
      />

      {rows.length === 0 && hasFilters && (
        <div className="inv-empty-actions">
          <Button variant="secondary" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      )}

      <footer className="inv-footer">
        <p className="inv-count">
          {rows.length === 0
            ? "Showing 0 products"
            : `Showing 1 to ${rows.length} of ${rows.length} products`}
        </p>
        <div className="inv-pager">
          <Button variant="secondary" disabled>
            Previous
          </Button>
          <Button variant="secondary" disabled>
            Next
          </Button>
        </div>
      </footer>
    </section>
  );
}
