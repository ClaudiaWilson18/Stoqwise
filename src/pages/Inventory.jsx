import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button, Input, Select, Tag, Table } from "../components/ui";
import { CATEGORIES } from "../data/categories";
import { getProducts, deleteProduct } from "../data/productService";
import "../styles/inventory.css";

// Change these two if the paths in App.jsx are different.
const NEW_PRODUCT_PATH = "/inventory/new";
const editPath = (id) => `/inventory/${id}/edit`;

const PAGE_SIZE = 10;

const CATEGORY_OPTIONS = [{ value: "", label: "All categories" }, ...CATEGORIES];

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
// If Alfred exports getStockStatus (check src/utils/stock.js), import his
// and delete this copy so the whole app uses one rule.
function getStockStatus(product) {
  if (product.quantity === 0) return "Out of stock";
  if (product.quantity <= product.threshold) return "Low stock";
  return "In stock";
}

export default function Inventory() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 28 Nov: replace with const { products, deleteProduct } = useProducts();
  const [products, setProducts] = useState(() => getProducts());

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  // Alfred's "View items" button opens /inventory?status=low
  const [status, setStatus] = useState(() => {
    const fromLink = searchParams.get("status");
    return STATUS_FILTERS[fromLink] ? fromLink : "";
  });
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);

  // Change a filter and go back to page 1.
  function onFilterChange(setter) {
    return (e) => {
      setter(e.target.value);
      setPage(1);
    };
  }

  // 1. filter
  const term = search.trim().toLowerCase();
  const visible = products.filter((p) => {
    if (term && !p.name.toLowerCase().includes(term)) return false;
    if (category && p.category !== category) return false;
    if (status && getStockStatus(p) !== STATUS_FILTERS[status]) return false;
    return true;
  });

  // 2. sort (copy first so the original order is not changed)
  const sorted = SORTERS[sortBy] ? [...visible].sort(SORTERS[sortBy]) : visible;

  // 3. paginate
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const rows = sorted.slice(startIndex, startIndex + PAGE_SIZE);

  const hasFilters = term || category || status || sortBy;

  function clearFilters() {
    setSearch("");
    setCategory("");
    setStatus("");
    setSortBy("");
    setPage(1);
  }

  function handleDelete(product) {
    // 30 Nov: replace with a proper confirmation box.
    if (window.confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      deleteProduct(product.id); // Alfred's service saves to localStorage
      setProducts(getProducts()); // reload the list
    }
  }

  const columns = [
    { key: "name", label: "Product" },
    { key: "category", label: "Category" },
    {
      key: "price",
      label: "Price",
      numeric: true,
      render: (p) => `GHS ${p.price.toFixed(2)}`,
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
          onChange={onFilterChange(setSearch)}
        />
        <Select
          label="Category"
          options={CATEGORY_OPTIONS}
          value={category}
          onChange={onFilterChange(setCategory)}
        />
        <Select
          label="Stock status"
          options={STATUS_OPTIONS}
          value={status}
          onChange={onFilterChange(setStatus)}
        />
        <Select
          label="Sort by"
          options={SORT_OPTIONS}
          value={sortBy}
          onChange={onFilterChange(setSortBy)}
        />
      </div>

      <Table
        columns={columns}
        rows={rows}
        rowKey="id"
        caption="Products"
        emptyMessage="No products found. Try a different search, or clear the filters."
      />

      {total === 0 && hasFilters && (
        <div className="inv-empty-actions">
          <Button variant="secondary" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      )}

      <footer className="inv-footer">
        <p className="inv-count">
          {total === 0
            ? "Showing 0 products"
            : `Showing ${startIndex + 1} to ${startIndex + rows.length} of ${total} products`}
        </p>
        <div className="inv-pager">
          <Button
            variant="secondary"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </Button>
        </div>
      </footer>
    </section>
  );
}
