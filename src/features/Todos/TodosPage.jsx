import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';
import { useEffect, useState } from 'react';

export default function TodosPage({token, onClearToken}) {
    const [todoList, setTodoList] = useState([]);

    const [error, setError] = useState('');

    const [isTodoListLoading, setIsTodoListLoading] = useState(false);

    const clearError = () => {
        setError('');
    }

    async function addTodo(todoTitle){
        let todo = [{id: Date.now(), title: todoTitle, isCompleted: false}];
        
        const previous = todoList;

        const optState = [...todoList, todo];
        setTodoList(optState);

        const options = {
            method: 'POST',
            body: JSON.stringify({title: todoTitle, isCompleted: false}),
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token},
            credentials: 'include'
        };
        
        try {
            const response = await fetch(`/api/tasks`, options);

            const getResponse = await response.json();

            setTodoList([...previous, getResponse]);
        } catch (error) {
            setError(error.message);
            setTodoList(previous);
        }
    }


    async function completeTodo(id) {
        const previous = todoList;

        const optState = previous.map((todo) => todo.id === id ? {...todo, isCompleted: !todo.isCompleted} : todo)

        setTodoList(optState);

        const options = {
            method: 'PATCH',
            body: JSON.stringify({isCompleted: true}),
            headers: { 'Content-Type': 'application/json', 
                'X-CSRF-TOKEN': token},
            credentials: 'include'
        };

        try {
            const response = await fetch(`/api/tasks/${id}`, options);

            if (!response.ok) {
                throw new Error('Error')
            }

            const getResponse = await response.json();

            setTodoList(previous.map((todo) => (todo.id === id ? updated : todo)))

        } catch (error) {
            setError(error.message);
            setTodoList(previous);
        }
    }

    async function updateTodo(editedTodo){
        const previous = todoList;

        const optState = previous.map((todo) => todo.id === editedTodo.id ? { ...editedTodo } : todo);
        setTodoList(optState);

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

            if(!response.ok) {
                throw new Error("Error");
            }

            const getResponse = await response.json();

            const updatedTodos = previous.map( (todo) => todo.id === editedTodo.id ? getResponse:todo );
            setTodoList(updatedTodos);

        } catch (error) {
            setError(error.message);
            setTodoList(previous);
        }
    }

    useEffect( () => {
        if(!token) return;

        async function fetchTodos() {
            setIsTodoListLoading(true);
            setError('');

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

                if (response.status === 401) {
                    onClearToken?.();
                    setError("Error");
                    return;
                }

                if (!response.ok) {
                    throw new Error('Error');
                }

                const getResponse = await response.json();

                setTodoList(getResponse);
            }
            catch (error) {
                setError(`Error:, ${error.name} | ${error.message}`);
            }
            finally {
                setIsTodoListLoading(false);
            }
        }

        fetchTodos();
    }, [token, onClearToken]);


    return (
        <div>
            {isTodoListLoading && <p>Loading todos...</p>}
            {error && (
                <div> 
                    <p className="error">{error}</p>
                    <button onClick={clearError}>Clear Error</button>
                </div>
            )}
            <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo}/>
            
            <TodoForm onAddTodo={addTodo} />
        </div>
    )
}