import { useState } from 'react';

import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';

function TodoListItem({todo, onCompleteTodo, updateTodo}) {
    const [isEditing, setIsEditing] = useState(false);

    function handleUpdate(event) {
        event.preventDefault;

        
    }

    return (
        <li>
            <form onSubmit={handleUpdate}>
                {isEditing ? (
                    <TextInputWithLabel value={todo.title}/>
                ) : (
                    <>
                        <label>
                            <input
                                type="checkbox"
                                id={`checkbox${todo.id}`}
                                checked={todo.isCompleted}
                                onChange={() => onCompleteTodo(todo.id)}
                            />
                        </label>
                        <span onClick={() => setIsEditing(true)}>{todo.title}</span>

                        <button text="Update" onClick={handleUpdate}>  </button>
                    </>
                )}
            </form>
        </li>
    )
}

export default TodoListItem;