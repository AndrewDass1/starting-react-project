import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';
import { useEffect, useState } from 'react';

export default function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  useEffect(() => {
    if (!token) return;

    async function fetchTodos() {
      setIsTodoListLoading(true);
      setError('');

      try {
        const params = new URLSearchParams({ limit: 100 });

        const response = await fetch(`/api/tasks?${params}`, {
          headers: {
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
        });

        if (response.status === 401) {
          throw new Error('Unauthorized, please log in again.');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch todos.');
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
  }, [token]);

  async function addTodo(todoTitle) {
    const idDate = Date.now();

    const newTodo = {
      id: idDate,
      title: todoTitle,
      isCompleted: false,
    };

    const previousList = todoList;

    setTodoList([newTodo, ...todoList]);

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
        throw new Error('Error. No todo was found to add.');
      }

      const getTodo = await response.json();

      setTodoList((previous) => previous.map((temporary) => (temporary.id === idDate ? getTodo : temporary)));

    } catch (error) {
      setError(error.message);
      setTodoList(previousList);
    }
  }

  async function completeTodo(id) {
    const originalTodo = todoList.find((temporary) => temporary.id === id);

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
        throw new Error('Error. No todo was found to complete.');
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
        throw new Error('Failed to update todo.');
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
        <div>
          <p>{error}</p>
          <button onClick={() => setError('')}>Clear Error</button>
        </div>
      )}

      {isTodoListLoading && (
        <div>
          Loading todos...
        </div>
      )}

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />

    </div>
  );
}
