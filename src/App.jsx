import './App.css';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList.jsx';
import { useState } from 'react';

function App() {

  const [todoList, SetTodoList] = useState([]);

  console.log(todoList);
  console.log(todoList[0]);

  let condition = todoList.length > 0 ? console.log(todoList[0].id) : '';
  // console.log(condition);

  function addTodo(todoTitle){
      let todo = [{id: Date.now(), title: todoTitle, isCompleted: false}]

      return SetTodoList( todoList =>[...todo, ...todoList]);
  }

  function completeTodo(id){
    const [trueToDo, setTrueToDo] = useState('');

    todoList.map( (todo) => id == todo.id ? setTrueToDo({...todo, isCompleted: true}) : setTrueToDo({...todo, isCompleted: false}))
    
    return setTrueToDo();
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
