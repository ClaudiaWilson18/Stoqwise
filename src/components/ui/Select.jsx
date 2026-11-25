// Select: dropdown that looks and behaves like Input (label above, hint below, error).
// `options` is an array of strings, or of { value, label } objects.
//
//   <Select
//     label="Category"
//     value={category}
//     onChange={(e) => setCategory(e.target.value)}
//     options={['All', 'Drinks', 'Snacks']}
//   />

import { useId } from 'react';

export default function Select({
  label,
  options = [],
  hint,
  error = '',
  required = false,
  id,
  className = '',
  ...rest
}) {
  const autoId = useId();
  const selectId = id || autoId;
  const hintId = `${selectId}-hint`;
  const errorId = `${selectId}-error`;

  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`field ${error ? 'field--error' : ''} ${className}`.trim()}>
      <label className="field__label" htmlFor={selectId}>
        {label}
        {required && (
          <span className="field__required" aria-hidden="true">
            {' '}*
          </span>
        )}
      </label>
      <select
        id={selectId}
        className="field__control"
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        {...rest}
      >
        {options.map((opt) => {
          const value = typeof opt === 'string' ? opt : opt.value;
          const text = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={value} value={value}>
              {text}
            </option>
          );
        })}
      </select>
      {hint && (
        <span id={hintId} className="field__hint">
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className="field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
