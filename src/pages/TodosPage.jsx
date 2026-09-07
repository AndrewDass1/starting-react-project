import { useEffect, useReducer } from 'react';
import { useSearchParams } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';

import StatusFilter from '../shared/StatusFilter.jsx';
import TodoList from '../features/Todos/TodoList/TodoList.jsx';
import TodoForm from '../features/Todos/TodoForm.jsx';
import SortBy from '../shared/SortBy.jsx';
import FilterInput from '../shared/FilterInput.jsx';

const initialState = {
  todoList: [],
  dataVersion: 0,
  loading: true,
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'loadSuccess':
      return {
        ...state,
        todoList: action.todos,
        dataVersion: state.dataVersion + 1,
        loading: false,
        error: '',
      };

    case 'loadError':
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case 'addTodo':
      return {
        ...state,
        todoList: [...state.todoList, action.todo],
        dataVersion: state.dataVersion + 1,
      };

    case 'updateTodo':
      return {
        ...state,
        todoList: state.todoList.map((t) =>
          t.id === action.todo.id ? action.todo : t
        ),
        dataVersion: state.dataVersion + 1,
      };

    case 'completeTodo':
      return {
        ...state,
        todoList: state.todoList.map((t) =>
          t.id === action.id ? { ...t, isCompleted: true } : t
        ),
        dataVersion: state.dataVersion + 1,
      };

    default:
      return state;
  }
}

export default function TodosPage() {
  const { token } = useAuth();
  const [state, dispatch] = useReducer(reducer, initialState);

  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || 'all';

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch('/api/tasks', {
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        });

        if (response.status === 401) {
          throw new Error('Unauthorized: please log in again.');
        }

        if (!response.ok) {
          throw new Error('Failed to load tasks.');
        }

        const result = await response.json();
        const tasks = result.tasks || []; // backend shape fix

        dispatch({ type: 'loadSuccess', todos: tasks });
      } catch (err) {
        dispatch({ type: 'loadError', error: err.message });
      }
    }

    loadTasks();
  }, [token]);

  async function addTodo(title) {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token,
      },
      credentials: 'include',
      body: JSON.stringify({ title }),
    });

    if (response.ok) {
      const result = await response.json();
      const todo = result.task || result; // backend shape flexibility
      dispatch({ type: 'addTodo', todo });
    }
  }

  async function updateTodo(todo) {
    const response = await fetch(`/api/tasks/${todo.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token,
      },
      credentials: 'include',
      body: JSON.stringify(todo),
    });

    if (response.ok) {
      const result = await response.json();
      const updated = result.task || result;
      dispatch({ type: 'updateTodo', todo: updated });
    }
  }


  async function completeTodo(id) {
    const response = await fetch(`/api/tasks/${id}/complete`, {
      method: 'POST',
      headers: { 'X-CSRF-TOKEN': token },
      credentials: 'include',
    });

    if (response.ok) {
      dispatch({ type: 'completeTodo', id });
    }
  }

  if (state.loading) return <p>Loading tasks...</p>;
  if (state.error) return <p>Error: {state.error}</p>;


  return (
    <div>
      <h2>Your Tasks</h2>

      <SortBy />
      <FilterInput />
      <StatusFilter />

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={state.todoList}
        dataVersion={state.dataVersion}
        statusFilter={statusFilter}
        onUpdateTodo={updateTodo}
        onCompleteTodo={completeTodo}
      />
    </div>
  );
}