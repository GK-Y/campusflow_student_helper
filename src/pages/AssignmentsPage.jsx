import { useDeferredValue, useMemo, useState } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { AssignmentForm } from '../components/forms/AssignmentForm'
import { EmptyState } from '../components/common/EmptyState'
import { NoticeBanner } from '../components/common/NoticeBanner'
import { SectionHeading } from '../components/common/SectionHeading'
import { StatusBadge } from '../components/common/StatusBadge'
import { useAppData } from '../hooks/useAppData'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatDate } from '../utils/date'

function AssignmentsPage() {
  const {
    courses,
    assignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    error,
  } = useAppData()
  const [editingAssignment, setEditingAssignment] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [saving, setSaving] = useState(false)
  const deferredSearch = useDeferredValue(search)
  useDocumentTitle('CampusFlow | Assignments')

  const courseMap = useMemo(
    () => Object.fromEntries(courses.map((course) => [course.id, course])),
    [courses],
  )

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const matchesSearch = assignment.title
        .toLowerCase()
        .includes(deferredSearch.trim().toLowerCase())
      const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [assignments, deferredSearch, statusFilter])

  async function handleSubmit(payload) {
    setSaving(true)

    try {
      if (editingAssignment) {
        await updateAssignment(editingAssignment.id, payload)
        setEditingAssignment(null)
        return
      }

      await createAssignment(payload)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppShell
      title="Assignments"
      subtitle="Track due dates, submission status, and priority without losing course context."
    >
      {error ? <NoticeBanner tone="danger">{error}</NoticeBanner> : null}

      <section className="surface-card page-section">
        {editingAssignment ? (
          <NoticeBanner tone="highlight">Editing assignment: {editingAssignment.title}</NoticeBanner>
        ) : null}
        <SectionHeading
          eyebrow={editingAssignment ? 'Edit assignment' : 'Add assignment'}
          title="Capture every deliverable"
          description="Use controlled forms to keep due dates and progress states accurate."
        />

        {courses.length ? (
          <AssignmentForm
            busy={saving}
            courses={courses}
            initialData={editingAssignment}
            onCancel={() => setEditingAssignment(null)}
            onSubmit={handleSubmit}
          />
        ) : (
          <EmptyState
            title="Add a course before assignments"
            description="Assignments need a parent course so workload stays grouped logically."
          />
        )}
      </section>

      <section className="surface-card page-section">
        <SectionHeading
          eyebrow="Work queue"
          title="Assignment tracker"
          description="Search by title and filter by status to spot what needs action."
          action={
            <div className="filter-row compact">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search assignments"
              />
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In progress</option>
                <option value="submitted">Submitted</option>
              </select>
            </div>
          }
        />

        {filteredAssignments.length ? (
          <div className="table-like-list">
            {filteredAssignments.map((assignment) => (
              <div
                className={`table-row ${editingAssignment?.id === assignment.id ? 'item-editing' : ''}`}
                key={assignment.id}
              >
                <div>
                  <strong>{assignment.title}</strong>
                  <p>
                    {courseMap[assignment.course_id]?.title || 'Unknown course'} · Due{' '}
                    {formatDate(assignment.due_date)}
                  </p>
                </div>
                <p>{assignment.priority}</p>
                <StatusBadge status={assignment.status} />
                <div className="inline-actions end">
                  <button className="text-button edit-text" onClick={() => setEditingAssignment(assignment)}>
                    Edit
                  </button>
                  <button
                    className="text-button danger-text"
                    onClick={() => deleteAssignment(assignment.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No assignments match"
            description="Try a different filter or create a new assignment to start tracking progress."
          />
        )}
      </section>
    </AppShell>
  )
}

export default AssignmentsPage
