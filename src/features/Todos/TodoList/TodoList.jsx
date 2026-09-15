import { useMemo } from 'react';

export default function TodoList({
  todoList,
  dataVersion,
  statusFilter,
  sortBy,
  sortDirection,
  filterTerm,
  onUpdateTodo,
  onCompleteTodo,
}) {
  const filteredAndSortedTodos = useMemo(() => {
    const safeList = Array.isArray(todoList) ? todoList : [];

    const byStatus = safeList.filter((t) => {
      if (statusFilter === 'active') return !t.isCompleted;
      if (statusFilter === 'completed') return t.isCompleted;
      return true;
    });

    const byFilterTerm = byStatus.filter((t) => {
      if (!filterTerm.trim()) return true;
      return t.title.toLowerCase().includes(filterTerm.toLowerCase());
    });

    const sorted = [...byFilterTerm].sort((a, b) => {
      if (sortBy === 'createdAt') {
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();
        return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
      }

      if (sortBy === 'title') {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        if (aTitle < bTitle) return sortDirection === 'asc' ? -1 : 1;
        if (aTitle > bTitle) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      }

      return 0;
    });

    return sorted;
  }, [todoList, statusFilter, sortBy, sortDirection, filterTerm]);

  if (!filteredAndSortedTodos.length) {
    return <p>No todos found.</p>;
  }

  return (
    <ul>
      {filteredAndSortedTodos.map((todo) => (
        <li key={`${todo.id}-${dataVersion}`}>
          <span>
            {todo.title} {todo.isCompleted ? '(completed)' : ''}
          </span>
          {!todo.isCompleted && (
            <button onClick={() => onCompleteTodo(todo.id)}>Complete</button>
          )}
          <button
            onClick={() =>
              onUpdateTodo(todo.id, prompt('Update title', todo.title) || todo.title)
            }
          >
            Edit
          </button>
        </li>
      ))}
    </ul>
  );
}