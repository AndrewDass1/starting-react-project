/*
  MENTOR — start here.

  What this file is trying to do
  ------------------------------
  App is the "front door" of the whole React app. It has two jobs:

  1. Remember who is logged in (token, and maybe email).
  2. Decide what to show: the login form OR the todo page.

  React basics this file should teach you
  ----------------------------------------
  - A COMPONENT is a function whose name starts with a capital letter and
    returns JSX (the HTML-looking markup).
  - STATE is the component's memory. useState gives you a value + a setter.
    Only the setter (setToken, setEmail) should change that memory.
  - PROPS are how a parent talks to a child. Data flows DOWN. Events flow UP
    by passing a function (onSetToken) that the child can call.
  - CONDITIONAL RENDERING means: if we have a token, show TodosPage;
    if we do not, show Logon. That is the login "gate."

  What you already did well
  -------------------------
  You lifted token up to App so both Header and the login/todo pages can
  share it. That is the right design. The ternary that switches Logon vs
  TodosPage is the heart of the app — keep that idea.

  What to correct (do these first)
  --------------------------------
  1. Move the React import to the TOP. You already wrote a comment saying
     that — now actually do it. Habit: library imports first, then your
     components, then CSS.
  2. Header receives token / onSetToken / onSetEmail but ignores them.
     If nobody uses a prop, either use it (Logout button) or stop passing it.
  3. email is stored here but never shown. Either pass it to Header
     ("Logged in as …") or remove it. Every piece of state needs a job.
  4. App.css is imported, but that file is missing. Vite will fail until
     you add the file or remove this import. Same for index.css in main.jsx.

  After you fix Header logout, this file's job is done: App owns "who is
  logged in," and everyone else just reads or updates that through props.
*/

import './App.css';

import Header from "./shared/Header.jsx";

import TodosPage from './features/Todos/TodosPage';

import Logon from './features/Logon.jsx';

// MENTOR: this import should be line 1 (with the other imports grouped at the top).
// You already knew that — the leftover comment below is a reminder to finish the cleanup.
import {useState} from 'react'; //this import statement should be at the top of the 

function App() {
  // MENTOR: state = memory that survives re-renders.
  // email: currently unused on screen. Give it a job in Header, or delete it.
  // token: this is the "ticket" from the server. No token = not logged in.
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  return (<div>
      {/*
        MENTOR: you are passing three props into Header, but Header only
        renders an <h1>. Next step: if token exists, show a Logout button
        that calls onSetToken('') and onSetEmail(''). That will send the
        user back to Logon because of the ternary below. You can also show
        email here if you pass it as a prop.
      */}
      <Header token={token} onSetToken={setToken} onSetEmail={setEmail} />

      {/*
        MENTOR — conditional rendering (the login gate):
        "If we have a token, show todos. If not, show login."

        You do not need extra parentheses around token.
        This is enough:  {token ? <TodosPage ... /> : <Logon ... />}

        Notice how Logon cannot change token directly. It receives
        onSetToken / onSetEmail (the setters from App). When login
        succeeds, Logon CALLS those functions. That is "lifting state up."
      */}
      {(token) ? <TodosPage token={token} /> : <Logon onSetEmail={setEmail} onSetToken={setToken} />}

  </div>)
  

}
export default App;
