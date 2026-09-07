import { useMemo, useState } from 'react';

export default function TodoList({
  todoList,
  dataVersion,
  statusFilter,
  onUpdateTodo,
  onCompleteTodo,
}) {
  const [editingId, setEditingId] = useState(null);
  const [workingTitle, setWorkingTitle] = useState('');

  const filteredTodos = useMemo(() => {
    return todoList.filter((todo) => {
      if (statusFilter === 'active') return !todo.isCompleted;
      if (statusFilter === 'completed') return todo.isCompleted;
      return true;
    });
  }, [todoList, statusFilter]);

  if (filteredTodos.length === 0) {
    if (statusFilter === 'active') {
      return <p>You have no active todos. Nice work!</p>;
    }
    if (statusFilter === 'completed') {
      return <p>No todos have been completed yet.</p>;
    }
    return <p>You don’t have any todos yet. Add one to get started.</p>;
  }

  function startEditing(todo) {
    setEditingId(todo.id);
    setWorkingTitle(todo.title);
  }

  function cancelEditing() {
    setEditingId(null);
    setWorkingTitle('');
  }

  function saveUpdate(todo) {
    const updated = { ...todo, title: workingTitle };
    onUpdateTodo(updated);
    setEditingId(null);
  }

  return (
    <ul>
      {filteredTodos.map((todo) => (
        <li key={`${dataVersion}-${todo.id}`}>
          <label>
            <input
              type="checkbox"
              checked={todo.isCompleted}
              onChange={() => onCompleteTodo(todo.id)}
            />
          </label>

          {editingId === todo.id ? (
            <>
              <input
                type="text"
                value={workingTitle}
                onChange={(e) => setWorkingTitle(e.target.value)}
              />
              <button onClick={() => saveUpdate(todo)}>Save</button>
              <button onClick={cancelEditing}>Cancel</button>
            </>
          ) : (
            <>
              <span>{todo.title}</span>
              <button onClick={() => startEditing(todo)}>Edit</button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}