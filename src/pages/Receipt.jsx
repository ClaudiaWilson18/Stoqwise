import { Plus, Printer, History } from 'lucide-react';
import { Button, Banner } from '../components/ui';
import '../styles/sales.css';

// Hard-coded static sample receipt data for Phase 1 (23 Nov - 25 Nov)
// Follows agreed Sale and Sale Item data shapes (Alfred & Nana):
// Sale: id, receiptNumber, date, staff, items, total.
// Sale item: productId, name, quantity, price.
const DEFAULT_SALE = {
  id: 'sale-101',
  receiptNumber: 'REC-20261123-0042',
  date: '2026-11-23 14:35',
  staff: 'Newton Nsiah Arthur',
  paymentMethod: 'Cash',
  items: [
    { productId: 1, name: 'Milo Tin 400g', quantity: 2, price: 38.5 },
    { productId: 8, name: 'Bottled Water 1.5L', quantity: 4, price: 5.0 },
    { productId: 3, name: 'Frytol Cooking Oil 1L', quantity: 1, price: 32.0 },
  ],
  total: 129.0,
};

export default function Receipt() {
  const sale = DEFAULT_SALE;

  const handlePrint = () => {
    window.print();
  };

  const handleNewSale = () => {
    window.location.href = '/sales/new';
  };

  const handleViewHistory = () => {
    window.location.href = '/sales';
  };

  return (
    <section className="receipt-page">
      {/* Banner using exact text requested in design document */}
      <div className="receipt-banner-wrap">
        <Banner variant="success">Sale recorded. Stock updated.</Banner>
      </div>

      <div className="receipt-card">
        {/* Brand header */}
        <div className="receipt-brand">
          <h1 className="receipt-brand-title">StoqWise</h1>
          <p className="receipt-brand-tagline">Small Business Inventory &amp; Sales Tracker</p>
        </div>

        {/* Metadata section */}
        <div className="receipt-meta-grid">
          <div className="receipt-meta-item">
            <span className="receipt-meta-label">Receipt Number</span>
            <span className="receipt-meta-value">{sale.receiptNumber}</span>
          </div>
          <div className="receipt-meta-item">
            <span className="receipt-meta-label">Date &amp; Time</span>
            <span className="receipt-meta-value">{sale.date}</span>
          </div>
          <div className="receipt-meta-item">
            <span className="receipt-meta-label">Staff Name</span>
            <span className="receipt-meta-value">{sale.staff}</span>
          </div>
          <div className="receipt-meta-item">
            <span className="receipt-meta-label">Payment Method</span>
            <span className="receipt-meta-value">{sale.paymentMethod || 'Cash'}</span>
          </div>
        </div>

        {/* Items breakdown table */}
        <table className="receipt-table" aria-label="Receipt items breakdown">
          <thead>
            <tr>
              <th>Item</th>
              <th className="num">Qty</th>
              <th className="num">Price</th>
              <th className="num">Total</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item, index) => (
              <tr key={item.productId || index}>
                <td className="receipt-item-name">{item.name}</td>
                <td className="num">{item.quantity}</td>
                <td className="num">GH₵ {item.price.toFixed(2)}</td>
                <td className="num">GH₵ {(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="receipt-totals">
          <div className="receipt-total-row">
            <span>Subtotal</span>
            <span className="num">GH₵ {sale.total.toFixed(2)}</span>
          </div>
          <div className="receipt-total-row">
            <span>VAT / Tax (0%)</span>
            <span className="num">GH₵ 0.00</span>
          </div>
          <div className="receipt-total-row receipt-total-row--grand">
            <span>Total</span>
            <span className="receipt-grand-amount">GH₵ {sale.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="receipt-footer">
          <p className="receipt-footer-note">Thank you for your purchase!</p>
          <p>Please keep this receipt for your records.</p>
        </div>
      </div>

      {/* Action buttons: New sale, Print receipt, View history */}
      <div className="receipt-actions">
        <Button variant="primary" block icon={Plus} onClick={handleNewSale}>
          New sale
        </Button>
        <div className="receipt-actions-row">
          <Button variant="secondary" icon={Printer} onClick={handlePrint}>
            Print receipt
          </Button>
          <Button variant="secondary" icon={History} onClick={handleViewHistory}>
            View history
          </Button>
        </div>
      </div>
    </section>
  );
}
