/*
  MENTOR — TodoListItem.jsx

  What we are trying to do
  ------------------------
  One row in the list. Two modes:
  - Viewing: checkbox to complete + title on screen
  - Editing: text field + Cancel + Update

  isEditing is a piece of LOCAL state. The parent does not need to know
  whether this row is in edit mode. That is a good reason to keep state
  in the child.

  React basics
  ------------
  CONTROLLED INPUT: value={workingTitle} plus onChange that calls
  setWorkingTitle. The screen always shows state. You did this right.

  event.preventDefault() on the form stops the browser from reloading
  the page on submit. Always do that in React forms.

  What you did well
  -----------------
  Cancel restores the old title. Update is disabled when the title is
  blank. You call onUpdateTodo(todo.id, workingTitle) so the PARENT
  talks to the API. The item itself does not fetch. Correct split.

  What to correct
  ---------------
  1. useState(todo.title) uses the title ONLY the first time this row
     appears. If the parent later replaces this todo (server response),
     workingTitle can stay stale.

     Simple fix while you are not editing:

       import { useState, useEffect } from 'react';
       useEffect(() => {
         setWorkingTitle(todo.title);
       }, [todo.title]);

     Or: when isEditing is false, just show todo.title and do not keep
     a copy until the user clicks Edit.

  2. The checkbox sits in a <label> with no text. The title is a sibling
     <span>. Screen readers mostly hear an unlabeled checkbox.
     Either put the title INSIDE the label (if clicking the title should
     complete the todo) OR keep click-to-edit and give the checkbox its
     own visible name, like "Done."

  3. <span onClick={...}> only works with a mouse. Keyboard users cannot
     start editing. Use a <button type="button"> for the title, or add
     a real "Edit" button. Same idea, accessible.

  Practice: say out loud what happens when the user clicks Update.
  (This component → onUpdateTodo → TodosPage.updateTodo → PATCH → state.)
  If you can say that chain, you understand props as callbacks.
*/

import { useState } from 'react';

import TextInputWithLabel from '../../../shared/TextInputWithLabel.jsx';

import { isValidTodoTitle } from '../../../utils/todoValidation.js';

function TodoListItem({todo, onCompleteTodo, onUpdateTodo}) {
    const [isEditing, setIsEditing] = useState(false);

    // MENTOR: this starting value is "frozen" after first render. See note 1 above.
    const [workingTitle, setWorkingTitle] = useState(todo.title);

    function handleCancel() {
        setWorkingTitle(todo.title);
        setIsEditing(false);
    }

    function handleEdit(event) {
        setWorkingTitle(event.target.value);
    }

    function handleUpdate(event) {
        event.preventDefault(); // MENTOR: stops a full page reload. Keep this.
        if(!isEditing) return;

        if(!isValidTodoTitle(workingTitle)) return;

        onUpdateTodo(todo.id, workingTitle); // MENTOR: talk UP to the parent. Do not fetch here.
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
                        {/* MENTOR: unlabeled checkbox — see note 2 at top of file. */}
                        <label>
                            <input
                                type="checkbox"
                                id={`checkbox${todo.id}`}
                                checked={todo.isCompleted}
                                onChange={() => onCompleteTodo(todo.id)}
                            />
                        </label>
                        {/* MENTOR: click-to-edit is fine for a mouse; use a button for keyboard users. */}
                        <span onClick={() => setIsEditing(true)}>{todo.title}</span>
                    </>
                )}
            </form>
        </li>
    )
}

export default TodoListItem;
