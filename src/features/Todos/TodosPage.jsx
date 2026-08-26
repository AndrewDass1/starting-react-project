import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';
import { useEffect, useState } from 'react';

export default function TodosPage({token}) {
    const [todoList, setTodoList] = useState([]);

    const [error, setError] = useState('');

    const [isTodoListLoading, setIsTodoListLoading] = useState(false);

    const clearError = () => {
        setError('');
    }

    async function addTodo(todoTitle){
        let todo = [{id: Date.now(), title: todoTitle, isCompleted: false}];
            
        const options = {
            method: 'POST',
            body: JSON.stringify({title: todo.title, isCompleted: todo.isCompleted}),
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token},
            credentials: 'include'
        };
        
        try {
            const response = await fetch(`http://localhost:3001/api/tasks`, options);
        } catch (error) {
            setauthError(`Authentication failed: ${data?.message}`);
        }


        return setTodoList( todoList =>[...todo, ...todoList]);
    }


    async function completeTodo(id) {
        setTodoList( (getToDoList) => getToDoList.map( (todo) => (todo.id == id) ? {...todo, isCompleted: !todo.isCompleted}  : todo ) )

        const options = {
            method: 'PATCH',
            body: JSON.stringify({isCompleted: true}),
            headers: { 'Content-Type': 'application/json', 
                'X-CSRF-TOKEN': token},
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

        setTodoList(updatedTodos);

        const passToBody = {
            title: editedTodo.title,
            isCompleted: true
        }

        const options = {
            method: 'PATCH',
            body: JSON.stringify(passToBody),
            headers: { 'Content-Type': 'application/json', 
                'X-CSRF-TOKEN': token},
            credentials: 'include'
        };

        try {
            const response = await fetch(`/api/tasks/${editedTodo.id}`, options);
        } catch (error) {
            setauthError(`Authentication failed: ${data?.message}`);
        }
    }

    useEffect( (token) => {
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
            
            <button onclick={clearError}>Clear Error</button>

            <TodoForm onAddTodo={addTodo} />
        </div>
    )
}