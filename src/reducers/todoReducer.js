// features/Todos/todoReducer.js

export const initialTodoState = {
  todoList: [],
  isTodoListLoading: false,
  error: '',
  filterError: '',
  sortBy: 'createdAt',
  sortDirection: 'desc',
  filterTerm: '',
  debouncedFilterTerm: '',
  dataVersion: 0,
};

export function todoReducer(state, action) {
  switch (action.type) {
    case 'LOAD_TODOS_START':
      return {
        ...state,
        isTodoListLoading: true,
        error: '',
        filterError: '',
      };

    case 'LOAD_TODOS_SUCCESS':
      return {
        ...state,
        isTodoListLoading: false,
        todoList: action.payload.tasks || [],
        error: '',
        filterError: '',
      };

    case 'LOAD_TODOS_ERROR':
      return {
        ...state,
        isTodoListLoading: false,
        error: action.payload.error || 'Error fetching todos',
      };

    case 'FILTER_SORT_ERROR':
      return {
        ...state,
        isTodoListLoading: false,
        filterError: action.payload.error || 'Error filtering/sorting todos',
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: '',
      };

    case 'CLEAR_FILTER_ERROR':
      return {
        ...state,
        filterError: '',
      };

    case 'RESET_FILTERS':
      return {
        ...state,
        sortBy: 'createdAt',
        sortDirection: 'desc',
        filterTerm: '',
        filterError: '',
      };

    case 'SET_SORT':
      return {
        ...state,
        sortBy: action.payload.sortBy ?? state.sortBy,
        sortDirection: action.payload.sortDirection ?? state.sortDirection,
      };

    case 'SET_FILTER_TERM':
      return {
        ...state,
        filterTerm: action.payload,
      };

    case 'SET_DEBOUNCED_FILTER_TERM':
      return {
        ...state,
        debouncedFilterTerm: action.payload,
      };

    case 'INVALIDATE_CACHE':
      return {
        ...state,
        dataVersion: state.dataVersion + 1,
      };

    // optimistic add
    case 'ADD_TODO_OPTIMISTIC':
      return {
        ...state,
        error: '',
        todoList: [action.payload.todo, ...state.todoList],
      };

    case 'ADD_TODO_SUCCESS':
      return {
        ...state,
        todoList: state.todoList.map((t) =>
          t.id === action.payload.tempId ? action.payload.savedTodo : t
        ),
      };

    case 'ADD_TODO_ERROR':
      return {
        ...state,
        error: action.payload.error,
        todoList: state.todoList.filter((t) => t.id !== action.payload.tempId),
      };

    // optimistic complete
    case 'COMPLETE_TODO_OPTIMISTIC':
      return {
        ...state,
        error: '',
        todoList: state.todoList.map((t) =>
          t.id === action.payload.id ? { ...t, isCompleted: true } : t
        ),
      };

    case 'COMPLETE_TODO_SUCCESS':
      return {
        ...state,
        todoList: state.todoList.map((t) =>
          t.id === action.payload.id ? action.payload.savedTodo : t
        ),
      };

    case 'COMPLETE_TODO_ERROR':
      return {
        ...state,
        error: action.payload.error,
        todoList: state.todoList.map((t) =>
          t.id === action.payload.id ? action.payload.originalTodo : t
        ),
      };

    // optimistic update
    case 'UPDATE_TODO_OPTIMISTIC':
      return {
        ...state,
        error: '',
        todoList: state.todoList.map((t) =>
          t.id === action.payload.id ? action.payload.updatedTodo : t
        ),
      };

    case 'UPDATE_TODO_SUCCESS':
      return {
        ...state,
        todoList: state.todoList.map((t) =>
          t.id === action.payload.id ? action.payload.savedTodo : t
        ),
      };

    case 'UPDATE_TODO_ERROR':
      return {
        ...state,
        error: action.payload.error,
        todoList: state.todoList.map((t) =>
          t.id === action.payload.id ? action.payload.originalTodo : t
        ),
      };

    default:
      return state;
  }
}
