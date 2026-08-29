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
                onSetEmail(data.name);
                onSetToken(data.csrfToken);
            } else {
                setAuthError(`Authentication failed: ${data?.message}`);
            }
        } catch(error) {
            setAuthError(`${error.name}: ${error.message}`);
        } finally {
            setIsLoggingOn(false);
        }
    };

    return <div>
        {authError && <div role="alert">{authError}</div>}

        <form onSubmit={handleSubmit} id="form1">
            <div>
                <label htmlFor="email">Email: </label>
                <input type="email" required value={email} onChange={event => setEmail(event.target.value)} id="email"/> <br></br>
            </div>


            <div>
                <label htmlFor="password">Password: </label>
                <input type="password" required value={password} onChange={event => setPassword(event.target.value)} id="password"/>
            </div>

            <button type="submit" value="submit" disabled={isLoggingOn} form="form1">
                {isLoggingOn ? 'Logging in...' : 'Log On'}
            </button>
        </form>
    </div>

}

