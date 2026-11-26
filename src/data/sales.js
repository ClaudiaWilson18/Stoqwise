import { seedProducts } from './products';
import { seedUsers } from './users';

// Small seeded random generator so every laptop gets identical sample sales.
function makeRng(seed) {
  let a = seed;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = makeRng(2026);
const pick = (n) => Math.floor(rand() * n);

const SALE_COUNT = 40;
const DAYS_SPAN = 56; // about two months, starting 1 Oct 2026

const raw = Array.from({ length: SALE_COUNT }, (_, i) => {
  const dayOffset = Math.floor((i / SALE_COUNT) * DAYS_SPAN);
  const date = new Date(2026, 9, 1 + dayOffset, 8 + pick(11), pick(60));

  // 1 to 4 different products, 1 to 4 units each, at today's prices
  const itemCount = 1 + pick(4);
  const chosen = new Set();
  while (chosen.size < itemCount) chosen.add(seedProducts[pick(seedProducts.length)]);

  const items = [...chosen].map((p) => ({
    productId: p.id,
    name: p.name,
    quantity: 1 + pick(4),
    price: p.price,
  }));

  const total = Math.round(items.reduce((sum, it) => sum + it.price * it.quantity, 0) * 100) / 100;
  const staff = seedUsers[pick(seedUsers.length)].name;

  return { date, items, total, staff };
});

raw.sort((a, b) => a.date - b.date);

export const seedSales = raw.map((s, i) => ({
  id: i + 1,
  receiptNumber: `RCP-${String(i + 1).padStart(4, '0')}`,
  date: s.date.toISOString(),
  staff: s.staff,
  items: s.items,
  total: s.total,
}));