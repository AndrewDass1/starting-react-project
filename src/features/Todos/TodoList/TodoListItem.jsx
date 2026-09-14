import { useState, useEffect } from 'react';
import TextInputWithLabel from '../../../shared/TextInputWithLabel.jsx';
import { isValidTodoTitle } from '../../../utils/todoValidation.js';

import button from '../../../button.module.css';
import todolistitem from '../../../todolistitem.module.css';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  useEffect(() => {
    setWorkingTitle(todo.title);
  }, [todo.title]);

  function handleCancel() {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  }

  function handleEdit(event) {
    setWorkingTitle(event.target.value);
  }

  function handleUpdate(event) {
    event.preventDefault();
    if (!isEditing) return;
    if (!isValidTodoTitle(workingTitle)) return;

    onUpdateTodo(todo.id, workingTitle);
    setIsEditing(false);
  }

  return (
    <li>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel
              value={workingTitle}
              elementId={`todo-${todo.id}`}
              labelText="Todo"
              onChange={handleEdit}
            />

            <button type="button" onClick={handleCancel} className={button.button}>
              CANCEL
            </button>

            <button type="submit" disabled={!isValidTodoTitle(workingTitle)} className={button.button}>
              UPDATE
            </button>
          </>
        ) : (
          <>
            <input
              type="checkbox" 
              className={todolistitem.checkmark}
              id={`checkbox${todo.id}`}
              checked={todo.isCompleted}
              onChange={() => onCompleteTodo(todo.id)}
            />

            <button type="button" onClick={() => setIsEditing(true)} className={button.button}>
              {todo.title}
            </button>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;