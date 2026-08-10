import { useState } from 'react';

function TodoListItem({todo}) {
    const [onCompleteTodo, setOnCompleteTodo] = useState('');

    return <li>
        <input 
            type="checkbox"
            checked={todo.isCompleted}
            onChange={() => setOnCompleteTodo(todo.id)}
        />
        {todo.title} 
    </li>;
}

export default TodoListItem;

// need completion handler function instead of todo.id