export default function SortBy({
  sortBy,
  sortDirection,
  onSortByChange,
  onSortDirectionChange,
}) {
  return (
    <div>
      <div>
        <label htmlFor="sortBy">Sort By:</label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(event) => onSortByChange(event.target.value)}
        >
          <option value="createdAt">CREATED AT</option>
          <option value="title">TITLE</option>
        </select>
      </div>

      <div>
        <label htmlFor="sortDirection">ORDER:</label>
        <select
          id="sortDirection"
          value={sortDirection}
          onChange={(event) => onSortDirectionChange(event.target.value)}
        >
          <option value="desc">DESCENDING</option>
          <option value="asc">ASCENDING</option>
        </select>
      </div>
    </div>
  );
}