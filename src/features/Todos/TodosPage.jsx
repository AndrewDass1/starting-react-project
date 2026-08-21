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
            
        const options = {
            method: 'POST',
            body: JSON.stringify(todo.title, todo.isCompleted),
            headers: { 'Content-Type': 'application/json, X-CSRF-TOKEN'},
            credentials: 'include'
        };
        
        try {
            const response = await fetch(`http://localhost:3001/api/tasks`, options);
        } catch (error) {
            setauthError(`Authentication failed: ${data?.message}`);
        }


        return SetTodoList( todoList =>[...todo, ...todoList]);
    }


    async function completeTodo(id) {
        SetTodoList( (getToDoList) => getToDoList.map( (todo) => (todo.id == id) ? {...todo, isCompleted: !todo.isCompleted}  : todo ) )

        const options = {
            method: 'PATCH',
            body: JSON.stringify(todo.isCompleted),
            headers: { 'Content-Type': 'application/json, X-CSRF-TOKEN'},
            credentials: 'include'
        };

        try {
            const response = await fetch(`http://localhost:3001/api/tasks/${id}`, options);
        } catch (error) {
            setauthError(`Authentication failed: ${data?.message}`);
        }
    }

    async function updateTodo(editedTodo){
        const updatedTodos = todoList.map( (todo) => todo.id === editedTodo.id ? {...editedTodo}:todo );

        SetTodoList(updatedTodos);

        const options = {
            method: 'PATCH',
            body: JSON.stringify(todo.title, todo.isCompleted),
            headers: { 'Content-Type': 'application/json, X-CSRF-TOKEN'},
            credentials: 'include'
        };

        try {
            const response = await fetch(`http://localhost:3001/api/tasks/${editedTodo.id}`, options);
        } catch (error) {
            setauthError(`Authentication failed: ${data?.message}`);
        }
    }

    useEffect( () => {
        async function fetchTodos() {
            setIsTodoListLoading(true);

            try {
                const params = new URLSearchParams({
                        limit: 100,
                    });
                const response = await fetch(`/api/tasks?${params}`, {
                        headers: {
                            'X-CSRF-TOKEN': token,
                        },
                    credentials: 'include',
                });
            }
            catch (error) {
                if (error === 401) {
                    setError('unauthorized')
                }
                else {
                    setError(`Error:, ${error.name} | ${error.message}`);
                }
            }
            finally {
                setIsTodoListLoading(false);
            }
        }
    }, []);


    return (
        <div>
            <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo}/>
            <TodoForm onAddTodo={addTodo} />
        </div>
    )
}