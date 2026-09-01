/*
  MENTOR — TodoList.jsx

  What we are trying to do
  ------------------------
  This component does not fetch. It does not add. It only:
  1. Hide completed todos (for now, the app shows the "still to do" list).
  2. If the list is empty, show a starting message.
  3. If not, turn each todo into a <TodoListItem />.

  React basics
  ------------
  LISTS: when you .map() to components, each one needs a key.
    <TodoListItem key={todo.id} ... />
  The key is React's nametag: "this is the same todo as last render."
  Use the real id from the server. Do not use the array index.

  useMemo: "remember this CALCULATED VALUE until its inputs change."
  useCallback: "remember this FUNCTION until its inputs change."
  They are not decorations. Use them when you have a real value/function
  to keep stable. For this lesson, filtering the list is the value.

  What to correct
  ---------------
  1. Memoize the FILTERED ARRAY, not an object like { version, todos }.
     The extra `version` field does not change what appears on screen.
     TodoList only needs to render todos.

     Goal shape:

       const filteredTodoList = useMemo(() => {
         return todoList.filter((todo) => todo.isCompleted === false);
       }, [todoList]);

     Then use filteredTodoList.length and filteredTodoList.map(...).

     Put dataVersion in the dependency array ONLY if changing version
     must recompute even when todoList is the same. Usually todoList
     already changed, so [todoList] is enough.

  2. Use === not ==. Strict equal. == can hide bugs
     (0 == false is true; 0 === false is not).

  3. Delete the commented-out filter line. Git already saved history.
     The file should tell the current story only.

  4. Break the return onto several lines so you can see the ternary,
     the <ul>, and the .map(). One long line is hard to debug.

  After this file is simplified, you will see: "filter → empty message
  or list of items." That is the whole job.
*/

import { useMemo } from 'react';
import TodoListItem from './TodoListItem.jsx';

function TodoList({todoList, onCompleteTodo, onUpdateTodo, dataVersion}) {
    
    // const filteredTodoList = todoList.filter((todo) => todo.isCompleted == false);

    // MENTOR: you used useMemo (good for the lesson) but wrapped the wrong shape.
    // Remember the array you will render. You do not need { version, todos }.
    // Also switch == to ===.
    const filteredTodoList = useMemo(() => {
        return {            
            version: dataVersion, // MENTOR: unused for display — see notes at top of file.
            todos: todoList.filter((todo) => todo.isCompleted == false)
        };
    }, [todoList, dataVersion])

    // MENTOR: this works, but it is one long line. Rewrite as:
    //   if (filteredTodoList.length === 0) return <p>Add todo above...</p>;
    //   return (
    //     <ul>
    //       {filteredTodoList.map((todo) => (
    //         <TodoListItem key={todo.id} todo={todo} ... />
    //       ))}
    //     </ul>
    //   );
    // key={todo.id} is already correct. Keep that.
    return (filteredTodoList.todos.length == 0 ? (<p>Add todo above to get started</p>) : <ul> {filteredTodoList.todos.map( (todo) => (<TodoListItem key={todo.id} todo={todo} onCompleteTodo={onCompleteTodo} onUpdateTodo={onUpdateTodo}/> )) } </ul> );
}

export default TodoList;
