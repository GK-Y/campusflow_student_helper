export function formatDate(dateString, options = {}) {
  if (!dateString) {
    return 'No date'
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(new Date(dateString))
}

export function formatDateTime(dateString) {
  if (!dateString) {
    return 'No schedule'
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(dateString))
}

export function getDaysUntil(dateString) {
  const today = new Date()
  const target = new Date(dateString)
  const difference = target.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0)
  return Math.round(difference / (1000 * 60 * 60 * 24))
}
