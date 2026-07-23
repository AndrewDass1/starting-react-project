import TodoListItem from './TodoListItem.jsx';

  // const todoList = [
  //   {id: 1, title: "review resources"},
  //   {id: 2, title: "take notes"},
  //   {id: 3, title: "code out app"},
  // ]

function TodoList({todoList}) {

    // return ( <ul> {todoList.map(todo => <li key={todo.id}>{todo.title}</li>)} </ul>);
    return <ul> {todoList.map( (todo) => <TodoListItem key={todo.id} todo={todo}/> ) } </ul>;
}

export default TodoList;