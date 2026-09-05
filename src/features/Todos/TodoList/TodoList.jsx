// features/Todos/TodoList/TodoList.jsx
import { useMemo } from 'react';
import TodoListItem from './TodoListItem.jsx';

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, dataVersion }) {
  const activeTodos = useMemo(() => {
    return todoList.filter((todo) => !todo.isCompleted);
  }, [todoList, dataVersion]);

  if (activeTodos.length === 0) {
    return <p>Add todo above to get started</p>;
  }

  return (
    <ul>
      {activeTodos.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;


