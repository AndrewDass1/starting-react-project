import { useMemo } from 'react';
import TodoListItem from './TodoListItem.jsx';

export default function TodoList({
  todoList,
  dataVersion,
  statusFilter,
  filterTerm,
  sortBy,
  sortDirection,
  onUpdateTodo,
  onCompleteTodo,
}) {
  const safeList = Array.isArray(todoList) ? todoList : [];

  const filteredTodos = useMemo(() => {
    let list = [...safeList];

    if (statusFilter === 'active') {
      list = list.filter((todo) => !todo.isCompleted);
    } else if (statusFilter === 'completed') {
      list = list.filter((todo) => todo.isCompleted);
    }

    if (filterTerm && filterTerm.trim() !== '') {
      const term = filterTerm.toLowerCase();
      list = list.filter((todo) =>
        todo.title.toLowerCase().includes(term)
      );
    }

    list.sort((a, b) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];

      if (sortBy === 'createdAt') {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }

      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [safeList, statusFilter, filterTerm, sortBy, sortDirection]);

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
        <TodoListItem
          key={`${dataVersion}-${todo.id}`}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </ul>
  );
}