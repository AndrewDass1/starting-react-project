export default function TodoList({
  todoList,
  dataVersion,
  statusFilter,
  onAddTodo,
  onUpdateTodo,
  onCompleteTodo,
}) {
  const filteredTodos = todoList.filter((todo) => {
    if (statusFilter === 'active') return !todo.isCompleted;
    if (statusFilter === 'completed') return todo.isCompleted;
    return true;
  });

  if (filteredTodos.length === 0) {
    if (statusFilter === 'active') return <p>No active todos.</p>;
    if (statusFilter === 'completed') return <p>No completed todos.</p>;
    return <p>No todos yet.</p>;
  }

  return (
    <ul>
      {filteredTodos.map((todo) => (
        <li key={`${dataVersion}-${todo.id}`}>
          {todo.title}
        </li>
      ))}
    </ul>
  );
}


