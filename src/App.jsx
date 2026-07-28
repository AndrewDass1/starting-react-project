import './App.css';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList.jsx';
import { useState } from 'react';

// Not needed anymore:
// const todos = [
//     {id: 1, title: "review resources"},
//     {id: 2, title: "take notes"},
//     {id: 3, title: "code out app"},
//   ]

function App() {

  const [todoList, SetTodoList] = useState([]);
  // const [todoList, SetTodoList] = useState(todos.todoList);


function addTodo(todoTitle){
    let todo = [{id: Date.now(), title: todoTitle}]
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