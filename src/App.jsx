import './App.css';

import Header from "./shared/Header.jsx";

import TodosPage from './features/Todos/TodosPage';

import Logon from './features/Logon.jsx';

import {useState} from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  const handleClearToken = () => {
    setToken('');
    setEmail('');
  }

  
    return <div>
      <Header onSetEmail={setEmail} onSetToken={setToken} token={token}/>

      {token && (
        <TodosPage token={token} onClearToken={handleClearToken}/>
      )}

      {!token && (
        <Logon onSetEmail={setEmail} onSetToken={setToken} />
      )}
      
    </div>  

}

export default App;
