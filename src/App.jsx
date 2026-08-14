import './App.css';
import TodoForm from './features/TodoForm.jsx';
import TodoList from './features/TodoList/TodoList.jsx';
import { useState } from 'react';

function App() {

  const [todoList, SetTodoList] = useState([]);

  function addTodo(todoTitle){
      let todo = [{id: Date.now(), title: todoTitle, isCompleted: false}]

      return SetTodoList( todoList =>[...todo, ...todoList]);
  }


  function completeTodo(id) {
    SetTodoList( (getToDoList) => getToDoList.map( (todo) => (todo.id == id) ? {...todo, isCompleted: true}  : todo ) )
  }


  function updateTodo(editedTodo){
    const updatedTodos = SetTodoList( (getToDoList) => getToDoList.map( (todo) => (todo.id == editedTodo) ? {...editedTodo}  : todo ) )
  }


  return (
    <div>
      <h1>My Todo List</h1>
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} updateTodo={onUpdateTodo}/>
      <TodoForm onAddTodo={addTodo} />
    </div>
  );
}

export default App;
