import { useEffect, useReducer, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';

import StatusFilter from '../shared/StatusFilter.jsx';
import SortBy from '../shared/SortBy.jsx';
import FilterInput from '../shared/FilterInput.jsx';
import TodoList from '../features/Todos/TodoList/TodoList.jsx';
import TodoForm from '../features/Todos/TodoForm.jsx';

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
      return { ...state, loading: false, error: action.error };

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

  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const [filterTerm, setFilterTerm] = useState('');

  useEffect(() => {
    async function loadTasks() {
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

        dispatch({ type: 'loadSuccess', todos });
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
      const todo = await response.json();
      dispatch({ type: 'addTodo', todo });
    }
  }

  async function updateTodo(id, title) {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token,
      },
      credentials: 'include',
      body: JSON.stringify({ title }),
    });

    if (response.ok) {
      const updated = await response.json();
      dispatch({ type: 'updateTodo', todo: updated });
    }
  }

  async function completeTodo(id) {
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
      dispatch({ type: 'completeTodo', id });
    }
  }

  if (state.loading) return <p>Loading todos...</p>;
  if (state.error) return <p>Error: {state.error}</p>;

  return (
    <div>
      <h2>YOUR TODOS</h2>

      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
      />

      <FilterInput filterTerm={filterTerm} onFilterChange={setFilterTerm} />

      <StatusFilter />

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={state.todoList || []}
        dataVersion={state.dataVersion}
        statusFilter={statusFilter}
        sortBy={sortBy}
        sortDirection={sortDirection}
        filterTerm={filterTerm}
        onUpdateTodo={updateTodo}
        onCompleteTodo={completeTodo}
      />
    </div>
  );
}