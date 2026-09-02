/*
  MENTOR — SortBy.jsx

  What we are trying to do
  ------------------------
  Two dropdowns: "which field" and "which direction." Changing them
  should make TodosPage fetch a new ordered list from the server.

  React basics — controlled <select>
  ----------------------------------
  Same idea as a text input:
    value={sortBy}                         ← from parent state
    onChange={(e) => onSortByChange(...)}  ← parent setter

  You passed setSortBy and setSortDirection directly from TodosPage.
  That is clean. No extra wrapper function needed.

  How it connects
  ---------------
  User picks "Title" → setSortBy('title') → TodosPage re-renders →
  useEffect sees sortBy changed → fetch with ?sortBy=title.

  You do not sort the array in this file. The SERVER sorts. This
  component is only the controls.

  This file is in good shape. Optional polish: consistent quotes and
  less blank space inside the <select>. No logic change required.
*/

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
