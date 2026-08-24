import { useState } from 'react';

export default function Logon(onSetEmail, onSetToken) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [authError, setauthError] = useState('');

    const [isLoggingOn, setisLoggingOn] = useState(false);
    

    async function handleSubmit(event) {
        event.preventDefault();

        setisLoggingOn(true);

        const options = {
            method: 'POST',
            body: JSON.stringify({email}, {password}),
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        };

        try {
            const response = await fetch('/api/users/logon', options);
            
            // if(!resp.ok){
            //     if(resp.status === 401) {
            //         console.dir(resp);
            //     }
            //     throw new Error(resp.status);
            // }

            const data = await response.json();

            if(response.status === 200 && data.name && data.csrfToken) {
                onSetEmail(data.name);
                onSetToken(data.csrfToken);
            } else {
                setauthError(`Authentication failed: ${data?.message}`);
            }
        } catch(response) {
            setauthError(`Error:, ${response.status}`);
        } finally {
            setisLoggingOn(false);
        }
    };

}