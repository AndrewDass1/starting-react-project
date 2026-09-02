/*
  MENTOR — TodoForm.jsx

  What we are trying to do
  ------------------------
  A small form that collects a title and tells the PARENT "please add this."
  This component does not know about the API or the list. That is good.
  One job: controlled input + submit.

  React basics
  ------------
  CONTROLLED COMPONENT:
    - state holds the text (workingTodoTitle)
    - the input's value={workingTodoTitle}
    - onChange writes back with setWorkingTodoTitle(event.target.value)

  That loop is how React forms work. If you skip value={...}, the input
  has a secret life the component cannot see (uncontrolled).

  useRef: a sticky note on a real DOM node. After a successful add you
  call inputRef.current.focus() so the user can type the next todo.
  That is a good use of a ref (talking to the browser, not storing app data).
  App data belongs in useState.

  What you did well
  -----------------
  preventDefault, validation before add, clear the field, focus again,
  disable the button when the title is empty. That is Lesson 4–5 done right.

  What to correct
  ---------------
  1. Combine imports:
       import { useRef, useState } from 'react';
  2. Delete the commented-out lines. They are the OLD uncontrolled version
     (reading event.target.todoTitle). You moved to state — keep only that.
  3. TextInputWithLabel has no children. Use a self-closing tag:
       <TextInputWithLabel ... />
     Empty opening/closing tags add noise.

  Mental model: on submit, this form calls onAddTodo(title). TodosPage
  is the one that updates the list and talks to /api/tasks. Stay in your lane.
*/

import { useRef } from 'react';

import { useState } from 'react'; // MENTOR: merge with the useRef import above.

import TextInputWithLabel from '../../shared/TextInputWithLabel';

import { isValidTodoTitle } from '../../utils/todoValidation';

function TodoForm({ onAddTodo }) {
  const inputRef = useRef();

  const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  const handleAddTodo = (event) => {
    event.preventDefault();

    // const todoTitle = event.target.todoTitle.value.trim();
    // MENTOR: delete the three commented lines. This is leftover from before
    // the input was controlled. Git still has the old version if you need it.
    if (workingTodoTitle && isValidTodoTitle(workingTodoTitle)) {
      onAddTodo(workingTodoTitle);
      //onAddTodo(isValidTodoTitle);
      // event.target.reset();
      setWorkingTodoTitle('');
      inputRef.current.focus();
    }
  };

  return (
    <form onSubmit={handleAddTodo}>
      {/* MENTOR: this is a controlled input. value comes FROM state,
          onChange writes TO state. That is the pattern to memorize. */}
      <TextInputWithLabel
        ref={inputRef}
        value={workingTodoTitle} 
        onChange={(event)=>setWorkingTodoTitle(event.target.value)}
        elementId="todoTitle"
        labelText="Todo"
      >      

      </TextInputWithLabel>
      
      <button type="submit" disabled={!isValidTodoTitle(workingTodoTitle)}>
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;
