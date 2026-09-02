import { useState, useEffect } from 'react';

import TextInputWithLabel from '../../../shared/TextInputWithLabel.jsx';

import { isValidTodoTitle } from '../../../utils/todoValidation.js';

function TodoListItem({todo, onCompleteTodo, onUpdateTodo}) {
    const [isEditing, setIsEditing] = useState(false);

    const [workingTitle, setWorkingTitle] = useState(todo.title);

    function handleCancel() {
        useEffect(() => {
         setWorkingTitle(todo.title);
       }, [todo.title]);
       
        setIsEditing(false);
    }

    function handleEdit(event) {
        setWorkingTitle(event.target.value);
    }

    function handleUpdate(event) {
        event.preventDefault();
        if(!isEditing) return;

        if(!isValidTodoTitle(workingTitle)) return;

        onUpdateTodo(todo.id, workingTitle);
        setIsEditing(false);
    }

    return (
        <li>
            <form onSubmit={handleUpdate}>
                {isEditing ? (
                    <>
                        <TextInputWithLabel value={workingTitle} elementId={`todo-${todo.id}`} labelText="Todo" onChange={handleEdit}/>
                        <button type="button" onClick={handleCancel}> Cancel </button>
                        <button type="submit" disabled={!isValidTodoTitle(workingTitle)}> Update </button>
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
                        <button onClick={() => setIsEditing(true)}>{todo.title}</button>
                    </>
                )}
            </form>
        </li>
    )
}

export default TodoListItem;
