// Card: white box with a border. Used for dashboard summary cards and chart panels.
//
//   <Card title="Total sales">GHS 12,400</Card>

export default function Card({ title, children, className = '', ...rest }) {
  return (
    <section className={`card ${className}`.trim()} {...rest}>
      {title && <h3 className="card__title">{title}</h3>}
      <div className="card__body">{children}</div>
    </section>
  );
}
