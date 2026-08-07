import './App.css';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList.jsx';
import { useState } from 'react';

function App() {

  const [todoList, SetTodoList] = useState([]);

  function addTodo(todoTitle){
      let todo = [{id: Date.now(), title: todoTitle, isCompleted: false}]

      return SetTodoList( todoList =>[...todo, ...todoList]);
  }

  function completeTodo(id){
    let newtoDo = {...todo, isCompleted: true};
    let checkIDs = (id == SetTodoList.id) ? newtoDo : {...todo, isCompleted: false}

    let checkCondition = SetTodoList.map(checkIDs)

    SetTodoList(todoList => [...todoList, checkCondition]);
  }

  return (
    <div>
      <h1>My Todo List</h1>
      <TodoList todoList={todoList} 
        onCompleteTodo={completeTodo}
      />
      <TodoForm onAddTodo={addTodo} />
    </div>
  );
}

export default App;
