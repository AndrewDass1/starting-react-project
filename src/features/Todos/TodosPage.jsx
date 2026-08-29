import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';
import { useEffect, useState } from 'react';

import SortBy from '../../shared/SortBy.jsx';

export default function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  function getRequestError(response, action) {
    if (response.status === 401 || response.status === 403) {
      return new Error('Unauthorized. Please log in again.');
    }

    return new Error(`Unable to ${action}. Please try again.`);
  }

  useEffect(() => {
    if (!token) return;

    async function fetchTodos() {
      setIsTodoListLoading(true);
      setError('');

      try {
        const params = new URLSearchParams({ sortBy, sortDirection, limit: 100 });

        const response = await fetch(`/api/tasks?${params}`, {
          headers: {
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw getRequestError(response, 'load todos');
        }

        const getResponse = await response.json();
        setTodoList(getResponse.tasks || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsTodoListLoading(false);
      }
    }

    fetchTodos();
  }, [token, sortBy, sortDirection]);

  async function addTodo(todoTitle) {
    const idDate = Date.now();

    const newTodo = {
      id: idDate,
      title: todoTitle,
      isCompleted: false,
    };

    setError('');
    setTodoList((previous) => [newTodo, ...previous]);

    try {
      const response = await fetch(`/api/tasks`, {
        method: 'POST',
        body: JSON.stringify({ title: todoTitle, isCompleted: false }),
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw getRequestError(response, 'add this todo');
      }

      const getTodo = await response.json();

      setTodoList((previous) => previous.map((temporary) => (temporary.id === idDate ? getTodo : temporary)));

    } catch (error) {
      setError(error.message);
      setTodoList((previous) => previous.filter((todo) => todo.id !== idDate));
    }
  }

  async function completeTodo(id) {
    const originalTodo = todoList.find((temporary) => temporary.id === id);

    setError('');
    setTodoList((previous) => previous.map((temporary) => temporary.id === id ? { ...temporary, isCompleted: true } : temporary));

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isCompleted: true }),
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw getRequestError(response, 'complete this todo');
      }

      const getTodo = await response.json();

      setTodoList((previous) => previous.map((temporary) => (temporary.id === id ? getTodo : temporary)));

    } catch (error) {
      setError(error.message);

      setTodoList((previous) => previous.map((temporary) => temporary.id === id ? originalTodo : temporary));
    }
  }

  async function updateTodo(id, newTitle) {
    const originalTodo = todoList.find((temporary) => temporary.id === id);

    if (!originalTodo) {
      setError("Error. Todo was not found.");
      return;
    }

    const newTodo = {...originalTodo, title: newTitle};

    setError('');
    setTodoList((previous) =>
      previous.map((temporary) => temporary.id === id ? newTodo : temporary));

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: newTitle,
          isCompleted: originalTodo.isCompleted,
        }),
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw getRequestError(response, 'update this todo');
      }

      const updatedTodo = await response.json();

      setTodoList((previous) =>
        previous.map((temporary) => temporary.id === id ? updatedTodo : temporary));

    } catch (error) {
      setError(error.message);

      setTodoList((previous) => previous.map((temporary) => temporary.id === id ? originalTodo : temporary));
    }
  }

  return (
    <div>

      {error && (
        <>
          <div role="alert" aria-live="polite">
            <p>API error: {error}</p>
            <button type="button" onClick={() => setError('')}>Clear Error</button>
          </div>
        </>
      )}

      {isTodoListLoading && (
        <div>
          Loading todos...
        </div>
      )}

      <SortBy sortBy={sortBy} sortDirection={sortDirection} onSortByChange={setSortBy} onSortDirectionChange={setSortDirection}/>

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />

    </div>
  );
}
