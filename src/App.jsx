import './App.css';

import { Header } from './shared/Header';

import { TodosPage } from './features/Todos/TodosPage';

import { Logon } from './features/Logon';

import {useState} from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  <Header token={token} onSetToken={setToken} onSetEmail={setEmail}/>

  if (token) {
    <TodosPage token={token} />
  }
  else {
    <Logon onSetEmail={setEmail} onSetToken={setToken} />
  }

  return (
    <div>
      <Header />

      <TodosPage />
    </div>
  );
}

export default App;
