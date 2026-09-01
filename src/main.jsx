/*
  MENTOR — main.jsx (the real starting line)

  What we are trying to do
  ------------------------
  This file is not a "page." It is the bootstrap: take the App component
  and put it on the real HTML page (the <div id="root"> in index.html).

  React basics
  ------------
  - createRoot(...).render(...) is how React 18/19 mounts your tree.
  - <StrictMode> is a development helper. It may run effects twice on
    purpose to catch bugs. That is normal in `npm run dev`, not a crash.
  - App is the first component YOU wrote. Everything else hangs under it.

  What to correct
  ---------------
  You import './index.css' but that file is not in the project (same
  problem as App.css). Either create a simple index.css or remove this
  import. An import must point at a file that exists, or Vite will error.
*/

//Main.jsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // MENTOR: this file is missing — add it or delete this line.

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
