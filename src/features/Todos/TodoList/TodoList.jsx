import { useMemo } from 'react';
import TodoListItem from './TodoListItem.jsx';

export default function TodoList({
  todoList,
  dataVersion,
  statusFilter,
  sortBy,
  sortDirection,
  filterTerm,
  onUpdateTodo,
  onCompleteTodo,
  onUncompleteTodo,
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
    <ul style={{ paddingLeft: 0 }}>
      {filteredAndSortedTodos.map((todo) => (
        <TodoListItem
          key={`${todo.id}-${dataVersion}`}
          todo={todo}
          onUpdateTodo={onUpdateTodo}
          onCompleteTodo={onCompleteTodo}
          onUncompleteTodo={onUncompleteTodo}
        />
      ))}
    </ul>
  );
}