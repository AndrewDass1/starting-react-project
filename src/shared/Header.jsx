export default function Header({ token, onSetToken, onSetEmail }) {
  function resetOnSet(){
      onSetToken('');
      onSetEmail('');
  }

  return (
    <div>
      <h1> Todo List </h1>

      {(token) ? <button onClick={resetOnSet}> Logout </button> : ''}
    </div>
  )
}