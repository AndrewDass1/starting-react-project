import { useState } from 'react';

function TodoListItem({todo}) {

    // const [todo, Settodo] = useState(todo);

    // return ( <ul> {todoListItem.map(todo => {todo.title})} </ul>);

    return <li> { todo.title } </li>;
}

export default TodoListItem;