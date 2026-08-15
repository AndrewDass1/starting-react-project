import { useState } from 'react';

import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';

import { isValidTodoTitle } from '../../utils/todoValidation.js';

function TodoListItem({todo, onCompleteTodo, onUpdateTodo}) {
    const [isEditing, setIsEditing] = useState(false);

    const [workingTitle, setWorkingTitle] = useState(todo.title);

    function handleCancel() {
        setWorkingTitle(todo.title);
        setIsEditing(false);
    }

    // fix needed - 
    function handleEdit() {
        setWorkingTitle( event => event.target.value);
    }

    // Fix handleUpdate - needs validation helper
    function handleUpdate(event) {
        if (isEditing == true) {
            return ( 
                event.preventDefault(),
                onUpdateTodo( (todo) => [...todo, isValidTodoTitle(workingTitle)]),  
                setIsEditing(false) 
            )  
        }  
    }

    return (
        <li>
            <form onSubmit={handleUpdate}>
                {isEditing ? (
                    <>
                        <TextInputWithLabel value={workingTitle} onChange={handleEdit}/>
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