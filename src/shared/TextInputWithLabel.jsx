/*
  MENTOR — TextInputWithLabel.jsx

  What we are trying to do
  ------------------------
  One reusable labeled text box so TodoForm and TodoListItem do not
  copy-paste the same <label> + <input> markup.

  React basics — reusable components
  ----------------------------------
  The parent decides:
    - elementId  (must be unique on the page)
    - labelText
    - value / onChange  (controlled)
    - ref  (optional, so TodoForm can .focus() after add)

  This child does not own the text. It is a "dumb" display + input.
  That is what reusable means: the same UI, different data via props.

  htmlFor={elementId} and id={elementId} must match. That is how the
  browser knows which box the label belongs to. You did that.

  About `ref` as a prop
  ---------------------
  You are on React 19, so listing `ref` in the function arguments works.
  In older React you needed forwardRef. You do not need that here.

  Tiny cleanup: keep the <input> attributes indented the same way, and
  you can self-close it (you already did). This file is in good shape.
*/

function TextInputWithLabel({elementId, labelText, onChange, ref, value})
{
    return (
        <>
            <label htmlFor={elementId}>{labelText}</label>
            
            <input
            type="text"
            id={elementId}
            ref={ref}
            value={value}
            onChange={onChange}
            />
        </>
    );
}

export default TextInputWithLabel;
