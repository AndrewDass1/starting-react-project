import TodoListItem from './TodoListItem.jsx';

import { useState } from 'react';


function TodoList({todoList}) {

    // const [filteredTodoList, setFilteredTodoList] = useState([]);
    let filteredTodoList = [...todoList];

    let checkIfTrue = todoList.length > 0 && todoList[0].isCompleted == true ? (todo) => setFilteredTodoList([...filteredTodoList, todo]) : '';

    // console.log(filteredTodoList)

    // console.log(filteredTodoList[0])

    let statement = todoList.length == 0 ? "Add todo above to get started" : <ul> {todoList.map( (todo) => <TodoListItem key={todo.id} todo={todo} onCompleteTodo={todo.id}/> ) } </ul> 

    return statement;
}


export default TodoList;