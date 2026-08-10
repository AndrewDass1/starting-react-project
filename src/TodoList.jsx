import TodoListItem from './TodoListItem.jsx';

import { useState } from 'react';

function TodoList({todoList, completeTodo}) {


    console.log(todoList[0])

    console.log(todoList.length);

    let filteredTodoList;

    // let todoListExists = todoList.length > 0 ? (filteredTodoList = todoList.filter(todoList[0].isCompleted = true)) : '';
    
    // console.log(todoList[0].isCompleted)

    let statement = todoList.length == 0 ? "Add todo above to get started" : <ul> {todoList.map( (todo) => <TodoListItem key={todo.id} todo={todo} onCompleteTodo={completeTodo}/> ) } </ul> 



    return statement;
}

export default TodoList;