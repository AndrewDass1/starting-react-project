import { useState } from 'react';

function TodoListItem({todo}) {

    // return ( <ul> {todoListItem.map(todo => {todo.title})} </ul>);

    return <li> { todo.title } </li>;
}

export default TodoListItem;