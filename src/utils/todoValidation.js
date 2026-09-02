/*
  MENTOR — todoValidation.js

  What we are trying to do
  ------------------------
  One question: "is this title usable?" Keep that rule in ONE place so
  TodoForm (Add) and TodoListItem (Update) cannot drift apart.

  .trim() !== '' means: spaces-only is not a real title.
  "   " → trim → "" → invalid. Good.

  This is a plain function, not a component and not a hook. That is
  correct — no JSX, no state. Utils stay boring on purpose.

  Optional later: also check a max length, or reject empty after trim
  AND require at least 2 characters. Only if the assignment asks.
*/

export function isValidTodoTitle(title) {
    return (title.trim() !== '');
}
