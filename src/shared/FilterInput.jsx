/*
  MENTOR — FilterInput.jsx

  What we are trying to do
  ------------------------
  A search box. The PARENT owns the text (filterTerm). This component
  only displays it and calls onFilterChange when the user types.

  Why the parent owns it: TodosPage also needs that text to (a) debounce
  it and (b) send it to the API. If the text lived only in this input,
  TodosPage could not see it. That is lifting state up again.

  React basics — controlled input
  --------------------------------
    value={filterTerm}                 ← screen shows parent's state
    onChange={e => onFilterChange(...)}← child asks parent to update

  Never keep a second copy of the same string in this file.

  What to correct
  ---------------
  <input> cannot have children. Use a self-closing tag:

    <input
      id="filterInput"
      type="text"
      value={filterTerm}
      onChange={(event) => onFilterChange(event.target.value)}
      placeholder="Search by title..."
    />

  Opening + closing tags with a blank middle can make React warn.

  You already connected htmlFor and id. Keep that.
*/

export default function FilterInput({filterTerm, onFilterChange}) {
    return (
        <div>
            <label htmlFor='filterInput'>Search todos:</label>

            {/* MENTOR: self-close this input — it should not wrap children. */}
            <input 
                id='filterInput'
                type='text'
                value={filterTerm}
                onChange={event => onFilterChange(event.target.value)}
                placeholder='Search by title...'     
            /> 
        </div>
    )
}
