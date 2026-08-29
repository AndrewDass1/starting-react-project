export default function FilterInput({filterTerm, onFilterChange}) {
    return (
        <div>
            <label text="Search todos:" htmlFor='filterInput'>  </label>

            <input 
                id='filterInput'
                type='text'
                value={filterTerm}
                onChange={event => onFilterChange(event.target.value)}
                placeholder='Search by title...'     
            >  
                    
            </input>
        </div>
    )
}