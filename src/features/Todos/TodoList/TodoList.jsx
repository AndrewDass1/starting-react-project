export default function TodoList({
  todoList,
  dataVersion,
  statusFilter,
  onUpdateTodo,
  onCompleteTodo,
}) {
  const filtered = todoList.filter((todo) => {
    if (statusFilter === 'active') return !todo.isCompleted;
    if (statusFilter === 'completed') return todo.isCompleted;
    return true;
  });

  if (filtered.length === 0) {
    if (statusFilter === 'active') {
      return <p>You have no active tasks. Nice!</p>;
    }
    if (statusFilter === 'completed') {
      return <p>No tasks have been completed yet.</p>;
    }
    return <p>You don’t have any tasks yet. Add one to get started.</p>;
  }

  return (
    <ul>
      {filtered.map((todo) => (
        <li key={`${dataVersion}-${todo.id}`}>
          {todo.title}
          {/* hook up onUpdateTodo/onCompleteTodo to buttons/checkboxes here */}
        </li>
      ))}
    </ul>
  );
}