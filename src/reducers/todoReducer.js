// src/reducers/todoReducer.js

export const TODO_ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',

  ADD_TODO_START: 'ADD_TODO_START',
  ADD_TODO_SUCCESS: 'ADD_TODO_SUCCESS',
  ADD_TODO_ERROR: 'ADD_TODO_ERROR',

  COMPLETE_TODO_START: 'COMPLETE_TODO_START',
  COMPLETE_TODO_SUCCESS: 'COMPLETE_TODO_SUCCESS',
  COMPLETE_TODO_ERROR: 'COMPLETE_TODO_ERROR',

  UPDATE_TODO_START: 'UPDATE_TODO_START',
  UPDATE_TODO_SUCCESS: 'UPDATE_TODO_SUCCESS',
  UPDATE_TODO_ERROR: 'UPDATE_TODO_ERROR',

  SET_SORT: 'SET_SORT',
  SET_FILTER: 'SET_FILTER',

  CLEAR_ERROR: 'CLEAR_ERROR',
  CLEAR_FILTER_ERROR: 'CLEAR_FILTER_ERROR',

  RESET_FILTERS: 'RESET_FILTERS',
};

export const initialTodoState = {
  todoList: [],
  isTodoListLoading: true,
  error: '',
  filterError: '',
  sortBy: 'createdAt',
  sortDirection: 'asc',
  filterTerm: '',
};

export function todoReducer(state, action) {
  switch (action.type) {
    // ---------------------------
    // FETCH TODOS
    // ---------------------------
    case TODO_ACTIONS.FETCH_START:
      return {
        ...state,
        isTodoListLoading: true,
        error: '',
        filterError: '',
      };

    case TODO_ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        isTodoListLoading: false,
        todoList: action.payload.todos,
        error: '',
        filterError: '',
      };

    case TODO_ACTIONS.FETCH_ERROR: {
      const { message, errorType } = action.payload;

      return {
        ...state,
        isTodoListLoading: false,
        error: errorType === 'general' ? message : '',
        filterError: errorType === 'filter' ? message : '',
      };
    }

    // ---------------------------
    // ADD TODO (optimistic)
    // ---------------------------
    case TODO_ACTIONS.ADD_TODO_START:
      return {
        ...state,
        error: '',
        filterError: '',
        todoList: [action.payload.newTodo, ...state.todoList],
      };

    case TODO_ACTIONS.ADD_TODO_SUCCESS:
      return {
        ...state,
        todoList: state.todoList.map((t) =>
          t.id === action.payload.tempId ? action.payload.savedTodo : t
        ),
      };

    case TODO_ACTIONS.ADD_TODO_ERROR:
      return {
        ...state,
        error: action.payload.message,
        todoList: state.todoList.filter((t) => t.id !== action.payload.tempId),
      };

    // ---------------------------
    // COMPLETE TODO (optimistic)
    // ---------------------------
    case TODO_ACTIONS.COMPLETE_TODO_START:
      return {
        ...state,
        error: '',
        filterError: '',
        todoList: state.todoList.map((t) =>
          t.id === action.payload.id ? { ...t, isCompleted: true } : t
        ),
      };

    case TODO_ACTIONS.COMPLETE_TODO_SUCCESS:
      return {
        ...state,
        todoList: state.todoList.map((t) =>
          t.id === action.payload.id ? action.payload.savedTodo : t
        ),
      };

    case TODO_ACTIONS.COMPLETE_TODO_ERROR:
      return {
        ...state,
        error: action.payload.message,
        todoList: state.todoList.map((t) =>
          t.id === action.payload.id ? action.payload.originalTodo : t
        ),
      };

    // ---------------------------
    // UPDATE TODO (optimistic)
    // ---------------------------
    case TODO_ACTIONS.UPDATE_TODO_START:
      return {
        ...state,
        error: '',
        filterError: '',
        todoList: state.todoList.map((t) =>
          t.id === action.payload.id ? action.payload.updatedTodo : t
        ),
      };

    case TODO_ACTIONS.UPDATE_TODO_SUCCESS:
      return {
        ...state,
        todoList: state.todoList.map((t) =>
          t.id === action.payload.id ? action.payload.savedTodo : t
        ),
      };

    case TODO_ACTIONS.UPDATE_TODO_ERROR:
      return {
        ...state,
        error: action.payload.message,
        todoList: state.todoList.map((t) =>
          t.id === action.payload.id ? action.payload.originalTodo : t
        ),
      };

    // ---------------------------
    // SORT + FILTER
    // ---------------------------
    case TODO_ACTIONS.SET_SORT:
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortDirection: action.payload.sortDirection,
      };

    case TODO_ACTIONS.SET_FILTER:
      return {
        ...state,
        filterTerm: action.payload.filterTerm,
        error: '',
        filterError: '',
      };

    case TODO_ACTIONS.RESET_FILTERS:
      return {
        ...state,
        filterTerm: '',
        sortBy: 'createdAt',
        sortDirection: 'asc',
        filterError: '',
        error: '',
      };

    // ---------------------------
    // CLEAR ERRORS
    // ---------------------------
    case TODO_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: '',
      };

    case TODO_ACTIONS.CLEAR_FILTER_ERROR:
      return {
        ...state,
        filterError: '',
      };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}
