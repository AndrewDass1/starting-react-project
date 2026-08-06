import './App.css';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList.jsx';
import { useState } from 'react';

function App() {

  const [todoList, SetTodoList] = useState([]);
  // const [todoList, SetTodoList] = useState(todos.todoList);


  function addTodo(todoTitle){
      let todo = [{id: Date.now(), title: todoTitle}]

      SetTodoList( () => todo);
  }

  return (
    <div>
      <h1>My Todo List</h1>
      {/* <TodoForm /> */}
      <TodoList todoList={todoList} />
      <TodoForm onAddTodo={addTodo} />
    </div>
  );
}

export default App;