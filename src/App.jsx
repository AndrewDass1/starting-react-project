import './App.css';

import Header from "./shared/Header.jsx";

import TodosPage from './features/Todos/TodosPage';

import Logon from './features/Logon.jsx';

import {useState} from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  if (token) {
    return <div>
      <Header onSetEmail={setEmail} onSetToken={setToken} token={token}/>
      
      <TodosPage token={token} />
    </div>
  }

  return <div>
    <Header onSetEmail={setEmail} onSetToken={setToken} token={token}/>

    <Logon onSetEmail={setEmail} onSetToken={setToken} />
  </div> 
  

}

export default App;