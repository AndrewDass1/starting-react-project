import { useState } from 'react';

import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';

function TodoListItem({todo, onCompleteTodo, onUpdateTodo}) {
    const [isEditing, setIsEditing] = useState(false);

    function handleCancel() {
    setWorkingTitle((todo) => isValidTodoTitle);
    // Fix setIsEditing
    // setIsEditing(false);
    }

    function handleEdit(event) {
        setWorkingTodoTitle(event.target.value);
    }

    function handleUpdate(event) {
        return (isEditing ? ( 
            event.preventDefault(),
            onUpdateTodo( (todo) => [...todo, todo.title]),  
            setIsEditing(false) ) 
            : ''
        )
    }

    return (
        <li>
            <form onSubmit={handleUpdate}>
                {isEditing ? (
                    <>
                        <TextInputWithLabel value={todo.title}/>
                        <button onClick={handleCancel}> Cancel </button>
                        <button onClick={handleUpdate}> Update </button>
                    </>
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
                    </>
                )}
            </form>
        </li>
    )
}

export default TodoListItem;