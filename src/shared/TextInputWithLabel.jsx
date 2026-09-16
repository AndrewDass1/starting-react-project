import { forwardRef } from 'react';

const TextInputWithLabel = forwardRef(function TextInputWithLabel(
  {
    value,
    onChange,
    elementId,
    labelText,
    type = 'text',
    maxLength = 50,
    required = false,
    errorMessage = '',
    placeholder = '',
  },
  ref
) {
  return (
    <div>
      <label htmlFor={elementId}>
        {labelText}:
      </label>
      <input
        id={elementId}
        type={type}
        value={value}
        onChange={onChange}
        ref={ref}
        maxLength={maxLength}
        required={required}
        placeholder={placeholder}
      />
      {errorMessage && (
        <p style={{ color: 'red', marginTop: '0.25rem' }}>{errorMessage}</p>
      )}
    </div>
  );
});

export default TextInputWithLabel;

