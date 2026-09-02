export default function SortBy({sortBy, sortDirection, onSortByChange, onSortDirectionChange}) {
    return (
        <div>
            <div>
                <label htmlFor="sortBy"> Sort By </label>

                <select
                    id="sortBy"
                    value={sortBy}
                    onChange={(event) => onSortByChange(event.target.value)}
                >

                    <option value="createdAt"> Created At </option>
                    <option value="title"> Title </option>

                </select>
            </div>

            <div>
                <label htmlFor="sortDirection"> Order </label>

                <select 
                    id="sortDirection"
                    value={sortDirection}
                    onChange={(event) => onSortDirectionChange(event.target.value)}
                >

                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                    
                </select>
            </div>

        </div>
    )
}
