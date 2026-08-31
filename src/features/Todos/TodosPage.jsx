import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';
import { useCallback, useEffect, useState } from 'react';

import SortBy from '../../shared/SortBy.jsx';

import useDebounce from '../../utils/useDebounce.js'; 
import FilterInput from '../../shared/FilterInput.jsx';

export default function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const [filterTerm, setFilterTerm] = useState('');
  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  const [dataVersion, setDataVersion] = useState(0);

  const [filterError, setFilterError] = useState('');

  function reset(){
    setFilterTerm('');
    setSortBy('createdAt');
    setSortDirection('desc');
    setFilterError('');
  }

  function invalidateCache() {
    const [dataVersion, setDataVersion] = useState(0);

    const handleIncrement = useCallback(() => {
      setDataVersion((prev) => prev + 1);
      console.log("Invalidating memo cache after todo mutation")
    }, [])
  }


  function getRequestError(response, action) {
    if (response.status === 401 || response.status === 403) {
      return new Error('Unauthorized. Please log in again.');
    }

    return new Error(`Unable to ${action}. Please try again.`);
  }

  const handleFilterChange = (newTerm) => {setFilterTerm(newTerm);};

  useEffect(() => {
    if (!token) return;

    async function fetchTodos() {
      setIsTodoListLoading(true);
      setError('');

      try {
        const paramsObject = {
          sortBy,
          sortDirection,
          limit: 100
        };
        if (debouncedFilterTerm) {
          paramsObject.find = debouncedFilterTerm;
        }

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
        setFilterError('');
      } catch (error) {
      if (debouncedFilterTerm || sortBy !== 'createdAt' || sortDirection !== 'desc') {
        setFilterError(`Error filtering/sorting todos: ${error.message}`);
      } else {
        setError(`Error fetching todos: ${error.message}`);
      }
    } finally {
        setIsTodoListLoading(false);
      }
    }

    fetchTodos();
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

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
      invalidateCache();

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
      invalidateCache();

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
      invalidateCache();

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

      {filterError && (
        <div> 
          <p>Error: {filterError}</p>

          <button onClick={handleFilterChange}>"Clear Filter Error"</button>
          <button onClick={handleIncrement}>Reset Filters</button>
        </div>
        )
      }

      {isTodoListLoading && (
        <div>
          Loading todos...
        </div>
      )}

      <SortBy sortBy={sortBy} sortDirection={sortDirection} onSortByChange={setSortBy} onSortDirectionChange={setSortDirection}/>

      <FilterInput filterTerm={filterTerm} onFilterChange={onFilterChange}/>

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        dataVersion={dataVersion}
      />

    </div>
  );
}
