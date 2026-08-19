import './App.css';
import TodoForm from './features/TodoForm.jsx';
import TodoList from './features/TodoList/TodoList.jsx';
import { useState } from 'react';

function App() {

  const [todoList, SetTodoList] = useState([]);

  console.log(todoList)

  function addTodo(todoTitle){
      let todo = [{id: Date.now(), title: todoTitle, isCompleted: false}]

      return SetTodoList( todoList =>[...todo, ...todoList]);
  }


  function completeTodo(id) {
    SetTodoList( (getToDoList) => getToDoList.map( (todo) => (todo.id == id) ? {...todo, isCompleted: !todo.isCompleted}  : todo ) )
  }

  function updateTodo(editedTodo){
    const updatedTodos = todoList.map( (todo) => todo.id === editedTodo.id ? {...editedTodo}:todo );

    SetTodoList(updatedTodos);
  }

  return (
    <div>
      <h1>My Todo List</h1>
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo}/>
      <TodoForm onAddTodo={addTodo} />
    </div>
  );
}

export default App;