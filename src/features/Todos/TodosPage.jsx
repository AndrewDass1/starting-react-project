/*
  MENTOR — TodosPage.jsx  (the most important file to understand)

  What we are trying to do
  ------------------------
  This page is the "manager" of todos. It:
  1. Holds the list in state (todoList).
  2. Asks the server for todos when login / sort / search changes (useEffect).
  3. Lets the user add, complete, and edit a todo (then tells the server).
  4. Shows loading and errors so the user is not left guessing.

  How data should flow (draw this until you can say it out loud)
  --------------------------------------------------------------
    TodosPage owns: todoList, sort, filter, errors, loading
      ├── SortBy / FilterInput  → tell TodosPage the new sort/search
      ├── TodoForm              → calls addTodo (child talks UP)
      └── TodoList              → complete / update come back UP
            └── TodoListItem

  If you can explain that drawing, you understand this file.

  React basics used here
  ----------------------
  - useState: memory (the list, the sort, the search text, errors).
  - useEffect: "when X changes, talk to the network." Fetching is a
    SIDE EFFECT — it does not belong in the return/JSX.
  - Dependency array: the list at the end of useEffect. React re-runs
    the effect only when one of those values changes.
  - useCallback: remember a FUNCTION so it is not recreated every render.
  - Optimistic UI: show the change on screen FIRST, then talk to the
    server. If the server fails, UNDO the screen. You already do this
    well for add / complete / update.

  What you already did well
  -------------------------
  - Loading flag + error messages.
  - Debounced search (wait 300ms so we do not fetch on every keypress).
  - Sort and filter sent to the API as query params.
  - Optimistic add with a temporary Date.now() id, then swap in the
    real todo from the server. Rollback on failure. That is solid.

  THE MAIN FIX — dataVersion / invalidateCache are not wired
  ----------------------------------------------------------
  You created dataVersion and a function that bumps it. You call
  invalidateCache after add / complete / update. Good names.

  But a state variable does NOTHING unless something READS it.

  Your fetch useEffect depends on:
    [token, sortBy, sortDirection, debouncedFilterTerm]
  dataVersion is not in that list, so bumping it does not reload todos.

  Decide ONE job for dataVersion, then finish the wire:

  A) "After a change, refetch from the server."
     Add dataVersion to the useEffect dependency array.
     Know the tradeoff: you already updated local state optimistically,
     so a refetch may reload the whole list (possible flicker / extra
     "Loading..."). That can still be OK if the server is source of truth.

  B) "I do not need a refetch; local state is enough."
     Then remove dataVersion, invalidateCache, and the dataVersion prop
     to TodoList. Do not keep hooks that have no effect — they hide the
     real data flow.

  Do not keep the names from the lesson if the chain is broken.
  The chain is:  change happens → bump version → fetch SEES version → new list
*/

import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';
import { useCallback, useEffect, useState } from 'react';

import SortBy from '../../shared/SortBy.jsx';

import useDebounce from '../../utils/useDebounce.js'; 
import FilterInput from '../../shared/FilterInput.jsx';

export default function TodosPage({ token }) {
  // MENTOR: token is a PROP from App (read-only here). The list below is STATE
  // (this component owns it). Props in, state here, events back up to nobody
  // except the API.

  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // MENTOR: filterTerm updates on every keystroke (so the input feels instant).
  // debouncedFilterTerm waits 300ms. The FETCH should use the debounced value
  // (you did that). The INPUT should use filterTerm (FilterInput does that).
  const [filterTerm, setFilterTerm] = useState('');
  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  // MENTOR: this number only matters if someone reads it. See file header.
  const [dataVersion, setDataVersion] = useState(0);

  const [filterError, setFilterError] = useState('');


  function reset(){
    setFilterTerm('');
    setSortBy('createdAt');
    setSortDirection('desc');
    setFilterError('');
  }

  // MENTOR: useCallback here is fine, but the function only bumps a number.
  // Until the fetch effect lists dataVersion as a dependency, this is a
  // no-op for loading data. Either wire it or delete it (see file header).
  const invalidateCache = useCallback(() => {
      setDataVersion((prev) => prev + 1);
    },  [])


  function getRequestError(response, action) {
    if (response.status === 401 || response.status === 403) {
      return new Error('Unauthorized. Please log in again.');
    }

    return new Error(`Unable to ${action}. Please try again.`);
  }

  // MENTOR: this wrapper only calls setFilterTerm. You already pass
  // setSortBy directly to SortBy. You can pass setFilterTerm the same way:
  //   <FilterInput ... onFilterChange={setFilterTerm} />
  // Extra wrappers are not wrong — just know when you do not need them.
  const handleFilterChange = (newTerm) => {setFilterTerm(newTerm);};

  // MENTOR: useEffect = "do this when these values change."
  // Fetching belongs HERE, not inside the JSX return.
  //
  // The last line (the dependency array) is the contract:
  // "Re-run this when token, sort, direction, or the debounced search changes."
  //
  // Missing from that contract: dataVersion. That is why invalidateCache
  // does not reload the list.
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
        setTodoList(getResponse.tasks || []);
        setFilterError('');
      } catch (error) {
      // MENTOR: indent this catch body so it is easy to see what belongs
      // to try / catch / finally. Same logic, clearer reading.
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
  }, [token, sortBy, sortDirection, debouncedFilterTerm]); // MENTOR: add dataVersion here IF the point is to refetch.

  async function addTodo(todoTitle) {
    // MENTOR: optimistic UI in three beats:
    // 1) Put a temporary todo on screen (Date.now() as a stand-in id).
    // 2) POST to the server. When it returns, REPLACE the temp todo with the real one.
    // 3) If it fails, REMOVE the temp todo (rollback).
    // You did all three. That is the Lesson 7 pattern. Keep it.
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
      // MENTOR: this call only helps if fetch watches dataVersion. See file header.
      invalidateCache();

    } catch (error) {
      setError(error.message);
      setTodoList((previous) => previous.filter((todo) => todo.id !== idDate));
    }
  }

  async function completeTodo(id) {
    // MENTOR: same optimistic pattern: save the original, flip isCompleted
    // on screen, PATCH the server, replace with server todo, or restore original.
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

      {/* MENTOR: {error && (...)} means "if error is a non-empty string, show this."
          The extra <> </> fragment is not needed — the <div> is already one parent.
          Keep role="alert" so screen readers announce the message. Good habit. */}
      {error && (
        <>
          <div role="alert" aria-live="polite">
            <p>API error: {error}</p>
            <button type="button" onClick={() => setError('')}>Clear Error</button>
          </div>
        </>
      )}

      {/* MENTOR: give filterError the same pattern as error (role="alert").
          Users should hear both kinds of failure the same way. */}
      {filterError && (
        <div> 
          <p>Error: {filterError}</p>

          <button type="button" onClick={() => setFilterError('')}>Clear Filter Error</button>
          <button type="button" onClick={reset}>Reset Filters</button>
        </div>
        )
      }

      {isTodoListLoading && (
        <div>
          Loading todos...
        </div>
      )}

      {/* MENTOR: SortBy is a controlled pair of <select>s. Parent owns the
          values; child only displays them and calls the setters. That is
          the same idea as a text input — just a dropdown. */}
      <SortBy sortBy={sortBy} sortDirection={sortDirection} onSortByChange={setSortBy} onSortDirectionChange={setSortDirection}/>

      <FilterInput filterTerm={filterTerm} onFilterChange={handleFilterChange}/>

      {/* MENTOR: TodoForm does not own the list. It only calls onAddTodo
          (which is addTodo). Child talks UP. Parent updates state. */}
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
