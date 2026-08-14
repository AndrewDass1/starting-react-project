import { useRef } from 'react';

import { useState } from 'react';

import TextInputWithLabel from '../shared/TextInputWithLabel';

import { isValidTodoTitle } from '../utils/todoValidation';

function TodoForm({ onAddTodo }) {
  const inputRef = useRef();

  const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  const handleAddTodo = (event) => {
    event.preventDefault();

    // const todoTitle = event.target.todoTitle.value.trim();
    if (workingTodoTitle && workingTodoTitle !== "") {
      onAddTodo(workingTodoTitle);
      // event.target.reset();
      setWorkingTodoTitle('');
      inputRef.current.focus();
    }
  };

  return (
    <form onSubmit={handleAddTodo}>
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