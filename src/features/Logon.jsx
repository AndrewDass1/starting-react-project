/*
  MENTOR — Logon.jsx

  What we are trying to do
  ------------------------
  Collect email + password, POST them to /api/users/logon, and if the
  server says yes, hand the ticket back to App:

    onSetEmail(data.name)
    onSetToken(data.csrfToken)

  After that, THIS component unmounts because App's ternary switches to
  TodosPage. You do not redirect. You change parent state. React re-renders.

  React basics
  ------------
  Two layers of state:
  - LOCAL: email, password, authError, isLoggingOn (only this form needs them)
  - LIFTED: token / email in App (the rest of the app needs those)

  The local email is "what I typed." The App email is "who the server
  says I am" (data.name). Those are different on purpose.

  Controlled inputs: value={email} onChange={...} — same pattern as TodoForm.

  async / await + try / catch / finally:
  - try: talk to the server
  - catch: network or thrown errors
  - finally: ALWAYS turn off the loading flag, success or fail
  You used finally correctly. Keep that.

  What you did well
  -----------------
  required on the fields, disable the button while logging in, swap the
  button text to "Logging in...", role="alert" on errors, credentials:
  'include' so the cookie is sent. That is real auth UI.

  What to correct
  ---------------
  1. The button is ALREADY inside <form>. You do not need form="form1"
     or value="submit". type="submit" is enough.
  2. Prefer <br /> over <br></br> (same idea as self-closing <input />).
  3. After a failed login, consider also checking !response.ok before
     reading data.message, so a 500 HTML page does not confuse json().
     Optional, but it makes errors less mysterious.

  Practice: click Log On in your head. Which setState in App runs?
  What does App then render instead of this form? If you can answer,
  you understand lifting state up.
*/

import { useState } from 'react';

export default function Logon({onSetEmail, onSetToken}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [authError, setAuthError] = useState('');

    const [isLoggingOn, setIsLoggingOn] = useState(false);
    

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoggingOn(true);
        setAuthError('');

        const options = {
            method: 'POST',
            body: JSON.stringify({email, password}),
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        };

        try {
            const response = await fetch('/api/users/logon', options);

            const data = await response.json();

            if(response.status === 200 && data.name && data.csrfToken) {
                // MENTOR: these two calls update APP state. That is how we "log in."
                onSetEmail(data.name);
                onSetToken(data.csrfToken);
            } else {
                setAuthError(`Authentication failed: ${data?.message}`);
            }
        } catch(error) {
            setAuthError(`${error.name}: ${error.message}`);
        } finally {
            setIsLoggingOn(false); // MENTOR: runs on success AND failure. Correct.
        }
    };

    return <div>
        {authError && <div role="alert">{authError}</div>}

        <form onSubmit={handleSubmit} id="form1">
            <div>
                {/* MENTOR: htmlFor + id connects the label to the input.
                    Clicking "Email:" focuses the box. Keep this pairing. */}
                <label htmlFor="email">Email: </label>
                <input type="email" required value={email} onChange={event => setEmail(event.target.value)} id="email"/> <br></br>
            </div>


            <div>
                <label htmlFor="password">Password: </label>
                <input type="password" required value={password} onChange={event => setPassword(event.target.value)} id="password"/>
            </div>

            {/* MENTOR: drop form="form1" and value="submit" — already inside the form. */}
            <button type="submit" value="submit" disabled={isLoggingOn} form="form1">
                {isLoggingOn ? 'Logging in...' : 'Log On'}
            </button>
        </form>
    </div>

}
