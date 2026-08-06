import { useState } from 'react';

function TodoListItem({todo}) {
    return <li> { todo.title } </li>;
}

export default TodoListItem;