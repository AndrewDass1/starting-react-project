import './App.css';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList.jsx';
import { useState } from 'react';

const todos = [
    {id: 1, title: "review resources"},
    {id: 2, title: "take notes"},
    {id: 3, title: "code out app"},
  ]

function App() {

  const [todoList, SetTodoList] = useState(todos);
  // const [todoList, SetTodoList] = useState(todos.todoList);


  return (
    <div>
      <h1>My Todo List</h1>
      <TodoForm />
      <TodoList todoList={todoList} />
    </div>
  );
}

export default App;
