import { useEffect, useReducer } from 'react';
import { useSearchParams } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';

import StatusFilter from '../shared/StatusFilter.jsx';
import SortBy from '../shared/SortBy.jsx';
import FilterInput from '../shared/FilterInput.jsx';
import TodoList from '../features/Todos/TodoList/TodoList.jsx';
import TodoForm from '../features/Todos/TodoForm.jsx';

import { sanitizeText } from '../utils/sanitize.js';

import {
  todoReducer,
  initialTodoState,
  TODO_ACTIONS
} from '../reducers/todoReducer.js';

export default function TodosPage() {
  const { token } = useAuth();
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);
  const [searchParams] = useSearchParams();

  const statusFilter = searchParams.get('status') || 'all';

  
  useEffect(() => {
    async function loadTasks() {
      dispatch({ type: TODO_ACTIONS.FETCH_START });

      try {
        const response = await fetch('/api/tasks', {
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to load tasks.');
        }

        const data = await response.json();

        const todos = Array.isArray(data)
          ? data
          : Array.isArray(data.tasks)
          ? data.tasks
          : [];

        dispatch({
          type: TODO_ACTIONS.FETCH_SUCCESS,
          payload: { todos }
        });
      } catch (err) {
        dispatch({
          type: TODO_ACTIONS.FETCH_ERROR,
          payload: { message: err.message, errorType: 'general' }
        });
      }
    }

    loadTasks();
  }, [token]);

  
  async function addTodo(title) {
    const sanitized = sanitizeText(title);

    const tempId = crypto.randomUUID();
    const newTodo = {
      id: tempId,
      title: sanitized,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };

    dispatch({
      type: TODO_ACTIONS.ADD_TODO_START,
      payload: { newTodo }
    });

    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token,
      },
      credentials: 'include',
      body: JSON.stringify({ title: sanitized }),
    });

    if (response.ok) {
      const savedTodo = await response.json();
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_SUCCESS,
        payload: { tempId, savedTodo }
      });
    } else {
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: { tempId, message: 'Failed to add todo.' }
      });
    }
  }


  async function updateTodo(id, title) {
    const sanitized = sanitizeText(title);

    const originalTodo = state.todoList.find((t) => t.id === id);
    const updatedTodo = { ...originalTodo, title: sanitized };

    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_START,
      payload: { id, updatedTodo }
    });

    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token,
      },
      credentials: 'include',
      body: JSON.stringify({ title: sanitized }),
    });

    if (response.ok) {
      const savedTodo = await response.json();
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_SUCCESS,
        payload: { id, savedTodo }
      });
    } else {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: { id, originalTodo, message: 'Failed to update todo.' }
      });
    }
  }


  async function completeTodo(id) {
    const originalTodo = state.todoList.find((t) => t.id === id);

    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: { id }
    });

    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token,
      },
      credentials: 'include',
      body: JSON.stringify({ isCompleted: true }),
    });

    if (response.ok) {
      const savedTodo = await response.json();
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
        payload: { id, savedTodo }
      });
    } else {
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: { id, originalTodo, message: 'Failed to complete todo.' }
      });
    }
  }


  async function uncompleteTodo(id) {
    const originalTodo = state.todoList.find((t) => t.id === id);

    dispatch({
      type: TODO_ACTIONS.UNCOMPLETE_TODO_START,
      payload: { id }
    });

    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token,
      },
      credentials: 'include',
      body: JSON.stringify({ isCompleted: false }),
    });

    if (response.ok) {
      const savedTodo = await response.json();
      dispatch({
        type: TODO_ACTIONS.UNCOMPLETE_TODO_SUCCESS,
        payload: { id, savedTodo }
      });
    } else {
      dispatch({
        type: TODO_ACTIONS.UNCOMPLETE_TODO_ERROR,
        payload: { id, originalTodo, message: 'Failed to uncomplete todo.' }
      });
    }
  }

  if (state.isTodoListLoading) return <p>Loading todos...</p>;
  if (state.error) return <p>Error: {state.error}</p>;

  return (
    <div>
      <h2>YOUR TODOS</h2>

      <SortBy
        sortBy={state.sortBy}
        sortDirection={state.sortDirection}
        onSortByChange={(sortBy) =>
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: { sortBy, sortDirection: state.sortDirection }
          })
        }
        onSortDirectionChange={(sortDirection) =>
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: { sortBy: state.sortBy, sortDirection }
          })
        }
      />

      <FilterInput
        filterTerm={state.filterTerm}
        onFilterChange={(filterTerm) =>
          dispatch({
            type: TODO_ACTIONS.SET_FILTER,
            payload: { filterTerm }
          })
        }
      />

      <StatusFilter />

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={state.todoList}
        dataVersion={state.dataVersion}
        statusFilter={statusFilter}
        sortBy={state.sortBy}
        sortDirection={state.sortDirection}
        filterTerm={state.filterTerm}
        onUpdateTodo={updateTodo}
        onCompleteTodo={completeTodo}
        onUncompleteTodo={uncompleteTodo}
      />
    </div>
  );
}