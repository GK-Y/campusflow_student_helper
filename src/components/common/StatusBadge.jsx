const labelMap = {
  pending: 'Pending',
  in_progress: 'In Progress',
  submitted: 'Submitted',
}

export function StatusBadge({ status }) {
  return <span className={`status-badge status-${status}`}>{labelMap[status] || status}</span>
}
