import { seedProducts } from './products';
import { seedUsers } from './users';
import { seedSales } from './sales';
import { applySale } from '../utils/stock';

const KEYS = {
  products: 'stoqwise_products',
  users: 'stoqwise_users',
  sales: 'stoqwise_sales',
};

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable: the app still works for this session.
  }
}

// Load from localStorage. Only use the sample data when nothing is stored yet.
function load(key, seed) {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) return JSON.parse(raw);
  } catch {
    // Fall through to the seed data.
  }
  save(key, seed);
  return seed;
}

const nextId = (list) => list.reduce((max, item) => Math.max(max, item.id), 0) + 1;

export const getUsers = () => load(KEYS.users, seedUsers);
export const getProducts = () => load(KEYS.products, seedProducts);
export const getSales = () => load(KEYS.sales, seedSales);

export function addUser({ name, username, password }) {
  const users = getUsers();
  const taken = users.some(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
  );
  if (taken) return { ok: false, error: 'That username is already taken' };

  const user = {
    id: nextId(users),
    name: name.trim(),
    username: username.trim(),
    password,
    role: 'Sales Staff',
  };
  save(KEYS.users, [...users, user]);
  return { ok: true, user };
}

export function getProductById(id) {
  return getProducts().find((p) => p.id === id) || null;
}

export function addProduct(data) {
  const products = getProducts();
  const product = { ...data, id: nextId(products) };
  save(KEYS.products, [...products, product]);
  return product;
}

export function updateProduct(id, changes) {
  const products = getProducts();
  let updated = null;
  const next = products.map((p) => {
    if (p.id !== id) return p;
    updated = { ...p, ...changes, id };
    return updated;
  });
  if (!updated) return null;
  save(KEYS.products, next);
  return updated;
}

export function deleteProduct(id) {
  const products = getProducts();
  const next = products.filter((p) => p.id !== id);
  if (next.length === products.length) return false;
  save(KEYS.products, next);
  return true;
}

// requestedItems: [{ productId, quantity }]. Throws an Error if stock is too low.
export function recordSale(staff, requestedItems) {
  const { updatedProducts, items, total } = applySale(getProducts(), requestedItems);

  const sales = getSales();
  const id = nextId(sales);
  const sale = {
    id,
    receiptNumber: `RCP-${String(id).padStart(4, '0')}`,
    date: new Date().toISOString(),
    staff,
    items,
    total,
  };

  save(KEYS.products, updatedProducts);
  save(KEYS.sales, [...sales, sale]);
  return sale;
}