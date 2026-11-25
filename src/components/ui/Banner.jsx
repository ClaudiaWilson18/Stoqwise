// Banner: a message strip. The text label (for example "Low stock") is always shown
// and the warning style has a dashed border, so it is not colour alone.
//
// Low-stock alert at the top of the Dashboard (Alfred). The design asks for a
// "View items" button, so pass a Button as the action:
//   <Banner
//     variant="warning"
//     label="Low stock"
//     action={<Button variant="secondary" onClick={() => navigate('/inventory?status=low')}>View items</Button>}
//   >
//     5 products are running low.
//   </Banner>
//
// Success message after a sale (Newton). Use the exact text from the design and no label:
//   <Banner variant="success">Sale recorded. Stock updated.</Banner>
//
// variant: 'info' (default) | 'warning' | 'success' | 'danger'

export default function Banner({
  variant = 'info',
  label,
  action,
  children,
  className = '',
}) {
  const role = variant === 'danger' ? 'alert' : 'status';

  return (
    <div className={`banner banner--${variant} ${className}`.trim()} role={role}>
      <div className="banner__content">
        {label && <strong className="banner__label">{label}:</strong>}
        <span>{children}</span>
      </div>
      {action && <div className="banner__action">{action}</div>}
    </div>
  );
}
