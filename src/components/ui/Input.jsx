// Input: label above, hint below, red error message under the field.
// Pass the error text from Rooney's validators in `error`. An empty string means no error.
//
//   <Input
//     label="Price"
//     type="number"
//     value={price}
//     onChange={(e) => setPrice(e.target.value)}
//     hint="Price in GHS"
//     error={errors.price}
//   />

import { useId } from 'react';

export default function Input({
  label,
  hint,
  error = '',
  required = false,
  id,
  className = '',
  ...rest
}) {
  const autoId = useId();
  const inputId = id || autoId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`field ${error ? 'field--error' : ''} ${className}`.trim()}>
      <label className="field__label" htmlFor={inputId}>
        {label}
        {required && (
          <span className="field__required" aria-hidden="true">
            {' '}*
          </span>
        )}
      </label>
      <input
        id={inputId}
        className="field__control"
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        {...rest}
      />
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
