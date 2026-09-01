/*
  MENTOR — Header.jsx

  What we are trying to do
  ------------------------
  The header is always on screen. It should:
  - Show the app title
  - If the user is logged in, let them log OUT

  React basics
  ------------
  Props are a delivery truck from parent → child. App packed token,
  onSetToken, and onSetEmail onto the truck. Header currently leaves
  the boxes unopened. In React, if you list a prop, you should use it
  (or stop listing it). Unused props are a sign the wiring is unfinished.

  What to build (plain language)
  ------------------------------
  1. Keep the <h1>Todo List</h1>.
  2. If token is a non-empty string, show a Logout button.
  3. When the button is clicked:
       onSetToken('');
       onSetEmail('');
     Those calls update App's state. App re-renders. The ternary in App
     sees an empty token and shows Logon again. You do not need to
     "navigate" anywhere — changing state is enough.

  Optional stretch: also accept an `email` (or name) prop and display
  "Logged in as …" next to Logout. Then the email state in App has a job.

  Why this matters
  ----------------
  Right now a user can log in but can never log out without refreshing.
  Logout is the matching half of login. Same pattern, opposite direction.
*/

export default function Header({ token, onSetToken, onSetEmail }) {
  // MENTOR: token / onSetToken / onSetEmail are received but never used.
  // That is why there is no Logout. Use them here (see notes above).
  return <h1>Todo List</h1>;
}
