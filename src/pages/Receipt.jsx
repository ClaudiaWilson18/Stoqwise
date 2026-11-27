import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Printer, History } from 'lucide-react';
import { Button, Banner, Card, Table } from '../components/ui';
import '../styles/sales.css';

// Fallback sample receipt data matching Alfred & Nana's agreed Sale data shape
const DEFAULT_SALE = {
  id: 101,
  receiptNumber: 'RCP-0101',
  date: '2026-11-25T14:35:00.000Z',
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
  const navigate = useNavigate();
  const location = useLocation();

  // If navigated from RecordSale with completed sale state, use it;
  // otherwise fallback to the agreed mock sale data
  const sale = location.state?.sale || DEFAULT_SALE;

  // Columns definition for Alex's Table component
  const receiptColumns = useMemo(
    () => [
      {
        key: 'name',
        label: 'Item',
        render: (item) => <span className="receipt-item-name">{item.name}</span>,
      },
      {
        key: 'quantity',
        label: 'Qty',
        numeric: true,
      },
      {
        key: 'price',
        label: 'Price',
        numeric: true,
        render: (item) => `GH₵ ${item.price.toFixed(2)}`,
      },
      {
        key: 'total',
        label: 'Total',
        numeric: true,
        render: (item) => `GH₵ ${(item.quantity * item.price).toFixed(2)}`,
      },
    ],
    []
  );

  const formattedDate = useMemo(() => {
    try {
      const d = new Date(sale.date);
      return isNaN(d.getTime()) ? sale.date : d.toLocaleString();
    } catch {
      return sale.date;
    }
  }, [sale.date]);

  const handlePrint = () => {
    window.print();
  };

  const handleNewSale = () => {
    navigate('/sales/new');
  };

  const handleViewHistory = () => {
    navigate('/sales');
  };

  return (
    <section className="receipt-page">
      <button
        type="button"
        className="sale-back-btn"
        onClick={() => navigate('/sales/new')}
        aria-label="Back to Record Sale"
      >
        &lsaquo; Back to Record Sale
      </button>

      {/* Banner using exact text requested in design document */}
      <div className="receipt-banner-wrap">
        <Banner variant="success">Sale recorded. Stock updated.</Banner>
      </div>

      <Card className="receipt-card">
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
            <span className="receipt-meta-value">{formattedDate}</span>
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

        {/* Items breakdown using Alex's Table component */}
        <Table
          columns={receiptColumns}
          rows={sale.items}
          rowKey="productId"
          caption="Receipt items breakdown"
        />

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
      </Card>

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
