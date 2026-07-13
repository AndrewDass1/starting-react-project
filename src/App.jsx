import './App.css'
import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';

function App() {

  // const todoList = [
  //   {id: 1, title: "review resources"},
  //   {id: 2, title: "take notes"},
  //   {id: 3, title: "code out app"},
  // ]

  return (
    <div>
      <h1>My Todo List</h1>
      <TodoForm />
      <TodoList />
    </div>
  );
}

export default App;


// Question: make function App return jsx files?