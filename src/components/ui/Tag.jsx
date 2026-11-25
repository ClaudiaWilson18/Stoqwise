// Tag: shows a stock status. The text is always shown, and each status has a
// different border style, so status is never shown by colour alone.
//
//   <Tag status="In stock" />
//   <Tag status="Low stock" />
//   <Tag status="Out of stock" />
//
// `status` takes the exact strings returned by Alfred's getStockStatus().

const STATUS_CLASS = {
  'In stock': 'tag--in-stock',
  'Low stock': 'tag--low-stock',
  'Out of stock': 'tag--out-of-stock',
};

export default function Tag({ status, className = '' }) {
  const statusClass = STATUS_CLASS[status] || 'tag--in-stock';
  return <span className={`tag ${statusClass} ${className}`.trim()}>{status}</span>;
}
