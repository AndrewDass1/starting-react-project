// features/Todos/TodosPage.jsx
import { useCallback, useEffect, useReducer } from 'react';

import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';
import SortBy from '../../shared/SortBy.jsx';
import FilterInput from '../../shared/FilterInput.jsx';

import useDebounce from '../../utils/useDebounce.js';
import { useAuth } from '../AuthContext.jsx';
import { todoReducer, initialTodoState } from './todoReducer.js';

export default function TodosPage() {
  const { token } = useAuth();
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);

  const {
    todoList,
    error,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    debouncedFilterTerm,
    dataVersion,
    filterError,
  } = state;

  const debounced = useDebounce(filterTerm, 300);

  useEffect(() => {
    dispatch({ type: 'SET_DEBOUNCED_FILTER_TERM', payload: debounced });
  }, [debounced]);

  const invalidateCache = useCallback(() => {
    dispatch({ type: 'INVALIDATE_CACHE' });
  }, []);

  function getRequestError(response, action) {
    if (response.status === 401 || response.status === 403) {
      return new Error('Unauthorized. Please log in again.');
    }
    return new Error(`Unable to ${action}. Please try again.`);
  }

  useEffect(() => {
    if (!token) return;

    async function fetchTodos() {
      dispatch({ type: 'LOAD_TODOS_START' });

      try {
        const paramsObject = {
          sortBy,
          sortDirection,
          limit: 100,
        };
        if (debouncedFilterTerm) {
          paramsObject.find = debouncedFilterTerm;
        }

        const params = new URLSearchParams(paramsObject);

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
        dispatch({ type: 'LOAD_TODOS_SUCCESS', payload: { tasks: getResponse.tasks || [] } });
      } catch (error) {
        if (debouncedFilterTerm || sortBy !== 'createdAt' || sortDirection !== 'desc') {
          dispatch({
            type: 'FILTER_SORT_ERROR',
            payload: { error: `Error filtering/sorting todos: ${error.message}` },
          });
        } else {
          dispatch({
            type: 'LOAD_TODOS_ERROR',
            payload: { error: `Error fetching todos: ${error.message}` },
          });
        }
      }
    }

    fetchTodos();
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  async function addTodo(todoTitle) {
    const tempId = Date.now();

    const newTodo = {
      id: tempId,
      title: todoTitle,
      isCompleted: false,
    };

    dispatch({ type: 'ADD_TODO_OPTIMISTIC', payload: { todo: newTodo } });

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

      const savedTodo = await response.json();

      dispatch({
        type: 'ADD_TODO_SUCCESS',
        payload: { tempId, savedTodo },
      });
      invalidateCache();
    } catch (error) {
      dispatch({
        type: 'ADD_TODO_ERROR',
        payload: { tempId, error: error.message },
      });
    }
  }

  async function completeTodo(id) {
    const originalTodo = todoList.find((t) => t.id === id);
    if (!originalTodo) {
      dispatch({
        type: 'LOAD_TODOS_ERROR',
        payload: { error: 'Error. Todo was not found.' },
      });
      return;
    }

    dispatch({
      type: 'COMPLETE_TODO_OPTIMISTIC',
      payload: { id },
    });

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

      const savedTodo = await response.json();

      dispatch({
        type: 'COMPLETE_TODO_SUCCESS',
        payload: { id, savedTodo },
      });
      invalidateCache();
    } catch (error) {
      dispatch({
        type: 'COMPLETE_TODO_ERROR',
        payload: { id, originalTodo, error: error.message },
      });
    }
  }

  async function updateTodo(id, newTitle) {
    const originalTodo = todoList.find((t) => t.id === id);

    if (!originalTodo) {
      dispatch({
        type: 'LOAD_TODOS_ERROR',
        payload: { error: 'Error. Todo was not found.' },
      });
      return;
    }

    const updatedTodo = { ...originalTodo, title: newTitle };

    dispatch({
      type: 'UPDATE_TODO_OPTIMISTIC',
      payload: { id, updatedTodo },
    });

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

      const savedTodo = await response.json();

      dispatch({
        type: 'UPDATE_TODO_SUCCESS',
        payload: { id, savedTodo },
      });
      invalidateCache();
    } catch (error) {
      dispatch({
        type: 'UPDATE_TODO_ERROR',
        payload: { id, originalTodo, error: error.message },
      });
    }
  }

  function handleSortByChange(newSortBy) {
    dispatch({ type: 'SET_SORT', payload: { sortBy: newSortBy } });
  }

  function handleSortDirectionChange(newDirection) {
    dispatch({ type: 'SET_SORT', payload: { sortDirection: newDirection } });
  }

  function handleFilterChange(newTerm) {
    dispatch({ type: 'SET_FILTER_TERM', payload: newTerm });
  }

  function resetFilters() {
    dispatch({ type: 'RESET_FILTERS' });
  }

  return (
    <div>
      {error && (
        <div>
          <p>API error: {error}</p>
          <button type="button" onClick={() => dispatch({ type: 'CLEAR_ERROR' })}>
            Clear Error
          </button>
        </div>
      )}

      {filterError && (
        <div>
          <p>Filter error: {filterError}</p>
          <button type="button" onClick={() => dispatch({ type: 'CLEAR_FILTER_ERROR' })}>
            Clear Filter Error
          </button>
          <button type="button" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      )}

      {isTodoListLoading && <div>Loading todos...</div>}

      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={handleSortByChange}
        onSortDirectionChange={handleSortDirectionChange}
      />

      <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange} />

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


