// Button: primary, secondary or danger. Always 44 px tall.
// Pass a lucide-react icon as `icon`; the text label is always shown beside it.
//
//   import { Plus } from 'lucide-react';
//   <Button icon={Plus}>Add product</Button>
//   <Button variant="danger" onClick={handleDelete}>Delete</Button>

export default function Button({
  variant = 'primary',
  type = 'button',
  icon: Icon,
  block = false,
  className = '',
  children,
  ...rest
}) {
  const classes = ['btn', `btn--${variant}`, block ? 'btn--block' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} {...rest}>
      {Icon && <Icon size={18} aria-hidden="true" />}
      <span>{children}</span>
    </button>
  );
}
