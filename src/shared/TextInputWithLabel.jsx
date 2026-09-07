import { forwardRef } from 'react';

const TextInputWithLabel = forwardRef(function TextInputWithLabel(
  { value, onChange, elementId, labelText },
  ref
) {
  return (
    <div>
      <label htmlFor={elementId}>{labelText}:</label>
      <input
        id={elementId}
        type="text"
        value={value}
        onChange={onChange}
        ref={ref}
      />
    </div>
  );
});

export default TextInputWithLabel;

