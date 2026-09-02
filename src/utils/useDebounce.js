/*
  MENTOR — useDebounce.js  (custom hook — you wrote a good one)

  What we are trying to do
  ------------------------
  Wait until the user PAUSES typing, then update a value. Search should
  not hit the API on every single keypress.

  Example: user types "m-i-l-k"
    filterTerm changes 4 times instantly (input stays snappy)
    debouncedFilterTerm changes ONCE, 300ms after the last key
    useEffect fetches once, not four times

  React basics — custom hooks
  ---------------------------
  A function whose name starts with `use` can call other hooks.
  You built a hook that OTHER components can reuse. That is the goal
  of Lesson 8-style utilities.

  How this works (plain language)
  -------------------------------
  1. User types. `value` changes. useEffect runs.
  2. We start a timer: "after `delay` ms, copy value into debouncedValue."
  3. If the user types AGAIN before the timer finishes, React runs the
     CLEANUP function (clearTimeout). The old timer is cancelled.
  4. A new timer starts. Only the last pause "wins."

  The cleanup function is the important part. Without it, every keypress
  would still fire a late update. You included cleanup. Keep it.

  This file does not need a logic change. Use it as a model for:
  "effect + timer + cleanup + dependency array."
*/

import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up a timeout to update the debounced value after the delay
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to clear the timeout if value changes before delay
    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]); // MENTOR: when value or delay changes, restart the timer.

  return debouncedValue;
}

export default useDebounce;
