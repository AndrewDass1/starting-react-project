import styles from '../filterinput.module.css';

export default function FilterInput({ filterTerm, onFilterChange }) {
  const tooLong = filterTerm.length > 50;

  return (
    <div>
      <label htmlFor="filterInput">SEARCH TODOS:</label>
      <input
        id="filterInput"
        type="text"
        value={filterTerm}
        onChange={(event) => onFilterChange(event.target.value)}
        placeholder="Search by title..."
        maxLength={50}
      />

    {tooLong && (
        <p className={styles.error}>Filter must be 50 characters or fewer.</p>
      )}
    </div>
  );
}