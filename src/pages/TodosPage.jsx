import { useEffect, useReducer } from 'react';
import { useSearchParams } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';

import StatusFilter from '../shared/StatusFilter.jsx';
import TodoList from '../features/Todos/TodoList/TodoList.jsx';
import TodoForm from '../features/Todos/TodoForm/TodoForm.jsx';

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
    async function loadTodos() {
      try {
        const response = await fetch('/api/todos', {
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to load todos');
        }

        const todos = await response.json();
        dispatch({ type: 'loadSuccess', todos });
      } catch (err) {
        dispatch({ type: 'loadError', error: err.message });
      }
    }

    loadTodos();
  }, [token]);

  async function addTodo(title) {
    const response = await fetch('/api/todos', {
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

  async function updateTodo(todo) {
    const response = await fetch(`/api/todos/${todo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token,
      },
      credentials: 'include',
      body: JSON.stringify(todo),
    });

    if (response.ok) {
      const updated = await response.json();
      dispatch({ type: 'updateTodo', todo: updated });
    }
  }

  async function completeTodo(id) {
    const response = await fetch(`/api/todos/${id}/complete`, {
      method: 'POST',
      headers: { 'X-CSRF-TOKEN': token },
      credentials: 'include',
    });

    if (response.ok) {
      dispatch({ type: 'completeTodo', id });
    }
  }

  if (state.loading) return <p>Loading todos...</p>;
  if (state.error) return <p>Error: {state.error}</p>;

  return (
    <div>
      <h2>Your Todos</h2>

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