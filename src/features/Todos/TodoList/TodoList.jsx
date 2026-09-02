import { useMemo } from 'react';
import TodoListItem from './TodoListItem.jsx';

function TodoList({todoList, onCompleteTodo, onUpdateTodo}) {
    
       const filteredTodoList = useMemo(() => {
         return todoList.filter((todo) => todo.isCompleted === false);
       }, [todoList]);

      return (
        <ul>
          {filteredTodoList.map((todo) => (
            <TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo} onUpdateTodo={onUpdateTodo}/>
          ))}
        </ul>
      );

}

export default TodoList;
