import { useState } from 'react';
import TextInputWithLabel from '../../../shared/TextInputWithLabel.jsx';
import { isValidTodoTitle } from '../../../utils/todoValidation.js';

export default function TodoListItem({
  todo,
  onUpdateTodo,
  onCompleteTodo,
  onUncompleteTodo,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [errorMessage, setErrorMessage] = useState('');

  const smallButtonStyle = {
    marginLeft: '0.5rem',
    padding: '0.15rem 0.35rem',
    fontSize: '0.75rem',
    cursor: 'pointer',
  };

  function handleStartEdit() {
    setIsEditing(true);
    setTitle(todo.title);
    setErrorMessage('');
  }

  function handleChange(e) {
    const newTitle = e.target.value;
    setTitle(newTitle);

    const { valid, error } = isValidTodoTitle(newTitle);
    setErrorMessage(valid ? '' : error);
  }

  async function handleSave() {
    const { valid, error } = isValidTodoTitle(title);
    if (!valid) {
      setErrorMessage(error);
      return;
    }

    await onUpdateTodo(todo.id, title.trim());
    setIsEditing(false);
  }

  function handleCancel() {
    setIsEditing(false);
    setTitle(todo.title);
    setErrorMessage('');
  }

  function handleCheckbox(e) {
    if (e.target.checked) {
      onCompleteTodo(todo.id);
    } else {
      onUncompleteTodo(todo.id);
    }
  }

  const { valid } = isValidTodoTitle(title);
  const isSaveDisabled = !valid;

  return (
    <li style={{ marginBottom: '0.75rem' }}>
      {isEditing ? (
        <>
          <TextInputWithLabel
            value={title}
            onChange={handleChange}
            elementId={`todo-${todo.id}`}
            labelText="TITLE"
            required={true}
            maxLength={50}
            errorMessage={errorMessage}
          />

          <button onClick={handleSave} disabled={isSaveDisabled} style={smallButtonStyle}>
            SAVE
          </button>

          <button onClick={handleCancel} style={smallButtonStyle}>CANCEL</button>
        </>
      ) : (
        <>
          <input
            type="checkbox"
            checked={todo.isCompleted}
            onChange={handleCheckbox}
            style={{ marginRight: '0.5rem' }}
          />

          <span style={{ marginRight: '1rem' }}>
            {todo.title}
          </span>

          <button onClick={handleStartEdit} style={smallButtonStyle}>EDIT</button>
        </>
      )}
    </li>
  );
}