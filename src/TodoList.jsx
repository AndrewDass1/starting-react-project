import TodoListItem from './TodoListItem.jsx';

import { useState } from 'react';

function TodoList({todoList}) {

    let statement = todoList.length == 0 ? "Add todo above to get started" : <ul> {todoList.map( (todo) => <TodoListItem key={todo.id} todo={todo}/> ) } </ul> 

    // const [onCompleteTodo, setonCompleteTodo] = useState(onCompleteTodo);

    return statement;
}

export default TodoList;