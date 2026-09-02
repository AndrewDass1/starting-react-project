export default function Header({ token, onSetToken, onSetEmail }) {
  return (
    <div>
      <h1> Todo List </h1>

      {(token) ?  <button> Logout </button> : <button onSetEmail={onSetEmail('')} onSetToken={onSetToken('')}>  </button>}
    </div>
  )
}
