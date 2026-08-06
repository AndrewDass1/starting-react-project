import './App.css';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList.jsx';
import { useState } from 'react';

function App() {

  const [todoList, SetTodoList] = useState([]);

  function addTodo(todoTitle){
      let todo = [{id: Date.now(), title: todoTitle}]

      return SetTodoList( todoList =>[...todo, ...todoList]);
  }

  return (
    <div>
      <h1>My Todo List</h1>
      <TodoList todoList={todoList} />
      <TodoForm onAddTodo={addTodo} />
    </div>
  );
}

export default App;