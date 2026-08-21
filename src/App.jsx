import './App.css';

import { Header } from './shared/Header';

import { TodosPage } from './features/Todos/TodosPage';

import Logon from './features/Logon.jsx';

import {useState} from 'react';

function App() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');


  if (token) {
    return <div>
      <Header />
      <Logon onSetEmail={setEmail} onSetToken={setToken} />
    </div>
  }
  else {
    return <div>
      <Header />

      <TodosPage token={token} />
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
