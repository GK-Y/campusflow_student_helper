import { useMemo, useState } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { StudySessionForm } from '../components/forms/StudySessionForm'
import { EmptyState } from '../components/common/EmptyState'
import { NoticeBanner } from '../components/common/NoticeBanner'
import { SectionHeading } from '../components/common/SectionHeading'
import { useAppData } from '../hooks/useAppData'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { formatDateTime } from '../utils/date'

function PlannerPage() {
  const {
    courses,
    sessions,
    createStudySession,
    updateStudySession,
    deleteStudySession,
    error,
  } = useAppData()
  const [editingSession, setEditingSession] = useState(null)
  const [saving, setSaving] = useState(false)
  useDocumentTitle('CampusFlow | Planner')

  const courseMap = useMemo(
    () => Object.fromEntries(courses.map((course) => [course.id, course])),
    [courses],
  )

  async function handleSubmit(payload) {
    setSaving(true)

    try {
      if (editingSession) {
        await updateStudySession(editingSession.id, payload)
        setEditingSession(null)
        return
      }

      await createStudySession(payload)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppShell
      title="Study Planner"
      subtitle="Turn workload into planned study time."
    >
      {error ? <NoticeBanner tone="danger">{error}</NoticeBanner> : null}

      <section className="surface-card page-section">
        {editingSession ? <NoticeBanner tone="highlight">Editing session: {editingSession.title}</NoticeBanner> : null}
        <SectionHeading
          eyebrow={editingSession ? 'Edit session' : 'Plan session'}
          title="Schedule focused work"
          description="Pick a course, date, and time slot."
        />

        {courses.length ? (
          <StudySessionForm
            busy={saving}
            courses={courses}
            initialData={editingSession}
            onCancel={() => setEditingSession(null)}
            onSubmit={handleSubmit}
          />
        ) : (
          <EmptyState
            title="No courses available"
            description="Create courses first so your planner reflects your actual semester load."
          />
        )}
      </section>

      <section className="surface-card page-section">
        <SectionHeading
          eyebrow="Timeline"
          title="Upcoming study sessions"
          description="Your next planned blocks."
        />

        {sessions.length ? (
          <div className="list-stack">
            {sessions.map((session) => (
              <article
                className={`list-item detailed-item ${editingSession?.id === session.id ? 'item-editing' : ''}`}
                key={session.id}
              >
                <div>
                  <strong>{session.title}</strong>
                  <p>
                    {courseMap[session.course_id]?.title || 'Unknown course'} · {formatDateTime(session.session_date)}
                  </p>
                </div>
                <div className="inline-actions end">
                  <span className="pill">{session.duration_minutes} min</span>
                  <span className="pill muted-pill">{session.format}</span>
                  <button className="text-button edit-text" onClick={() => setEditingSession(session)}>
                    Edit
                  </button>
                  <button className="text-button danger-text" onClick={() => deleteStudySession(session.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Your planner is empty"
            description="Add a few revision blocks to make your semester plan realistic."
          />
        )}
      </section>
    </AppShell>
  )
}

export default PlannerPage
