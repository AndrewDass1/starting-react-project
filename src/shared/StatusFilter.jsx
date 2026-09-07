import { useSearchParams } from 'react-router';

export default function StatusFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const status = searchParams.get('status') || 'all';

  function handleChange(event) {
    const newStatus = event.target.value;

    if (newStatus === 'all') {
      searchParams.delete('status');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ status: newStatus });
    }
  }

  return (
    <div>
      <label htmlFor="statusFilter">Show:</label>
      <select id="statusFilter" value={status} onChange={handleChange}>
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );
}