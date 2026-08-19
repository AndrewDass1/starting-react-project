import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';
import { useState } from 'react';

export function TodosPage() {
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
            <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo}/>
            <TodoForm onAddTodo={addTodo} />
        </div>
    )
}