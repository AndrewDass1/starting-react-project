import './App.css';

import Header from "./shared/Header.jsx";

import { TodosPage } from './features/Todos/TodosPage';

import Logon from './features/Logon.jsx';

import {useState} from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  <Header onSetEmail={setEmail} onSetToken={setToken} token={token}/>

  if (token) {
    return <div>
      
      <TodosPage token={token} />
    </div>
  }
  else {
    return <div>

      <Logon onSetEmail={setEmail} onSetToken={setToken} />
    </div> 
  }

  // return (
  //   <div>
  //     <Header />

  //     <TodosPage />
  //   </div>
  // );
  //       <Header token={token} onSetToken={setToken} onSetEmail={setEmail}/>
}

export default App;