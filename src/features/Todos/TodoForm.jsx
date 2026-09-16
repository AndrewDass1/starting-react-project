import { useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';
import { isValidTodoTitle } from '../../utils/todoValidation.js';

export default function TodoForm({ onAddTodo }) {
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function handleChange(e) {
    const newTitle = e.target.value;
    setTitle(newTitle);

    const { valid, error } = isValidTodoTitle(newTitle);
    setErrorMessage(valid ? '' : error);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { valid, error } = isValidTodoTitle(title);
    if (!valid) {
      setErrorMessage(error);
      return;
    }

    await onAddTodo(title.trim());
    setTitle('');
    setErrorMessage('');
  }

  const { valid } = isValidTodoTitle(title);
  const isDisabled = !valid;

  return (
    <form onSubmit={handleSubmit}>
      <TextInputWithLabel
        value={title}
        onChange={handleChange}
        elementId="newTodoTitle"
        labelText="NEW TODO"
        required={true}
        maxLength={50}
        errorMessage={errorMessage}
        placeholder="Enter a todo title..."
      />
      <button type="submit" disabled={isDisabled}>
        ADD TODO
      </button>
    </form>
  );
}