// src/features/Todos/TodoList/TodoList.jsx
import { useMemo } from 'react';

export default function TodoList({
  todoList,
  dataVersion,
  statusFilter,
  onUpdateTodo,
  onCompleteTodo,
}) {
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

  return (
    <ul>
      {filteredTodos.map((todo) => (
        <li key={`${dataVersion}-${todo.id}`}>
          {todo.title}
          {/* hook up onUpdateTodo/onCompleteTodo here */}
        </li>
      ))}
    </ul>
  );
}