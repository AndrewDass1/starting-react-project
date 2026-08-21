import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';
import { useEffect, useOptimistic, useState } from 'react';

export function TodosPage({token}) {
    const [todoList, SetTodoList] = useState([]);

    const [error, setError] = useState('');

    const [isTodoListLoading, setIsTodoListLoading] = useState(false);

    console.log(todoList)

    async function addTodo(todoTitle){
        let todo = [{id: Date.now(), title: todoTitle, isCompleted: false}];

        return SetTodoList( todoList =>[...todo, ...todoList]);
    }


    async function completeTodo(id) {
        SetTodoList( (getToDoList) => getToDoList.map( (todo) => (todo.id == id) ? {...todo, isCompleted: !todo.isCompleted}  : todo ) )
    }

    async function updateTodo(editedTodo){
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