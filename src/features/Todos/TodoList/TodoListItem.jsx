import { useState } from 'react';
import TextInputWithLabel from '../../../shared/TextInputWithLabel.jsx';
import { isValidTodoTitle } from '../../../utils/todoValidation.js';
import { sanitizeText } from '../../../utils/sanitize.js';
import styles from '../../../todolistitem.module.css';

export default function TodoListItem({
  todo,
  onUpdateTodo,
  onCompleteTodo,
  onUncompleteTodo,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [errorMessage, setErrorMessage] = useState('');


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

    await onUpdateTodo(todo.id, sanitizeText(title.trim()));
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
    <li className={styles.item}>
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

          <button onClick={handleSave} disabled={isSaveDisabled} className={styles.smallButton}>
            SAVE
          </button>

          <button onClick={handleCancel} className=".">CANCEL</button>
        </>
      ) : (
        <>
          <input
            type="checkbox"
            checked={todo.isCompleted}
            onChange={handleCheckbox}
            className={styles.checkBox}
          />

          <span className={styles.title}>
            {todo.title}
          </span>

          <button onClick={handleStartEdit} className={styles.smallButton}>EDIT</button>
        </>
      )}
    </li>
  );
}