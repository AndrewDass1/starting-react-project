import { useCallback, useEffect, useReducer } from 'react';

import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';
import SortBy from '../../shared/SortBy.jsx';
import FilterInput from '../../shared/FilterInput.jsx';

import useDebounce from '../../utils/useDebounce.js'
import { useAuth } from '../../contexts/AuthContext.jsx';
import { todoReducer, initialTodoState, TODO_ACTIONS } from '../../reducers/todoReducer.js';

export default function TodosPage() {
  const { token } = useAuth();
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);

  const {
    todoList,
    error,
    filterError,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
  } = state;

  const debounced = useDebounce(filterTerm, 300);

  // Used only to bump dataVersion after optimistic updates
  const invalidateCache = useCallback(() => {
    dispatch({ type: TODO_ACTIONS.INCREMENT_DATA_VERSION });
  }, []);

  function getRequestError(response, action) {
    if (response.status === 401 || response.status === 403) {
      return new Error('Unauthorized. Please log in again.');
    }
    return new Error(`Unable to ${action}. Please try again.`);
  }

  // ---------------------------
  // FETCH TODOS
  // ---------------------------
  useEffect(() => {
    if (!token) return;

    async function fetchTodos() {
      dispatch({ type: TODO_ACTIONS.FETCH_START });

      try {
        const paramsObject = {
          sortBy,
          sortDirection,
          limit: 100,
        };

        if (debounced) {
          paramsObject.find = debounced;
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

        dispatch({
          type: TODO_ACTIONS.FETCH_SUCCESS,
          payload: { todos: getResponse.tasks || [] },
        });
      } catch (error) {
        const errorType = debounced ? 'filter' : 'general';

        dispatch({
          type: TODO_ACTIONS.FETCH_ERROR,
          payload: {
            message: error.message,
            errorType,
          },
        });
      }
    }

    fetchTodos();
  }, [token, sortBy, sortDirection, debounced]);

  // ---------------------------
  // ADD TODO
  // ---------------------------
  async function addTodo(todoTitle) {
    const tempId = Date.now();

    const newTodo = {
      id: tempId,
      title: todoTitle,
      isCompleted: false,
      createdAt: Date.now(),
    };

    dispatch({
      type: TODO_ACTIONS.ADD_TODO_START,
      payload: { newTodo },
    });

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
        type: TODO_ACTIONS.ADD_TODO_SUCCESS,
        payload: { tempId, savedTodo },
      });

      invalidateCache();
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: { tempId, message: error.message },
      });
    }
  }

  // ---------------------------
  // COMPLETE TODO
  // ---------------------------
  async function completeTodo(id) {
    const originalTodo = todoList.find((t) => t.id === id);
    if (!originalTodo) {
      dispatch({
        type: TODO_ACTIONS.FETCH_ERROR,
        payload: { message: 'Todo not found.', errorType: 'general' },
      });
      return;
    }

    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: { id, originalTodo },
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
        type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
        payload: { id, savedTodo },
      });

      invalidateCache();
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: { id, originalTodo, message: error.message },
      });
    }
  }

  // ---------------------------
  // UPDATE TODO
  // ---------------------------
  async function updateTodo(id, newTitle) {
    const originalTodo = todoList.find((t) => t.id === id);

    if (!originalTodo) {
      dispatch({
        type: TODO_ACTIONS.FETCH_ERROR,
        payload: { message: 'Todo not found.', errorType: 'general' },
      });
      return;
    }

    const updatedTodo = { ...originalTodo, title: newTitle };

    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_START,
      payload: { id, updatedTodo, originalTodo },
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
        type: TODO_ACTIONS.UPDATE_TODO_SUCCESS,
        payload: { id, savedTodo },
      });

      invalidateCache();
    } catch (error) {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: { id, originalTodo, message: error.message },
      });
    }
  }

  // ---------------------------
  // SORT + FILTER
  // ---------------------------
  function handleSortByChange(newSortBy) {
    dispatch({
      type: TODO_ACTIONS.SET_SORT,
      payload: { sortBy: newSortBy, sortDirection },
    });
  }

  function handleSortDirectionChange(newDirection) {
    dispatch({
      type: TODO_ACTIONS.SET_SORT,
      payload: { sortBy, sortDirection: newDirection },
    });
  }

  function handleFilterChange(newTerm) {
    dispatch({
      type: TODO_ACTIONS.SET_FILTER,
      payload: { filterTerm: newTerm },
    });
  }

  function resetFilters() {
    dispatch({ type: TODO_ACTIONS.RESET_FILTERS });
  }

  return (
    <div>
      {error && (
        <div>
          <p>API error: {error}</p>
          <button
            type="button"
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}
          >
            Clear Error
          </button>
        </div>
      )}

      {filterError && (
        <div>
          <p>Filter error: {filterError}</p>
          <button
            type="button"
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}
          >
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

